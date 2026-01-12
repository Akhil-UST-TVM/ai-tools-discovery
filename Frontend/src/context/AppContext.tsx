import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
  useEffect,
} from "react";
import { AITool, Review, FilterState, Category, PricingModel } from "@/types";
import { useAuth } from "@/context/AuthContext";
import {
  getTools,
  getApprovedReviews,
  createTool,
  updateToolApi,
  deleteToolApi,
  getPendingReviews,
  updateReviewStatus,
} from "@/lib/api";
// NOTE: previously this file used local mock data. We now fetch from backend on mount.

interface AppContextType {
  tools: AITool[];
  reviews: Review[];
  filters: FilterState;
  isAdmin: boolean;
  setFilters: (filters: FilterState) => void;
  addTool: (
    tool: Omit<
      AITool,
      "id" | "createdAt" | "updatedAt" | "averageRating" | "totalReviews"
    >
  ) => void;
  updateTool: (id: string, tool: Partial<AITool>) => void;
  deleteTool: (id: string) => void;
  addReview: (review: Omit<Review, "id" | "createdAt" | "status">) => void;
  approveReview: (reviewId: string) => void;
  rejectReview: (reviewId: string) => void;
  getToolById: (id: string) => AITool | undefined;
  getReviewsForTool: (toolId: string) => Review[];
  getFilteredTools: () => AITool[];
}

const defaultFilters: FilterState = {
  categories: [],
  pricingModels: [],
  minRating: 0,
  searchQuery: "",
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [tools, setTools] = useState<AITool[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  // derive admin state from AuthContext (JWT-backed)
  const { user, token } = useAuth();
  const isAdmin = Boolean(user && user.role === "admin");

  const addTool = useCallback(
    (
      toolData: Omit<
        AITool,
        "id" | "createdAt" | "updatedAt" | "averageRating" | "totalReviews"
      >
    ) => {
      // optimistic local add so UI is responsive
      const newTool: AITool = {
        ...toolData,
        id: `tool-${Date.now()}`,
        averageRating: 0,
        totalReviews: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setTools((prev) => [...prev, newTool]);

      // If current user is admin and we have a token, persist to backend
      if (isAdmin && token) {
        (async () => {
          try {
            await createTool(
              {
                name: toolData.name,
                description: toolData.description,
                useCase: toolData.useCase,
                category: toolData.category,
                pricing: toolData.pricingModel,
                website: (toolData as any).website,
              },
              token
            );

            // reload tools from server to ensure canonical IDs and fields
            const toolsData: any[] = await getTools();
            const mappedTools: AITool[] = (toolsData || []).map((t: any) => {
              const pricing: any = t.pricing ?? t.pricingModel ?? "Free";
              const avg = t.avgRating ?? t.averageRating ?? 0;
              return {
                id: String(t.id ?? t._id ?? ""),
                name: t.name ?? "Unnamed Tool",
                description: t.description ?? "",
                useCase: t.useCase ?? "",
                category: (t.category as Category) ?? "Dev Tools",
                pricingModel: (pricing as PricingModel) ?? "Free",
                averageRating: Number(avg) || 0,
                totalReviews: Number(t.reviewCount ?? t.totalReviews ?? 0) || 0,
                website: t.website ?? undefined,
                createdAt: t.createdAt ?? new Date().toISOString(),
                updatedAt: t.updatedAt ?? new Date().toISOString(),
              } as AITool;
            });

            setTools(mappedTools);
          } catch (err) {
            // keep optimistic local tool if backend call fails
            // console.error('Failed to create tool on server', err);
          }
        })();
      }
    },
    [isAdmin, token]
  );

  const updateTool = useCallback(
    (id: string, updates: Partial<AITool>) => {
      // optimistic local update
      setTools((prev) =>
        prev.map((tool) =>
          tool.id === id
            ? { ...tool, ...updates, updatedAt: new Date().toISOString() }
            : tool
        )
      );

      // If admin, persist update and refresh canonical list
      if (isAdmin && token) {
        (async () => {
          try {
            await updateToolApi(
              id,
              {
                name: updates.name,
                description: updates.description,
                useCase: updates.useCase,
                category: updates.category,
                pricing: updates.pricingModel,
                website: (updates as any).website,
              },
              token
            );

            const toolsData: any[] = await getTools();
            const mappedTools: AITool[] = (toolsData || []).map((t: any) => {
              const pricing: any = t.pricing ?? t.pricingModel ?? "Free";
              const avg = t.avgRating ?? t.averageRating ?? 0;
              return {
                id: String(t.id ?? t._id ?? ""),
                name: t.name ?? "Unnamed Tool",
                description: t.description ?? "",
                useCase: t.useCase ?? "",
                category: (t.category as Category) ?? "Dev Tools",
                pricingModel: (pricing as PricingModel) ?? "Free",
                averageRating: Number(avg) || 0,
                totalReviews: Number(t.reviewCount ?? t.totalReviews ?? 0) || 0,
                website: t.website ?? undefined,
                createdAt: t.createdAt ?? new Date().toISOString(),
                updatedAt: t.updatedAt ?? new Date().toISOString(),
              } as AITool;
            });

            setTools(mappedTools);
          } catch (err) {
            // console.error('Failed to update tool on server', err);
          }
        })();
      }
    },
    [isAdmin, token]
  );

  const deleteTool = useCallback(
    (id: string) => {
      // optimistic local delete
      setTools((prev) => prev.filter((tool) => tool.id !== id));
      setReviews((prev) => prev.filter((review) => review.toolId !== id));

      if (isAdmin && token) {
        (async () => {
          try {
            await deleteToolApi(id, token);
            const toolsData: any[] = await getTools();
            const mappedTools: AITool[] = (toolsData || []).map((t: any) => {
              const pricing: any = t.pricing ?? t.pricingModel ?? "Free";
              const avg = t.avgRating ?? t.averageRating ?? 0;
              return {
                id: String(t.id ?? t._id ?? ""),
                name: t.name ?? "Unnamed Tool",
                description: t.description ?? "",
                useCase: t.useCase ?? "",
                category: (t.category as Category) ?? "Dev Tools",
                pricingModel: (pricing as PricingModel) ?? "Free",
                averageRating: Number(avg) || 0,
                totalReviews: Number(t.reviewCount ?? t.totalReviews ?? 0) || 0,
                website: t.website ?? undefined,
                createdAt: t.createdAt ?? new Date().toISOString(),
                updatedAt: t.updatedAt ?? new Date().toISOString(),
              } as AITool;
            });

            setTools(mappedTools);
          } catch (err) {
            // console.error('Failed to delete tool on server', err);
          }
        })();
      }
    },
    [isAdmin, token]
  );

  const recalculateRating = useCallback(
    (toolId: string) => {
      const approvedReviews = reviews.filter(
        (r) => r.toolId === toolId && r.status === "approved"
      );

      if (approvedReviews.length === 0) {
        setTools((prev) =>
          prev.map((tool) =>
            tool.id === toolId
              ? { ...tool, averageRating: 0, totalReviews: 0 }
              : tool
          )
        );
        return;
      }

      const avgRating =
        approvedReviews.reduce((sum, r) => sum + r.rating, 0) /
        approvedReviews.length;

      setTools((prev) =>
        prev.map((tool) =>
          tool.id === toolId
            ? {
                ...tool,
                averageRating: Math.round(avgRating * 10) / 10,
                totalReviews: approvedReviews.length,
              }
            : tool
        )
      );
    },
    [reviews]
  );

  // Fetch tools and approved reviews from backend on mount
  useEffect(() => {
    let mounted = true;
    async function loadFromApi() {
      try {
        const toolsData: any[] = await getTools();

        const mappedTools: AITool[] = (toolsData || []).map((t: any) => {
          const pricing: any = t.pricing ?? t.pricingModel ?? "Free";
          const avg = t.avgRating ?? t.averageRating ?? 0;
          return {
            id: String(t.id ?? t._id ?? ""),
            name: t.name ?? "Unnamed Tool",
            description: t.description ?? "",
            useCase: t.useCase ?? "",
            category: (t.category as Category) ?? "Dev Tools",
            pricingModel: (pricing as PricingModel) ?? "Free",
            averageRating: Number(avg) || 0,
            totalReviews: Number(t.reviewCount ?? t.totalReviews ?? 0) || 0,
            website: t.website ?? undefined,
            createdAt: t.createdAt ?? new Date().toISOString(),
            updatedAt: t.updatedAt ?? new Date().toISOString(),
          } as AITool;
        });

        if (!mounted) return;
        setTools(mappedTools);

        // fetch approved reviews per tool (small dataset assumed)
        const reviewsArrays = await Promise.all(
          mappedTools.map((mt) =>
            getApprovedReviews(String(mt.id)).catch(() => [])
          )
        );

        const mappedReviews: Review[] = reviewsArrays.flat().map((r: any) => ({
          id: String(r.id ?? r._id ?? ""),
          toolId: String(r.toolId ?? r.toolId),
          userId: String(r.userId ?? ""),
          userName: String(r.username ?? r.userName ?? ""),
          rating: Number(r.rating ?? 0),
          comment: r.comment ?? "",
          status: (r.status ?? "approved") as Review["status"],
          createdAt: r.createdAt ?? new Date().toISOString(),
        }));

        if (!mounted) return;
        setReviews(mappedReviews);

        // If admin, also fetch pending reviews (server-side) and merge them in
        if (isAdmin && token) {
          try {
            const pending: any[] = await getPendingReviews(token).catch(
              () => []
            );
            const mappedPending: Review[] = (pending || []).map((r: any) => ({
              id: String(r.id ?? r._id ?? ""),
              toolId: String(r.toolId ?? r.toolId),
              userId: String(r.userId ?? ""),
              userName: String(r.username ?? r.userName ?? ""),
              rating: Number(r.rating ?? 0),
              comment: r.comment ?? "",
              status: (r.status ?? "pending") as Review["status"],
              createdAt: r.createdAt ?? new Date().toISOString(),
            }));

            // avoid duplicates: create map of existing ids
            const existingIds = new Set(mappedReviews.map((r) => r.id));
            const merged = [...mappedReviews];
            for (const p of mappedPending) {
              if (!existingIds.has(p.id)) merged.push(p);
            }

            if (!mounted) return;
            setReviews(merged);
          } catch (err) {
            // console.error('Failed to load pending reviews', err);
          }
        }
      } catch (err) {
        // keep local mock behavior if backend unreachable
        // console.error('Error loading API data', err);
      }
    }

    loadFromApi();
    return () => {
      mounted = false;
    };
  }, [isAdmin, token]);

  const addReview = useCallback(
    (reviewData: Omit<Review, "id" | "createdAt" | "status">) => {
      const newReview: Review = {
        ...reviewData,
        id: `review-${Date.now()}`,
        status: "pending",
        createdAt: new Date().toISOString(),
      };
      setReviews((prev) => [...prev, newReview]);
    },
    []
  );

  const approveReview = useCallback(
    (reviewId: string) => {
      const review = reviews.find((r) => r.id === reviewId);
      if (!review) return;

      setReviews((prev) =>
        prev.map((r) =>
          r.id === reviewId ? { ...r, status: "approved" as const } : r
        )
      );

      // persist approve on server if admin
      if (isAdmin && token) {
        (async () => {
          try {
            await updateReviewStatus(reviewId, "approved", token);
          } catch (err) {
            // console.error('Failed to persist review approve', err);
          }
        })();
      }

      // Recalculate rating after state update
      setTimeout(() => {
        const updatedReviews = reviews.map((r) =>
          r.id === reviewId ? { ...r, status: "approved" as const } : r
        );
        const approvedReviews = updatedReviews.filter(
          (r) => r.toolId === review.toolId && r.status === "approved"
        );
        const avgRating =
          approvedReviews.reduce((sum, r) => sum + r.rating, 0) /
          approvedReviews.length;

        setTools((prev) =>
          prev.map((tool) =>
            tool.id === review.toolId
              ? {
                  ...tool,
                  averageRating: Math.round(avgRating * 10) / 10,
                  totalReviews: approvedReviews.length,
                }
              : tool
          )
        );
      }, 0);
    },
    [reviews, isAdmin, token]
  );

  const rejectReview = useCallback(
    (reviewId: string) => {
      setReviews((prev) =>
        prev.map((r) =>
          r.id === reviewId ? { ...r, status: "rejected" as const } : r
        )
      );

      if (isAdmin && token) {
        (async () => {
          try {
            await updateReviewStatus(reviewId, "rejected", token);
          } catch (err) {
            // console.error('Failed to persist review rejection', err);
          }
        })();
      }
    },
    [isAdmin, token]
  );

  const getToolById = useCallback(
    (id: string) => tools.find((tool) => tool.id === id),
    [tools]
  );

  const getReviewsForTool = useCallback(
    (toolId: string) => reviews.filter((review) => review.toolId === toolId),
    [reviews]
  );

  const getFilteredTools = useCallback(() => {
    return tools.filter((tool) => {
      // Category filter
      if (
        filters.categories.length > 0 &&
        !filters.categories.includes(tool.category)
      ) {
        return false;
      }

      // Pricing filter
      if (
        filters.pricingModels.length > 0 &&
        !filters.pricingModels.includes(tool.pricingModel)
      ) {
        return false;
      }

      // Rating filter
      if (tool.averageRating < filters.minRating) {
        return false;
      }

      // Search filter
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        return (
          tool.name.toLowerCase().includes(query) ||
          tool.description.toLowerCase().includes(query) ||
          tool.useCase.toLowerCase().includes(query)
        );
      }

      return true;
    });
  }, [tools, filters]);

  return (
    <AppContext.Provider
      value={{
        tools,
        reviews,
        filters,
        isAdmin,
        setFilters,
        addTool,
        updateTool,
        deleteTool,
        addReview,
        approveReview,
        rejectReview,
        getToolById,
        getReviewsForTool,
        getFilteredTools,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}

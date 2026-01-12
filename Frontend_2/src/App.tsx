import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "@/context/AppContext";
import Index from "./pages/Index";
import ToolDetail from "./pages/ToolDetail";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import { AuthProvider } from "@/context/AuthContext";
import RequireRole from "@/components/auth/RequireRole";
import RequireAuth from "@/components/auth/RequireAuth";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <AppProvider>
          <Toaster />
          <Sonner />
          {/* Matrix background fixed on every page */}
          <div className="matrix-bg fixed inset-0 pointer-events-none z-0" />

          <div className="min-h-screen relative z-10">
            <BrowserRouter>
              <Routes>
              <Route
                path="/"
                element={
                  <RequireAuth>
                    <Index />
                  </RequireAuth>
                }
              />
              <Route
                path="/tool/:id"
                element={
                  <RequireAuth>
                    <ToolDetail />
                  </RequireAuth>
                }
              />
              <Route
                path="/admin"
                element={
                  <RequireRole role="admin">
                    <Admin />
                  </RequireRole>
                }
              />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </div>
        </AppProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

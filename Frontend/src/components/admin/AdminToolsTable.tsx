import { useState } from 'react';
import { Pencil, Trash2, Plus } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useApp } from '@/context/AppContext';
import { AITool } from '@/types';
import { CategoryBadge } from '@/components/tools/CategoryBadge';
import { PricingBadge } from '@/components/tools/PricingBadge';
import { StarRating } from '@/components/tools/StarRating';
import { ToolFormDialog } from './ToolFormDialog';
import { toast } from 'sonner';

export function AdminToolsTable() {
  const { tools, deleteTool } = useApp();
  const [formOpen, setFormOpen] = useState(false);
  const [editingTool, setEditingTool] = useState<AITool | undefined>();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [toolToDelete, setToolToDelete] = useState<AITool | null>(null);

  const handleEdit = (tool: AITool) => {
    setEditingTool(tool);
    setFormOpen(true);
  };

  const handleAdd = () => {
    setEditingTool(undefined);
    setFormOpen(true);
  };

  const handleDeleteClick = (tool: AITool) => {
    setToolToDelete(tool);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (toolToDelete) {
      deleteTool(toolToDelete.id);
      toast.success('Tool deleted successfully!');
    }
    setDeleteDialogOpen(false);
    setToolToDelete(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-xl font-semibold">Manage Tools</h2>
        <Button onClick={handleAdd} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Tool
        </Button>
      </div>

      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Pricing</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Reviews</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tools.map(tool => (
              <TableRow key={tool.id}>
                <TableCell className="font-medium">{tool.name}</TableCell>
                <TableCell>
                  <CategoryBadge category={tool.category} />
                </TableCell>
                <TableCell>
                  <PricingBadge pricing={tool.pricingModel} />
                </TableCell>
                <TableCell>
                  <StarRating rating={tool.averageRating} size="sm" showValue />
                </TableCell>
                <TableCell>{tool.totalReviews}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(tool)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteClick(tool)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <ToolFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        tool={editingTool}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Tool</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{toolToDelete?.name}"? This action
              cannot be undone and will also delete all associated reviews.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

import { useState } from 'react';
import { Plus, Pencil, Trash2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import {
  useExpenseCategories,
  useCreateExpenseCategory,
  useUpdateExpenseCategory,
  useDeleteExpenseCategory,
} from '../hooks/use-expenses';
import type { ExpenseCategory } from '../hooks/use-expenses';

export function CategoryManager() {
  const { data: categories, isLoading } = useExpenseCategories();
  const createCategory = useCreateExpenseCategory();
  const updateCategory = useUpdateExpenseCategory();
  const deleteCategory = useDeleteExpenseCategory();

  const [newName, setNewName] = useState('');
  const [editingCategory, setEditingCategory] = useState<ExpenseCategory | null>(null);
  const [editName, setEditName] = useState('');
  const [deletingCategory, setDeletingCategory] = useState<ExpenseCategory | null>(null);

  const handleCreate = () => {
    if (!newName.trim()) return;
    createCategory.mutate({ name: newName.trim() }, {
      onSuccess: () => setNewName(''),
    });
  };

  const handleUpdate = () => {
    if (!editingCategory || !editName.trim()) return;
    updateCategory.mutate(
      { id: editingCategory.id, data: { name: editName.trim() } },
      { onSuccess: () => { setEditingCategory(null); setEditName(''); } },
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          placeholder="New category name"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
        />
        <Button
          size="sm"
          onClick={handleCreate}
          disabled={!newName.trim() || createCategory.isPending}
        >
          {createCategory.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-10 bg-muted animate-pulse rounded" />
          ))}
        </div>
      ) : categories && categories.length > 0 ? (
        <div className="space-y-2">
          {categories.map((cat) => (
            <div key={cat.id} className="flex items-center justify-between rounded-md border p-2">
              {editingCategory?.id === cat.id ? (
                <div className="flex flex-1 gap-2">
                  <Input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleUpdate()}
                    autoFocus
                  />
                  <Button size="sm" onClick={handleUpdate} disabled={updateCategory.isPending}>
                    {updateCategory.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Save'}
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => { setEditingCategory(null); setEditName(''); }}>
                    Cancel
                  </Button>
                </div>
              ) : (
                <>
                  <div>
                    <span className="text-sm font-medium">{cat.name}</span>
                    {cat._count && cat._count.expenses > 0 && (
                      <span className="ml-2 text-xs text-muted-foreground">({cat._count.expenses})</span>
                    )}
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => { setEditingCategory(cat); setEditName(cat.name); }}
                      aria-label="Edit category"
                    >
                      <Pencil className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setDeletingCategory(cat)}
                      aria-label="Delete category"
                    >
                      <Trash2 className="h-3 w-3 text-destructive" />
                    </Button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">No categories yet. Create one above.</p>
      )}

      <AlertDialog open={!!deletingCategory} onOpenChange={(open) => !open && setDeletingCategory(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Category</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{deletingCategory?.name}&quot;? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deletingCategory) {
                  deleteCategory.mutate(deletingCategory.id, {
                    onSuccess: () => setDeletingCategory(null),
                  });
                }
              }}
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

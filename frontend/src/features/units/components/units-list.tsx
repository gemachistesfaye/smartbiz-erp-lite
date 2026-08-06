import { useState } from 'react';
import { Plus, Pencil, Trash2, Ruler } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
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
import { DataTable, Column } from '@/components/shared/data-table';
import { UnitForm } from './unit-form';
import { useUnits, useDeleteUnit } from '../hooks/use-units';
import { formatDateTime } from '@/lib/utils';
import type { Unit } from '@/types/models';

export function UnitsList() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingUnit, setEditingUnit] = useState<Unit | null>(null);
  const [deletingUnit, setDeletingUnit] = useState<Unit | null>(null);

  const { data, isLoading } = useUnits({ search, page, limit: 20 });
  const deleteUnit = useDeleteUnit();

  const units = data?.data || [];

  const columns: Column<Unit>[] = [
    {
      key: 'name',
      header: 'Name',
      sortable: true,
      render: (row) => <span className="font-medium">{row.name}</span>,
    },
    {
      key: 'symbol',
      header: 'Symbol',
      render: (row) => (
        <Badge variant="outline">{row.symbol}</Badge>
      ),
    },
    {
      key: 'description',
      header: 'Description',
      render: (row) => row.description || '-',
    },
    {
      key: 'products',
      header: 'Products',
      render: (row) => (
        <Badge variant="secondary">{row._count?.products || 0}</Badge>
      ),
    },
    {
      key: 'isActive',
      header: 'Status',
      render: (row) => (
        <Badge variant={row.isActive ? 'default' : 'secondary'}>
          {row.isActive ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
    {
      key: 'createdAt',
      header: 'Created',
      sortable: true,
      render: (row) => formatDateTime(row.createdAt),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (row) => (
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setEditingUnit(row)}
            aria-label="Edit unit"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setDeletingUnit(row)}
            aria-label="Delete unit"
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Units</h1>
          <p className="text-muted-foreground">Manage your measurement units</p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Unit
        </Button>
      </div>

      {units.length === 0 && !isLoading && !search ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
          <Ruler className="h-12 w-12 text-muted-foreground/50" />
          <h3 className="mt-4 text-lg font-semibold">No units yet</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Create your first unit to measure your products.
          </p>
          <Button className="mt-4" onClick={() => setShowCreateDialog(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Unit
          </Button>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={units as unknown as Record<string, unknown>[]}
          searchable
          searchPlaceholder="Search units..."
          onSearch={setSearch}
          pageSize={20}
          loading={isLoading}
          emptyMessage="No units found."
        />
      )}

      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Unit</DialogTitle>
          </DialogHeader>
          <UnitForm onSuccess={() => setShowCreateDialog(false)} onCancel={() => setShowCreateDialog(false)} />
        </DialogContent>
      </Dialog>

      <Dialog open={!!editingUnit} onOpenChange={(open) => !open && setEditingUnit(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Unit</DialogTitle>
          </DialogHeader>
          {editingUnit && (
            <UnitForm
              unit={editingUnit}
              onSuccess={() => setEditingUnit(null)}
              onCancel={() => setEditingUnit(null)}
            />
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deletingUnit} onOpenChange={(open) => !open && setDeletingUnit(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Unit</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{deletingUnit?.name}&quot;? This action can be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deletingUnit) {
                  deleteUnit.mutate(deletingUnit.id, {
                    onSuccess: () => setDeletingUnit(null),
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

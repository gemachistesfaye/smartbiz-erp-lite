import { useState } from 'react';
import { Plus, Pencil, ShieldCheck, UserX, UserCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
import { formatDate } from '@/lib/utils';
import { ROLE_LABELS } from '@/lib/constants';
import { UserForm } from './user-form';
import {
  useUsers,
  useDeactivateUser,
  useActivateUser,
} from '../hooks/use-users';
import { useAuthStore } from '@/features/auth/store/auth-store';
import type { User } from '@/types/models';

export function UsersList() {
  const { user: currentUser } = useAuthStore();
  const { data: usersData, isLoading } = useUsers();
  const deactivateUser = useDeactivateUser();
  const activateUser = useActivateUser();

  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [targetUser, setTargetUser] = useState<User | null>(null);
  const [actionType, setActionType] = useState<'deactivate' | 'activate' | null>(null);

  const users = usersData?.data || [];

  const handleAction = () => {
    if (!targetUser || !actionType) return;
    if (actionType === 'deactivate') {
      deactivateUser.mutate(targetUser.id, {
        onSuccess: () => { setTargetUser(null); setActionType(null); },
      });
    } else {
      activateUser.mutate(targetUser.id, {
        onSuccess: () => { setTargetUser(null); setActionType(null); },
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Users</h1>
          <p className="text-muted-foreground">Manage your team members and their roles</p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </div>

      {users.length === 0 && !isLoading ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
          <ShieldCheck className="h-12 w-12 text-muted-foreground/50" />
          <h3 className="mt-4 text-lg font-semibold">No team members yet</h3>
          <p className="mt-2 text-sm text-muted-foreground max-w-sm">
            Add employees to your business to start managing your team.
          </p>
          <Button className="mt-4" onClick={() => setShowCreateDialog(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add User
          </Button>
        </div>
      ) : (
        <div className="rounded-md border overflow-x-auto">
          <table className="w-full caption-bottom text-sm">
            <thead className="border-b">
              <tr>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Name</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Email</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Role</th>
                <th className="h-12 px-4 text-center align-middle font-medium text-muted-foreground">Status</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Created</th>
                <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b">
                    <td colSpan={6} className="p-4"><div className="h-8 bg-muted animate-pulse rounded" /></td>
                  </tr>
                ))
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="h-24 text-center text-muted-foreground">No users found.</td>
                </tr>
              ) : (
                users.map((u) => {
                  const isCurrentUser = u.id === currentUser?.id;
                  const isOwner = u.role === 'OWNER';
                  return (
                    <tr key={u.id} className="border-b transition-colors hover:bg-muted/50">
                      <td className="p-4">
                        <div className="font-medium">
                          {u.firstName} {u.lastName || ''}
                          {isCurrentUser && (
                            <Badge variant="outline" className="ml-2 text-xs">You</Badge>
                          )}
                        </div>
                      </td>
                      <td className="p-4 text-muted-foreground">{u.email}</td>
                      <td className="p-4">
                        <Badge variant={isOwner ? 'default' : 'secondary'}>
                          {ROLE_LABELS[u.role] || u.role}
                        </Badge>
                      </td>
                      <td className="p-4 text-center">
                        <Badge variant={u.isActive ? 'default' : 'destructive'}>
                          {u.isActive ? 'Active' : 'Disabled'}
                        </Badge>
                      </td>
                      <td className="p-4 text-muted-foreground">{formatDate(u.createdAt)}</td>
                      <td className="p-4">
                        <div className="flex items-center justify-end gap-1">
                          {!isOwner && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setEditingUser(u)}
                              aria-label="Edit user"
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                          )}
                          {!isOwner && !isCurrentUser && (
                            u.isActive ? (
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => { setTargetUser(u); setActionType('deactivate'); }}
                                aria-label="Deactivate user"
                              >
                                <UserX className="h-4 w-4 text-destructive" />
                              </Button>
                            ) : (
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => { setTargetUser(u); setActionType('activate'); }}
                                aria-label="Activate user"
                              >
                                <UserCheck className="h-4 w-4 text-green-600" />
                              </Button>
                            )
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}

      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add User</DialogTitle>
          </DialogHeader>
          <UserForm onSuccess={() => setShowCreateDialog(false)} onCancel={() => setShowCreateDialog(false)} />
        </DialogContent>
      </Dialog>

      <Dialog open={!!editingUser} onOpenChange={(open) => !open && setEditingUser(null)}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
          </DialogHeader>
          {editingUser && (
            <UserForm
              user={editingUser}
              onSuccess={() => setEditingUser(null)}
              onCancel={() => setEditingUser(null)}
            />
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!targetUser} onOpenChange={(open) => { if (!open) { setTargetUser(null); setActionType(null); } }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {actionType === 'deactivate' ? 'Deactivate User' : 'Activate User'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {actionType === 'deactivate'
                ? `Are you sure you want to deactivate "${targetUser?.firstName} ${targetUser?.lastName}"? They will not be able to login.`
                : `Are you sure you want to activate "${targetUser?.firstName} ${targetUser?.lastName}"? They will be able to login again.`
              }
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => { setTargetUser(null); setActionType(null); }}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleAction}
              className={actionType === 'deactivate' ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90' : ''}
            >
              {actionType === 'deactivate' ? 'Deactivate' : 'Activate'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

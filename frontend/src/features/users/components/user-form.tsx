import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCreateUser, useUpdateUser } from '../hooks/use-users';
import type { User } from '@/types/models';

const createUserSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(100),
  lastName: z.string().max(100).optional(),
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role: z.enum(['OWNER', 'MANAGER', 'CASHIER']),
  phone: z.string().max(20).optional().or(z.literal('')),
});

const updateUserSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(100),
  lastName: z.string().max(100).optional().or(z.literal('')),
  role: z.enum(['OWNER', 'MANAGER', 'CASHIER']),
  phone: z.string().max(20).optional().or(z.literal('')),
});

interface UserFormProps {
  user?: User;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function UserForm({ user, onSuccess, onCancel }: UserFormProps) {
  const createUser = useCreateUser();
  const updateUser = useUpdateUser();
  const isEditing = !!user;

  const createForm = useForm<z.infer<typeof createUserSchema>>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      role: 'CASHIER',
      phone: '',
    },
  });

  const updateForm = useForm<z.infer<typeof updateUserSchema>>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      role: user?.role || 'CASHIER',
      phone: (user as any)?.phone || '',
    },
  });

  const isPending = createUser.isPending || updateUser.isPending;

  if (isEditing) {
    return (
      <form onSubmit={updateForm.handleSubmit((data) => {
        updateUser.mutate(
          { id: user!.id, data: { ...data, phone: data.phone || undefined } },
          { onSuccess: () => onSuccess?.() },
        );
      })} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name *</Label>
            <Input id="firstName" placeholder="e.g. Abebe" {...updateForm.register('firstName')} aria-invalid={!!updateForm.formState.errors.firstName} />
            {updateForm.formState.errors.firstName && <p className="text-sm text-destructive">{updateForm.formState.errors.firstName.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input id="lastName" placeholder="e.g. Kebede" {...updateForm.register('lastName')} />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="role">Role *</Label>
          <select
            id="role"
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            {...updateForm.register('role')}
          >
            <option value="CASHIER">Cashier</option>
            <option value="MANAGER">Manager</option>
            <option value="OWNER">Owner</option>
          </select>
          {updateForm.formState.errors.role && <p className="text-sm text-destructive">{updateForm.formState.errors.role.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" placeholder="e.g. +251911234567" {...updateForm.register('phone')} />
        </div>

        <div className="flex justify-end gap-2 pt-2">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              'Update User'
            )}
          </Button>
        </div>
      </form>
    );
  }

  return (
    <form onSubmit={createForm.handleSubmit((data) => {
      createUser.mutate(
        { ...data, lastName: data.lastName || '', phone: data.phone || undefined },
        { onSuccess: () => onSuccess?.() },
      );
    })} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name *</Label>
          <Input id="firstName" placeholder="e.g. Abebe" {...createForm.register('firstName')} aria-invalid={!!createForm.formState.errors.firstName} />
          {createForm.formState.errors.firstName && <p className="text-sm text-destructive">{createForm.formState.errors.firstName.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name</Label>
          <Input id="lastName" placeholder="e.g. Kebede" {...createForm.register('lastName')} />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email *</Label>
        <Input id="email" type="email" placeholder="e.g. abebe@example.com" {...createForm.register('email')} aria-invalid={!!createForm.formState.errors.email} />
        {createForm.formState.errors.email && <p className="text-sm text-destructive">{createForm.formState.errors.email.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password *</Label>
        <Input id="password" type="password" placeholder="At least 8 characters" {...createForm.register('password')} aria-invalid={!!createForm.formState.errors.password} />
        {createForm.formState.errors.password && <p className="text-sm text-destructive">{createForm.formState.errors.password.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="role">Role *</Label>
        <select
          id="role"
          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          {...createForm.register('role')}
        >
          <option value="CASHIER">Cashier</option>
          <option value="MANAGER">Manager</option>
          <option value="OWNER">Owner</option>
        </select>
        {createForm.formState.errors.role && <p className="text-sm text-destructive">{createForm.formState.errors.role.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Phone</Label>
        <Input id="phone" placeholder="e.g. +251911234567" {...createForm.register('phone')} />
      </div>

      <div className="flex justify-end gap-2 pt-2">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={isPending}>
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating...
            </>
          ) : (
            'Create User'
          )}
        </Button>
      </div>
    </form>
  );
}

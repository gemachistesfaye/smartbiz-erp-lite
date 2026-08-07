import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Mail, Shield, Calendar, Building2, Lock, User } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useCurrentUser } from '@/features/auth/hooks/use-auth';
import { useAuthStore } from '@/features/auth/store/auth-store';
import { useUpdateProfile, useChangePassword } from '@/features/users/hooks/use-users';
import { ROLE_LABELS } from '@/lib/constants';
import { formatDate } from '@/lib/utils';

const profileSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(100),
  lastName: z.string().max(100).optional().or(z.literal('')),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(8, 'New password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

type ProfileFormData = z.infer<typeof profileSchema>;
type PasswordFormData = z.infer<typeof passwordSchema>;

export function ProfilePage() {
  const { user } = useAuthStore();
  const { data: currentUser } = useCurrentUser();
  const updateProfile = useUpdateProfile();
  const changePassword = useChangePassword();
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  const profileForm = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
    },
  });

  const passwordForm = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
  });

  const userInitials = user
    ? `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase()
    : '?';

  const displayUser = currentUser || user;

  const onUpdateProfile = (data: ProfileFormData) => {
    updateProfile.mutate(data);
  };

  const onChangePassword = (data: PasswordFormData) => {
    if (!user?.id) return;
    changePassword.mutate(
      { id: user.id, currentPassword: data.currentPassword, newPassword: data.newPassword },
      {
        onSuccess: () => {
          passwordForm.reset();
          setShowPasswordForm(false);
        },
      },
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Profile</h1>
        <p className="text-muted-foreground">Manage your account information and security</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <Avatar className="h-24 w-24 mb-4">
                <AvatarImage
                  src={displayUser?.email ? `https://ui-avatars.com/api/?name=${displayUser.firstName}+${displayUser.lastName}&background=0D8ABC&color=fff&size=192` : undefined}
                  alt={displayUser ? `${displayUser.firstName} ${displayUser.lastName}` : 'User'}
                />
                <AvatarFallback className="text-2xl">{userInitials}</AvatarFallback>
              </Avatar>
              <h2 className="text-xl font-semibold">
                {displayUser ? `${displayUser.firstName} ${displayUser.lastName}` : 'User'}
              </h2>
              <p className="text-muted-foreground text-sm mt-1">{displayUser?.email}</p>
              <Badge variant={displayUser?.role === 'OWNER' ? 'default' : 'secondary'} className="mt-2">
                {displayUser?.role ? ROLE_LABELS[displayUser.role] : 'Role'}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-muted-foreground" />
                <div>
                  <CardTitle className="text-base">Personal Information</CardTitle>
                  <CardDescription>Update your name and profile details</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    Email
                  </div>
                  <p className="font-medium">{displayUser?.email}</p>
                  <p className="text-xs text-muted-foreground">Email cannot be changed</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Shield className="h-4 w-4" />
                    Role
                  </div>
                  <p className="font-medium">{displayUser?.role ? ROLE_LABELS[displayUser.role] : 'Role'}</p>
                  <p className="text-xs text-muted-foreground">Contact your administrator to change role</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Building2 className="h-4 w-4" />
                    Business
                  </div>
                  <p className="font-medium">Your Business</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    Member Since
                  </div>
                  <p className="font-medium">{displayUser?.createdAt ? formatDate(displayUser.createdAt) : '-'}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <CardTitle className="text-base">Edit Profile</CardTitle>
                    <CardDescription>Update your first and last name</CardDescription>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={profileForm.handleSubmit(onUpdateProfile)} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input id="firstName" {...profileForm.register('firstName')} aria-invalid={!!profileForm.formState.errors.firstName} />
                    {profileForm.formState.errors.firstName && (
                      <p className="text-sm text-destructive">{profileForm.formState.errors.firstName.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" {...profileForm.register('lastName')} />
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button type="submit" disabled={updateProfile.isPending || !profileForm.formState.isDirty}>
                    {updateProfile.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      'Save Changes'
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Lock className="h-5 w-5 text-muted-foreground" />
                <div>
                  <CardTitle className="text-base">Change Password</CardTitle>
                  <CardDescription>Update your account password for security</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {!showPasswordForm ? (
                <Button variant="outline" onClick={() => setShowPasswordForm(true)}>
                  <Lock className="mr-2 h-4 w-4" />
                  Change Password
                </Button>
              ) : (
                <form onSubmit={passwordForm.handleSubmit(onChangePassword)} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password *</Label>
                    <Input id="currentPassword" type="password" placeholder="Enter current password" {...passwordForm.register('currentPassword')} aria-invalid={!!passwordForm.formState.errors.currentPassword} />
                    {passwordForm.formState.errors.currentPassword && (
                      <p className="text-sm text-destructive">{passwordForm.formState.errors.currentPassword.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password *</Label>
                    <Input id="newPassword" type="password" placeholder="At least 8 characters" {...passwordForm.register('newPassword')} aria-invalid={!!passwordForm.formState.errors.newPassword} />
                    {passwordForm.formState.errors.newPassword && (
                      <p className="text-sm text-destructive">{passwordForm.formState.errors.newPassword.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password *</Label>
                    <Input id="confirmPassword" type="password" placeholder="Confirm new password" {...passwordForm.register('confirmPassword')} aria-invalid={!!passwordForm.formState.errors.confirmPassword} />
                    {passwordForm.formState.errors.confirmPassword && (
                      <p className="text-sm text-destructive">{passwordForm.formState.errors.confirmPassword.message}</p>
                    )}
                  </div>
                  {changePassword.isError && (
                    <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                      {(changePassword.error as any)?.response?.data?.error?.message || 'Failed to change password'}
                    </div>
                  )}
                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={() => { setShowPasswordForm(false); passwordForm.reset(); }}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={changePassword.isPending}>
                      {changePassword.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Updating...
                        </>
                      ) : (
                        'Update Password'
                      )}
                    </Button>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

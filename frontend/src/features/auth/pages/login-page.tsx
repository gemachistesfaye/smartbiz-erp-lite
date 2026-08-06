import { AuthLayout } from '@/components/layout/auth-layout';
import { LoginForm } from '../components/login-form';

export function LoginPage() {
  return (
    <AuthLayout>
      <div className="space-y-2 text-center">
        <h2 className="text-lg font-semibold">Welcome back</h2>
        <p className="text-sm text-muted-foreground">Sign in to your account to continue</p>
      </div>
      <div className="mt-6">
        <LoginForm />
      </div>
    </AuthLayout>
  );
}

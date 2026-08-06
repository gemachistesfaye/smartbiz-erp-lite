import { AuthLayout } from '@/components/layout/auth-layout';
import { RegisterForm } from '../components/register-form';

export function RegisterPage() {
  return (
    <AuthLayout>
      <div className="space-y-2 text-center">
        <h2 className="text-lg font-semibold">Create your business</h2>
        <p className="text-sm text-muted-foreground">Get started with SmartBiz ERP Lite</p>
      </div>
      <div className="mt-6">
        <RegisterForm />
      </div>
    </AuthLayout>
  );
}

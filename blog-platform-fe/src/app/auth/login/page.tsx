import { LoginForm } from '@/components/auth/login-form';

export default function RegisterPage() {
  return (
    <div className="flex h-full items-center justify-center p-4">
      <div className="w-full max-w-md">
        <LoginForm />
      </div>
    </div>
  );
}

// app/auth/login/page.tsx
import LoginForm from 'components/auth/LoginForm';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-md mx-auto">
        <LoginForm />
      </div>
    </div>
  );
}
// app/auth/register/page.tsx
import RegisterForm from 'components/auth/RegisterForm';
import Link from 'next/link';

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-md mx-auto">
        <RegisterForm />
      </div>
    </div>
  );
}
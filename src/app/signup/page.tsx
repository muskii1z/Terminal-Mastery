import type { Metadata } from 'next';
import AuthPage from '@/components/auth/AuthPage';

export const metadata: Metadata = { title: 'Create your free account | Terminal Mastery', robots: { index: false } };

export default function SignupPage() {
  return <AuthPage mode="signup" />;
}

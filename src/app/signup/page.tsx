'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { AuthForm } from '@/components/auth/AuthForm';
import Header from '@/components/layout/Header';

export default function SignupPage() {
  const { user, initialized } = useAuth();
  const router = useRouter();
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('signup');

  useEffect(() => {
    if (initialized && user) {
      router.push('/lessons');
    }
  }, [user, initialized, router]);

  const handleAuthSuccess = () => {
    // For signup, we might want to show a different message or stay on the page
    // since they need to confirm their email
    if (authMode === 'signup') {
      // Stay on page to show email confirmation message
      return;
    }
    router.push('/lessons');
  };

  if (!initialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-text-secondary">Loading...</div>
      </div>
    );
  }

  if (user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-text-secondary">Redirecting...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
          <AuthForm
            mode={authMode}
            onModeChange={setAuthMode}
            onSuccess={handleAuthSuccess}
          />
        </div>
      </div>
    </div>
  );
}
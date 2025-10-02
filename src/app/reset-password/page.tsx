'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Header from '@/components/layout/Header';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import AlertMessage from '@/components/ui/AlertMessage';

export default function ResetPasswordPage() {
  const { updatePassword, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check if we have the required tokens from Supabase
  useEffect(() => {
    const accessToken = searchParams.get('access_token');
    const refreshToken = searchParams.get('refresh_token');
    const code = searchParams.get('code');
    const type = searchParams.get('type');


    // Check if we have tokens OR if user is already authenticated via the code
    if (!accessToken && !refreshToken && !code) {
      setError('Invalid reset link. Please request a new password reset.');
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await updatePassword(password);

      if (error) {
        setError(error && typeof error === 'object' && 'message' in error ? (error as any).message : 'Failed to update password');
      } else {
        setSuccess('Password updated successfully! You can now sign in with your new password.');
        setTimeout(() => {
          router.push('/login');
        }, 3000);
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const hasValidTokens = searchParams.get('access_token') && searchParams.get('refresh_token');
  const hasValidCode = searchParams.get('code');
  const canResetPassword = hasValidTokens || hasValidCode;

  return (
    <div className="min-h-screen">
      <Header />
      <div className="container mx-auto px-4 py-8 pt-24">
        <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
          <Card className="w-full max-w-md mx-auto p-6">
            <div className="space-y-4">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-text-primary">
                  Reset Your Password
                </h2>
                <p className="text-text-secondary mt-2">
                  Enter your new password below
                </p>
              </div>

              {!canResetPassword ? (
                <AlertMessage
                  type="error"
                  title="Invalid Reset Link"
                  message="This password reset link is invalid or has expired. Please request a new password reset."
                />
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-text-primary mb-1">
                      New Password
                    </label>
                    <input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-3 py-2 border border-border rounded-md bg-bg-secondary text-text-primary
                                 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                      placeholder="Enter your new password"
                      disabled={loading || isSubmitting}
                      minLength={6}
                    />
                  </div>

                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-text-primary mb-1">
                      Confirm New Password
                    </label>
                    <input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-3 py-2 border border-border rounded-md bg-bg-secondary text-text-primary
                                 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                      placeholder="Confirm your new password"
                      disabled={loading || isSubmitting}
                      minLength={6}
                    />
                  </div>

                  {error && (
                    <AlertMessage
                      type="error"
                      message={error}
                      className="mb-4"
                    />
                  )}

                  {success && (
                    <AlertMessage
                      type="success"
                      title="Password Updated!"
                      message={success}
                      className="mb-4"
                    />
                  )}

                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    className="w-full"
                    disabled={loading || isSubmitting}
                  >
                    {(loading || isSubmitting) ? (
                      <div className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Updating Password...
                      </div>
                    ) : (
                      'Update Password'
                    )}
                  </Button>
                </form>
              )}

              <div className="text-center">
                <p className="text-text-secondary">
                  Remember your password?{' '}
                  <button
                    onClick={() => router.push('/login')}
                    className="text-accent hover:text-accent-hover font-medium focus:outline-none focus:underline"
                  >
                    Sign in
                  </button>
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
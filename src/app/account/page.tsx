'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Header from '@/components/layout/Header';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import AlertMessage from '@/components/ui/AlertMessage';

export default function AccountPage() {
  const { user, initialized, loading, signOut, resetPassword } = useAuth();
  const router = useRouter();
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (initialized && !user) {
      router.push('/login');
    }
  }, [user, initialized, router]);

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  const handleChangePassword = async () => {
    if (!user?.email) return;

    setIsResettingPassword(true);
    setMessage('');

    try {
      const { error } = await resetPassword(user.email);

      if (error) {
        setMessage('Failed to send password reset email. Please try again.');
      } else {
        setMessage('Password reset email sent! Check your inbox and follow the instructions to change your password.');
      }
    } catch (err) {
      setMessage('An unexpected error occurred. Please try again.');
    } finally {
      setIsResettingPassword(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (!initialized || loading) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
            <div className="text-text-secondary">Loading...</div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
            <div className="text-text-secondary">Redirecting...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      <div className="container mx-auto px-4 py-8 pt-24">
        <div className="max-w-4xl mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-text-primary mb-2">Account Settings</h1>
            <p className="text-text-secondary">Manage your profile and account preferences</p>
          </div>

          <div className="max-w-2xl mx-auto">
            {/* Account Information */}
            <Card className="p-6 mb-6">
              <h2 className="text-xl font-semibold text-text-primary mb-6">Account Information</h2>

              <div className="space-y-6">
                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Email Address
                  </label>
                  <div className="flex items-center justify-between p-3 border border-border rounded-md bg-bg-secondary">
                    <span className="text-text-primary">{user.email}</span>
                    <div className="flex items-center">
                      {user.email_confirmed_at ? (
                        <div className="flex items-center text-accent-green text-sm">
                          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          Verified
                        </div>
                      ) : (
                        <div className="flex items-center text-accent-orange text-sm">
                          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          Unverified
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Member Since */}
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Member Since
                  </label>
                  <div className="p-3 border border-border rounded-md bg-bg-secondary">
                    <span className="text-text-primary">{formatDate(user.created_at)}</span>
                  </div>
                </div>

                {/* Message Display */}
                {message && (
                  <AlertMessage
                    type={message.includes('sent') || message.includes('Check') ? 'success' : 'error'}
                    message={message}
                  />
                )}
              </div>
            </Card>

            {/* Account Actions */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-text-primary mb-4">Account Actions</h3>
              <div className="space-y-3">
                <Button
                  variant="secondary"
                  size="sm"
                  className="w-full justify-center"
                  onClick={() => router.push('/lessons')}
                >
                  View Lessons
                </Button>

                <Button
                  variant="secondary"
                  size="sm"
                  className="w-full justify-center"
                  onClick={handleChangePassword}
                  disabled={isResettingPassword || loading}
                >
                  {isResettingPassword ? (
                    <div className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending Reset Email...
                    </div>
                  ) : (
                    'Change Password'
                  )}
                </Button>

                <Button
                  variant="danger"
                  size="sm"
                  className="w-full justify-center"
                  onClick={handleSignOut}
                  disabled={loading}
                >
                  {loading ? 'Signing Out...' : 'Sign Out'}
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
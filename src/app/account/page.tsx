'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Header from '@/components/layout/Header';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

export default function AccountPage() {
  const { user, initialized, loading, signOut } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (initialized && !user) {
      router.push('/login');
    }
  }, [user, initialized, router]);

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
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

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Information */}
            <div className="lg:col-span-2">
              <Card className="p-6">
                <h2 className="text-xl font-semibold text-text-primary mb-6">Profile Information</h2>

                <div className="space-y-6">
                  {/* Profile Picture/Avatar */}
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 rounded-full flex items-center justify-center text-white text-xl font-bold" style={{
                      backgroundColor: 'var(--accent-blue)'
                    }}>
                      {user.email.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-text-primary">Profile Picture</h3>
                      <p className="text-text-secondary text-sm">Your avatar is generated from your email</p>
                    </div>
                  </div>

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
                    {!user.email_confirmed_at && (
                      <p className="text-accent-orange text-sm mt-2">
                        Please check your email to verify your account
                      </p>
                    )}
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
                </div>
              </Card>
            </div>

            {/* Account Actions */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-text-primary mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="w-full justify-center"
                    onClick={() => router.push('/lessons')}
                  >
                    View Lessons
                  </Button>

                  {!user.email_confirmed_at && (
                    <Button
                      variant="secondary"
                      size="sm"
                      className="w-full justify-center"
                      disabled
                    >
                      Resend Verification Email
                    </Button>
                  )}

                  <Button
                    variant="secondary"
                    size="sm"
                    className="w-full justify-center"
                    disabled
                  >
                    Change Password
                  </Button>
                </div>
              </Card>

              {/* Account Management */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-text-primary mb-4">Account Management</h3>
                <div className="space-y-3">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-center text-error-red border-error-red hover:bg-error-red hover:text-white"
                    onClick={handleSignOut}
                    disabled={loading}
                  >
                    {loading ? 'Signing Out...' : 'Sign Out'}
                  </Button>
                </div>
              </Card>

              {/* Progress Summary (Placeholder) */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-text-primary mb-4">Progress Summary</h3>
                <div className="space-y-3 text-sm text-text-secondary">
                  <div className="flex justify-between">
                    <span>Lessons Completed</span>
                    <span>0 / 20</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Progress</span>
                    <span>0%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Quizzes Passed</span>
                    <span>0</span>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="w-full bg-bg-tertiary rounded-full h-2">
                    <div
                      className="h-2 rounded-full"
                      style={{
                        backgroundColor: 'var(--accent-blue)',
                        width: '0%'
                      }}
                    ></div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
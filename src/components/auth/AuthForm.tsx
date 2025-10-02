'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import AlertMessage from '@/components/ui/AlertMessage';

interface AuthFormProps {
  mode: 'login' | 'signup';
  onModeChange: (mode: 'login' | 'signup') => void;
  onSuccess?: () => void;
}

export const AuthForm: React.FC<AuthFormProps> = ({ mode, onModeChange, onSuccess }) => {
  const { signIn, signUp, resetPassword, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      const { error } = mode === 'login'
        ? await signIn(email, password)
        : await signUp(email, password);

      if (error) {
        setError(error && typeof error === 'object' && 'message' in error ? (error as { message: string }).message : 'Authentication failed');
      } else {
        if (mode === 'signup') {
          setSuccess('Account created successfully! Please check your email to verify your account before signing in.');
          setEmail('');
          setPassword('');
        } else {
          setEmail('');
          setPassword('');
          setError('');
          onSuccess?.();
        }
      }
    } catch (err) {
      setError('An unexpected error occurred');
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email) {
      setError('Please enter your email address');
      return;
    }

    setIsResetting(true);

    try {
      const { error } = await resetPassword(email);

      if (error) {
        setError(error && typeof error === 'object' && 'message' in error ? (error as any).message : 'Failed to send reset email');
      } else {
        setSuccess('Password reset email sent! Check your inbox and follow the instructions to reset your password.');
        setShowForgotPassword(false);
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto p-6">
      <div className="space-y-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-text-primary">
            {mode === 'login' ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="text-text-secondary mt-2">
            {mode === 'login'
              ? 'Sign in to continue your terminal mastery journey'
              : 'Start your terminal mastery journey today'
            }
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-text-primary mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-md bg-bg-secondary text-text-primary
                         focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
              placeholder="Enter your email"
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-text-primary mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-md bg-bg-secondary text-text-primary
                         focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
              placeholder="Enter your password"
              disabled={loading}
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
              title="Account Created!"
              message={success}
              className="mb-4"
            />
          )}

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {mode === 'login' ? 'Signing In...' : 'Creating Account...'}
              </div>
            ) : (
              mode === 'login' ? 'Sign In' : 'Sign Up'
            )}
          </Button>
        </form>

        {/* Forgot Password Section */}
        {mode === 'login' && !showForgotPassword && (
          <div className="text-center">
            <button
              onClick={() => setShowForgotPassword(true)}
              className="text-accent hover:text-accent-hover font-medium focus:outline-none focus:underline text-sm"
              disabled={loading}
            >
              Forgot your password?
            </button>
          </div>
        )}

        {/* Forgot Password Form */}
        {showForgotPassword && (
          <div className="border-t border-border pt-4">
            <div className="text-center mb-4">
              <h3 className="text-lg font-semibold text-text-primary">Reset Password</h3>
              <p className="text-text-secondary text-sm">Enter your email to receive reset instructions</p>
            </div>

            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div>
                <label htmlFor="resetEmail" className="block text-sm font-medium text-text-primary mb-1">
                  Email Address
                </label>
                <input
                  id="resetEmail"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-md bg-bg-secondary text-text-primary
                             focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                  placeholder="Enter your email"
                  disabled={isResetting}
                />
              </div>

              <div className="flex space-x-3">
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  className="flex-1"
                  disabled={isResetting}
                >
                  {isResetting ? (
                    <div className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending...
                    </div>
                  ) : (
                    'Send Reset Email'
                  )}
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  className="flex-1"
                  onClick={() => setShowForgotPassword(false)}
                  disabled={isResetting}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        )}

        <div className="text-center">
          <p className="text-text-secondary">
            {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={() => onModeChange(mode === 'login' ? 'signup' : 'login')}
              className="text-accent hover:text-accent-hover font-medium focus:outline-none focus:underline"
              disabled={loading}
            >
              {mode === 'login' ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>
      </div>
    </Card>
  );
};
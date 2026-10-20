'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useAppContext } from '@/context/AppContext';
import Header from '@/components/layout/Header';
import Button from '@/components/ui/Button';
import Certificate from '@/components/ui/Certificate';
import { getTotalLessons } from '@/data/lessons';
import { generateCommandCheatSheet, generateCertificate } from '@/utils/pdfGenerator';
import { track } from '@/lib/analytics/posthog';

const CERTIFICATE_NAME_KEY = 'terminal-mastery-certificate-name';

// Module-scoped so the event fires once per page load, not on every render.
let courseCompletionTracked = false;

export default function CompletionPage() {
  const { user } = useAuth();
  const { userProgress, isLoading } = useAppContext();
  const router = useRouter();
  const totalLessons = getTotalLessons();
  const completedLessons = userProgress.lessonsCompleted.length;
  const hasCompletedCourse = completedLessons >= totalLessons;

  // No account required, so the name on the certificate is supplied here.
  const [name, setName] = useState('');

  useEffect(() => {
    if (user?.email) {
      setName(current => current || user.email.split('@')[0]);
      return;
    }
    try {
      const saved = localStorage.getItem(CERTIFICATE_NAME_KEY);
      if (saved) setName(current => current || saved);
    } catch {
      // localStorage unavailable; fall back to an empty field
    }
  }, [user]);

  // Redirect only once progress has actually loaded -- otherwise a direct
  // visit or refresh bounces before localStorage has been read.
  useEffect(() => {
    if (!isLoading && !hasCompletedCourse) {
      router.push('/lessons');
    }
  }, [isLoading, hasCompletedCourse, router]);

  if (isLoading || !hasCompletedCourse) {
    return null;
  }

  if (typeof window !== 'undefined' && !courseCompletionTracked) {
    courseCompletionTracked = true;
    track('course_completed', { lessons: completedLessons });
  }

  const certificateName = name.trim();

  const handleNameChange = (value: string) => {
    setName(value);
    try {
      localStorage.setItem(CERTIFICATE_NAME_KEY, value);
    } catch {
      // Non-fatal: the name just won't persist across reloads
    }
  };

  const downloadCheatSheet = () => {
    track('cheatsheet_downloaded');
    const pdf = generateCommandCheatSheet();
    pdf.save('terminal-commands-cheat-sheet.pdf');
  };

  const downloadCertificate = () => {
    if (!certificateName) return;
    track('certificate_downloaded');
    const pdf = generateCertificate(certificateName);
    pdf.save('terminal-mastery-certificate.pdf');
  };

  // Prepare certificate data
  const certificateData = {
    studentName: certificateName,
    studentEmail: user?.email || '',
    completionDate: new Date(),
  };

  return (
    <>
      <Header />
      <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          {/* Trophy and Celebration */}
          <div className="mb-12">
            <div className="text-8xl mb-6">🏆</div>
            <h1 className="text-5xl font-bold theme-text-primary mb-4">
              Terminal Master Achieved!
            </h1>
            <p className="text-xl theme-text-secondary mb-8 max-w-2xl mx-auto">
              Congratulations! You&apos;ve successfully completed all 20 lessons and mastered the essential Linux terminal commands.
              You&apos;re now equipped with the skills to navigate and work efficiently in the command line.
            </p>
          </div>

          {/* Achievement Stats */}
          <div className="clean-card p-8 mb-12 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold theme-text-primary mb-6">
              Your Achievement
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-accent-blue mb-2">20</div>
                <div className="theme-text-secondary">Lessons Completed</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-accent-green mb-2">20</div>
                <div className="theme-text-secondary">Commands Mastered</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-accent-purple mb-2">100%</div>
                <div className="theme-text-secondary">Course Progress</div>
              </div>
            </div>
          </div>

          {/* Certificate Display */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold theme-text-primary mb-8 text-center">
              Your Certificate of Completion
            </h2>
            <div className="max-w-md mx-auto mb-8">
              <label
                htmlFor="certificate-name"
                className="block text-sm font-medium theme-text-primary mb-2 text-left"
              >
                Name on your certificate
              </label>
              <input
                id="certificate-name"
                type="text"
                value={name}
                onChange={event => handleNameChange(event.target.value)}
                placeholder="Enter your name"
                className="w-full px-4 py-3 rounded-md bg-bg-secondary border border-border-primary theme-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-blue"
              />
            </div>
            <Certificate {...certificateData} />
          </div>

          {/* Download Section */}
          <div className="clean-card p-8 mb-12 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold theme-text-primary mb-6">
              Take Your Knowledge With You
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold theme-text-primary mb-2">
                  📄 Command Cheat Sheet
                </h3>
                <p className="theme-text-secondary text-sm mb-4">
                  Download a handy reference with every command you&apos;ve learned. Perfect for quick lookups while working.
                </p>
                <Button onClick={downloadCheatSheet} className="w-full">
                  Download Command Reference
                </Button>
              </div>

              <div className="pt-4">
                <h3 className="text-lg font-semibold theme-text-primary mb-2">
                  🎓 Download Certificate
                </h3>
                <p className="theme-text-secondary text-sm mb-4">
                  Download a PDF version of your certificate above to save, print, or share your achievement.
                </p>
                <Button
                  onClick={downloadCertificate}
                  variant="secondary"
                  className="w-full"
                  disabled={!certificateName}
                >
                  {certificateName ? 'Download PDF Certificate' : 'Enter your name above first'}
                </Button>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="clean-card p-8 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold theme-text-primary mb-4">
              What&apos;s Next?
            </h2>
            <p className="theme-text-secondary mb-6">
              Keep practicing these commands in real projects. The more you use them, the more natural they&apos;ll become.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => router.push('/lessons')}
                variant="secondary"
              >
                Review Lessons
              </Button>
              <Button
                onClick={() => router.push('/')}
                variant="primary"
              >
                Back to Home
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
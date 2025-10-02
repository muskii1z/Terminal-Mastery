'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useAppContext } from '@/context/AppContext';
import Header from '@/components/layout/Header';
import Button from '@/components/ui/Button';
import Certificate from '@/components/ui/Certificate';
import { getTotalLessons } from '@/data/lessons';
import { generateCommandCheatSheet, generateCertificate } from '@/utils/pdfGenerator';

export default function CompletionPage() {
  const { user } = useAuth();
  const { userProgress } = useAppContext();
  const router = useRouter();
  const totalLessons = getTotalLessons();
  const completedLessons = userProgress.lessonsCompleted.length;

  // Redirect if not all lessons completed
  useEffect(() => {
    if (completedLessons < totalLessons) {
      router.push('/lessons');
    }
  }, [completedLessons, totalLessons, router]);

  if (completedLessons < totalLessons) {
    return null;
  }

  const downloadCheatSheet = () => {
    const pdf = generateCommandCheatSheet();
    pdf.save('terminal-commands-cheat-sheet.pdf');
  };

  const downloadCertificate = () => {
    if (!user?.email) return;
    const userName = user.email.split('@')[0];
    const pdf = generateCertificate(userName);
    pdf.save('terminal-mastery-certificate.pdf');
  };

  // Prepare certificate data
  const certificateData = {
    studentEmail: user?.email || '',
    completionDate: new Date(),
    // You could also store/track actual completion date in userProgress
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
                  Download a handy reference with all 20 commands you&apos;ve learned. Perfect for quick lookups while working.
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
                <Button onClick={downloadCertificate} variant="secondary" className="w-full">
                  Download PDF Certificate
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
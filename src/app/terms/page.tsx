import React from 'react';
import Header from '@/components/layout/Header';

export default function TermsPage() {
  return (
    <>
      <Header />
      <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-text-primary mb-8">Terms of Service</h1>
          <div className="prose prose-gray max-w-none">
            <p className="text-text-secondary mb-6">
              <strong>Last updated:</strong> {new Date().toLocaleDateString()}
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-text-primary mb-4">Acceptance of Terms</h2>
              <p className="text-text-secondary mb-4">
                By accessing and using Terminal Mastery, you accept and agree to be bound by the terms
                and provision of this agreement.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-text-primary mb-4">Use License</h2>
              <p className="text-text-secondary mb-4">
                Permission is granted to temporarily access Terminal Mastery for personal, non-commercial
                transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
              </p>
              <ul className="list-disc pl-6 text-text-secondary space-y-2">
                <li>Modify or copy the materials</li>
                <li>Use the materials for any commercial purpose or for any public display</li>
                <li>Attempt to reverse engineer any software contained on the website</li>
                <li>Remove any copyright or other proprietary notations from the materials</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-text-primary mb-4">User Accounts</h2>
              <p className="text-text-secondary mb-4">
                To access certain features of our service, you may be required to create an account.
                You are responsible for maintaining the security of your account and password.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-text-primary mb-4">Educational Content</h2>
              <p className="text-text-secondary mb-4">
                Terminal Mastery provides educational content for learning command line skills.
                The content is provided &quot;as is&quot; for educational purposes only.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-text-primary mb-4">Limitations</h2>
              <p className="text-text-secondary mb-4">
                In no event shall Terminal Mastery or its suppliers be liable for any damages
                (including, without limitation, damages for loss of data or profit, or due to business interruption)
                arising out of the use or inability to use Terminal Mastery, even if Terminal Mastery or a
                Terminal Mastery authorized representative has been notified orally or in writing of the possibility of such damage.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-text-primary mb-4">Accuracy of Materials</h2>
              <p className="text-text-secondary mb-4">
                The materials appearing on Terminal Mastery could include technical, typographical,
                or photographic errors. Terminal Mastery does not warrant that any of the materials on its
                website are accurate, complete, or current.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-text-primary mb-4">Modifications</h2>
              <p className="text-text-secondary mb-4">
                Terminal Mastery may revise these terms of service at any time without notice.
                By using this website, you are agreeing to be bound by the then current version of these terms of service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-text-primary mb-4">Contact Information</h2>
              <p className="text-text-secondary">
                If you have any questions about these Terms of Service, please contact us through our platform.
              </p>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}
import React from 'react';
import CourseTopbar from '@/components/course/CourseTopbar';
import course from '@/components/course/course.module.css';

export default function TermsPage() {
  return (
    <div className={course.root}>
      <CourseTopbar />
      <div className="pt-12 pb-12 px-4 sm:px-6 lg:px-8">
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
                Terminal Mastery is free to use for learning, personally or at work. You are welcome to
                share it: link to it, post screenshots, quote lessons with attribution, and share any
                certificate you earn. Under this license you may not:
              </p>
              <ul className="list-disc pl-6 text-text-secondary space-y-2">
                <li>Republish the lesson content as your own, or present it as another party&apos;s work</li>
                <li>Sell or charge for access to the course materials</li>
                <li>Remove attribution or copyright notices from materials you share</li>
                <li>Misrepresent a certificate, or claim a completion you did not earn</li>
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
    </div>
  );
}
import React from 'react';
import CourseTopbar from '@/components/course/CourseTopbar';
import course from '@/components/course/course.module.css';

export default function PrivacyPage() {
  return (
    <div className={course.root}>
      <CourseTopbar />
      <div className="pt-12 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-text-primary mb-8">Privacy Policy</h1>
          <div className="prose prose-gray max-w-none">
            <p className="text-text-secondary mb-6">
              <strong>Last updated:</strong> {new Date().toLocaleDateString()}
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-text-primary mb-4">Information We Collect</h2>
              <p className="text-text-secondary mb-4">
                We collect information you provide directly to us, such as when you create an account,
                complete lessons, or contact us for support.
              </p>
              <ul className="list-disc pl-6 text-text-secondary space-y-2">
                <li>Email address for account creation and communication</li>
                <li>Learning progress and completion data</li>
                <li>Usage analytics to improve our service</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-text-primary mb-4">How We Use Your Information</h2>
              <ul className="list-disc pl-6 text-text-secondary space-y-2">
                <li>To provide and maintain our educational service</li>
                <li>To track your learning progress and provide personalized content</li>
                <li>To communicate with you about updates and support</li>
                <li>To improve our platform and user experience</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-text-primary mb-4">Information Sharing</h2>
              <p className="text-text-secondary mb-4">
                We do not sell, trade, or otherwise transfer your personal information to third parties.
                We may share aggregated, non-personally identifiable information for analytics purposes.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-text-primary mb-4">Data Security</h2>
              <p className="text-text-secondary mb-4">
                We implement appropriate security measures to protect your personal information against
                unauthorized access, alteration, disclosure, or destruction.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-text-primary mb-4">Your Rights</h2>
              <p className="text-text-secondary mb-4">
                You have the right to access, update, or delete your personal information.
                You may also opt out of communications at any time.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-text-primary mb-4">Contact Us</h2>
              <p className="text-text-secondary">
                If you have any questions about this Privacy Policy, please contact us through our platform.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
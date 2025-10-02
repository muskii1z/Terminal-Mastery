'use client';

import React from 'react';
import Certificate from '@/components/ui/Certificate';

const CertificatePage: React.FC = () => {
  // Sample data for testing - in production this would come from user session/database
  const sampleData = {
    studentName: 'John Smith',
    studentEmail: 'john.smith@example.com',
    completionDate: new Date('2024-02-15'),
    certificateId: 'TM-2024-0215-JS001'
  };

  const sampleDataNoName = {
    studentEmail: 'developer@company.com',
    completionDate: new Date(),
    certificateId: 'TM-2024-1001-DEV002'
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Terminal Mastery Certificate
          </h1>
          <p className="text-gray-600">
            Congratulations on completing the Terminal Mastery course!
          </p>
        </div>

        {/* Certificate with name */}
        <div className="mb-16">
          <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center">
            Certificate with Student Name
          </h2>
          <Certificate {...sampleData} />
        </div>

        {/* Certificate with email only */}
        <div className="mb-16">
          <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center">
            Certificate with Email Only
          </h2>
          <Certificate {...sampleDataNoName} />
        </div>

        {/* Print Instructions */}
        <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            Print Instructions
          </h3>
          <ul className="space-y-2 text-gray-600">
            <li>• Use your browser&apos;s print function (Ctrl+P or Cmd+P)</li>
            <li>• Select &quot;Print to PDF&quot; to save a digital copy</li>
            <li>• For best results, use landscape orientation</li>
            <li>• Ensure &quot;Print backgrounds&quot; is enabled</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CertificatePage;
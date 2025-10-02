'use client';

import React from 'react';

interface CertificateProps {
  studentName?: string;
  studentEmail: string;
  completionDate: Date;
  certificateId?: string;
}

const Certificate: React.FC<CertificateProps> = ({
  studentName,
  studentEmail,
  completionDate,
  certificateId
}) => {
  const displayName = studentName || studentEmail;
  const formattedDate = completionDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white print:p-0">
      {/* Certificate Container */}
      <div className="relative bg-white border-8 border-transparent bg-gradient-to-br from-accent-blue via-accent-purple to-accent-blue p-2 rounded-lg shadow-2xl print:shadow-none print:border-gray-300">
        <div className="bg-white p-12 rounded-md">
          {/* Terminal Mastery Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-accent-blue to-accent-purple rounded-xl flex items-center justify-center">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3" />
                </svg>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-accent-blue to-accent-purple bg-clip-text text-transparent">
                Terminal Mastery
              </span>
            </div>
          </div>

          {/* Student Name */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {displayName}
            </h1>
            <p className="text-lg text-gray-600 mb-2">
              has successfully completed all requirements for
            </p>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              Terminal Mastery: Command Line Fundamentals
            </h2>
          </div>

          {/* Certificate Details */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-8">
            {/* Left Side - Details */}
            <div className="text-left">
              <div className="mb-2">
                <span className="text-sm text-gray-600">Completed on: </span>
                <span className="text-sm font-semibold text-gray-900">{formattedDate}</span>
              </div>
            </div>

            {/* Right Side - Signature */}
            <div className="text-right">
              <div className="mb-2">
                <div className="w-32 h-12 bg-gradient-to-r from-accent-blue/10 to-accent-purple/10 rounded-md flex items-center justify-center mb-2">
                  <span className="text-lg font-script text-gray-700">Terminal Mastery</span>
                </div>
                <div className="border-t border-gray-300 w-32 mx-auto md:mx-0"></div>
              </div>
              <div className="text-xs text-gray-600">
                <div className="font-medium">Terminal Mastery Team</div>
                <div>Founder & Educator</div>
              </div>
            </div>
          </div>

          {/* 2 Hours Achievement */}
          <div className="text-center pt-6 border-t border-gray-200">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-accent-blue/10 to-accent-purple/10 rounded-full">
              <svg className="w-4 h-4 text-accent-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3" />
              </svg>
              <span className="text-sm font-medium text-gray-700">
                Mastered in 2 hours • Terminal fundamentals for developers
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Certificate;
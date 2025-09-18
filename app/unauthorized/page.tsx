"use client";

import { redirect } from "next/navigation";

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-red-600 mb-4">Unauthorized</h1>
          <p className="text-gray-600 mb-6">
            You don't have permission to access this page. Please contact an administrator if you believe this is an error.
          </p>
          <button
            onClick={() => window.history.back()}
            className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}

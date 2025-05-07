import React from 'react';

/**
 * Disclaimer component to be displayed on all pages
 * This component provides a consistent disclaimer message across the application
 */
export function Disclaimer() {
  return (
    <div className="w-full bg-amber-50 border-t border-amber-200 py-2 px-4 text-xs text-amber-800 text-center">
      This is a demo application. All content, jobs, and user profiles are fictional and for demonstration purposes only.
      No real job opportunities are being offered through this platform.
    </div>
  );
}
'use client';

import { Activity } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="py-12 px-6 border-t border-gray-200/50 backdrop-blur-xl bg-white/50">
      <div className="max-w-7xl mx-auto text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center shadow-emerald-500/20 shadow-lg">
             <Activity className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-semibold text-gray-900 tracking-tight">AuraClinic</span>
        </div>
        <p className="text-gray-600 mb-4 font-medium">
          Advanced clinic management for modern healthcare
        </p>
        <p className="text-sm text-gray-500">
          © 2026 AuraClinic Inc. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

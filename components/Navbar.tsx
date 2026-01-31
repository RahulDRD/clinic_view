'use client';

import Link from 'next/link';
import Image from 'next/image';
import { LoginLink, RegisterLink } from "@kinde-oss/kinde-auth-nextjs/components";

export default function Navbar() {
  return (
    <nav className="fixed top-0 w-full bg-transparent z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <Image 
              src="/logo_transparent.png" 
              alt="AuraClinic Logo" 
              width={32} 
              height={32}
              className="group-hover:scale-110 transition-transform"
            />
            <span className="text-xl font-bold text-gray-900 tracking-tight group-hover:text-emerald-600 transition-colors">AuraClinic</span>
          </Link>

          {/* Auth Buttons */}
          <div className="flex items-center gap-4">
            <LoginLink className="text-sm font-medium text-gray-600 hover:text-emerald-600 transition-colors">
              Sign In
            </LoginLink>
            <RegisterLink className="bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium px-5 py-2.5 rounded-full transition-all shadow-lg shadow-emerald-500/30 hover:shadow-emerald-600/40">
              Sign Up
            </RegisterLink>
          </div>
        </div>
      </div>
    </nav>
  );
}

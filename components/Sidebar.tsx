'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, Settings, LogOut } from 'lucide-react';
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";

export default function Sidebar() {
  const pathname = usePathname();

  const links = [
    { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Doctors', href: '/dashboard/doctors', icon: Users },
    { name: 'Clinic Profile', href: '/dashboard/profile', icon: Settings },
  ];

  return (
    <div className="w-64 bg-white h-screen border-r border-gray-200 flex flex-col fixed left-0 top-0 z-50">
      <div className="p-6 border-b border-gray-100">
        <Link href="/dashboard" className="flex flex-col items-center space-y-2">
          <div className="flex items-center space-x-1">
            <img src="/Logos/logo_transparent.png" alt="AuraSutra" className="h-12" />
            <span className="text-2xl font-semibold" style={{ fontFamily: 'Alatsi, sans-serif' }}>AuraSutra</span>
          </div>
          <span className="text-xs text-gray-600 font-semibold">Clinic Portal</span>
        </Link>
      </div>
      
      <nav className="flex-1 p-4 space-y-1">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.name}
              href={link.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                isActive 
                  ? 'bg-emerald-50 text-emerald-700 font-medium shadow-sm ring-1 ring-emerald-100' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-emerald-600' : 'text-gray-400'}`} />
              {link.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-100">
        <LogoutLink className="flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors w-full group">
            <LogOut className="w-5 h-5 group-hover:scale-105 transition-transform" />
            <span className="font-medium">Sign Out</span>
        </LogoutLink>
      </div>
    </div>
  );
}

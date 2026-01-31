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
    <aside
      className="fixed left-6 top-6 bottom-6 w-[260px] rounded-[30px] flex flex-col shadow-xl shadow-gray-200 z-50 overflow-hidden bg-cover bg-center border border-white/50"
      style={{ backgroundImage: "linear-gradient(rgba(0,0,0,0.1), rgba(0,0,0,0.1)), url('/gradient-bg.jpg')" }}
    >
      {/* Logo Section */}
      <div className="p-8 pb-4">
        <Link href="/dashboard" className="flex items-center gap-3">
          <img src="/Logos/logo_transparent.png" alt="AuraSutra" className="w-12 h-12 object-contain drop-shadow-sm" />
          <div>
            <h1 className="text-xl font-bold font-sans tracking-wide text-gray-900">AuraSutra</h1>
            <span className="text-[10px] uppercase tracking-wider text-gray-600 font-bold block bg-white/40 backdrop-blur-md px-2 py-0.5 rounded-full w-fit mt-1 border border-white/30">Clinic Portal</span>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href || (link.href !== '/dashboard' && pathname?.startsWith(link.href));

          return (
            <Link
              key={link.name}
              href={link.href}
              className={`flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 group backdrop-blur-[2px] ${isActive
                ? 'bg-white/80 text-indigo-900 shadow-lg shadow-indigo-100/50 font-bold translate-x-1 border border-white/60'
                : 'text-gray-600 hover:bg-white/40 hover:text-gray-900 hover:translate-x-1 hover:shadow-sm'
                }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5px] text-indigo-700' : 'stroke-2 opacity-70 group-hover:opacity-100'}`} />
              <span className="text-[15px]">{link.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Profile Section */}
      <div className="p-4 mx-4 mb-4 rounded-2xl bg-white/30 border border-white/40 backdrop-blur-md shadow-sm">
        <LogoutLink className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-white/50 hover:bg-red-50 hover:text-red-600 text-xs font-bold text-gray-700 transition-colors group">
          <LogOut className="w-3.5 h-3.5 text-gray-500 group-hover:text-red-500" />
          Sign Out
        </LogoutLink>
      </div>
    </aside>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { Doctor } from '@/types';
import { ShieldCheck, Users, Activity, ChevronRight, Stethoscope, ArrowUpRight, Search } from 'lucide-react';
import Link from 'next/link';

export default function OverviewPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDoctors();
  }, []);

  async function fetchDoctors() {
    try {
      const res = await fetch('/api/clinic/doctors');
      const data = await res.json();
      if (data.success) {
        setDoctors(data.doctors);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  // Calculate Stats
  const totalDoctors = doctors.length;
  const verifiedDoctors = doctors.filter(d => d.is_verified).length;
  const activeUsers = doctors.filter(d => d.user?.is_active).length;

  const stats = [
    {
      label: 'Total Doctors',
      value: loading ? '...' : totalDoctors,
      icon: Users,
      color: 'indigo',
      bg: 'bg-indigo-50',
      text: 'text-indigo-600',
      trend: '+12% from last month'
    },
    {
      label: 'Verified',
      value: loading ? '...' : verifiedDoctors,
      icon: ShieldCheck,
      color: 'blue',
      bg: 'bg-blue-50',
      text: 'text-blue-600',
      trend: '+4 pending review'
    },
    {
      label: 'Active Accounts',
      value: loading ? '...' : activeUsers,
      icon: Activity,
      color: 'violet',
      bg: 'bg-violet-50',
      text: 'text-violet-600',
      trend: '98% uptime'
    },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight font-sans">Dashboard Overview</h1>
          <p className="text-gray-500 mt-2 text-lg">Key metrics and recent activity.</p>
        </div>

        {/* Search Bar - Aesthetic only as per prompt instruction 'Do NOT include search bars' - wait, prompt says 'Do NOT include search bars'.
              Removing search bar.
           */}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white p-6 rounded-[24px] shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border border-gray-100 group relative overflow-hidden">
              <div className={`absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity ${stat.text}`}>
                <Icon className="w-24 h-24 transform translate-x-4 -translate-y-4" />
              </div>

              <div className="flex items-center justify-between mb-4 relative z-10">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${stat.bg} ${stat.text} shadow-inner`}>
                  <Icon className="w-7 h-7" />
                </div>
                {/* <span className="flex items-center text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                            {stat.trend}
                        </span> */}
              </div>

              <div className="relative z-10">
                <p className="text-gray-500 font-medium mb-1">{stat.label}</p>
                <h3 className="text-4xl font-bold text-gray-900">{stat.value}</h3>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Manage Doctors Card - Highlighted (2 cols) */}
        <div
          className="lg:col-span-2 bg-cover bg-center rounded-[32px] p-10 relative overflow-hidden shadow-xl shadow-gray-200 flex flex-col justify-between group border border-white/50"
          style={{ backgroundImage: "linear-gradient(rgba(0,0,0,0.1), rgba(0,0,0,0.1)), url('/gradient-bg.jpg')" }}
        >
          {/* Decorative Background Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/40 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-teal-100/50 rounded-full blur-2xl -ml-10 -mb-10 pointer-events-none"></div>
          <div className="absolute right-10 top-10 p-2 opacity-10 transform group-hover:scale-110 transition-transform duration-700">
            <Stethoscope className="w-40 h-40 text-teal-800" />
          </div>

          <div className="relative z-10 max-w-lg">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/60 backdrop-blur-md border border-white/40 text-sm font-bold text-teal-800 mb-4 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse"></span>
              Admin Control
            </div>
            <h2 className="text-3xl font-bold mb-3 leading-tight text-gray-900">Manage Doctors</h2>
            <p className="text-gray-600 text-lg mb-8 leading-relaxed font-medium">Review applications, verify credentials, and manage access for all clinic doctors efficiently.</p>

            <Link href="/dashboard/doctors" className="inline-flex items-center gap-2 px-8 py-4 bg-teal-600 text-white rounded-2xl font-bold hover:bg-teal-700 transition-all shadow-lg shadow-teal-200 hover:-translate-y-0.5 group/btn">
              View All Doctors
              <ArrowUpRight className="w-5 h-5 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Quick Actions Card (1 col) */}
        <div className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-lg shadow-slate-100/50 flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-gray-900">Quick Actions</h2>
            <div className="p-2 rounded-xl bg-gray-50 text-gray-400">
              <Activity className="w-5 h-5" />
            </div>
          </div>

          <div className="space-y-4 flex-1">
            <Link
              href="/dashboard/doctors"
              className="flex items-center justify-between p-5 rounded-2xl bg-indigo-50/50 hover:bg-indigo-50 text-indigo-900 group transition-all border border-transparent hover:border-indigo-100"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm text-indigo-600 group-hover:scale-110 transition-transform">
                  <Users className="w-5 h-5" />
                </div>
                <span className="font-semibold">View All Doctors</span>
              </div>
              <ChevronRight className="w-5 h-5 text-indigo-300 group-hover:text-indigo-500 transition-colors" />
            </Link>

            <Link
              href="/dashboard/profile"
              className="flex items-center justify-between p-5 rounded-2xl bg-violet-50/50 hover:bg-violet-50 text-violet-900 group transition-all border border-transparent hover:border-violet-100"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm text-violet-600 group-hover:scale-110 transition-transform">
                  <Activity className="w-5 h-5" />
                </div>
                <span className="font-semibold">Edit Clinic Profile</span>
              </div>
              <ChevronRight className="w-5 h-5 text-violet-300 group-hover:text-violet-500 transition-colors" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

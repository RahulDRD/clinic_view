'use client';

import { useEffect, useState } from 'react';
import { Doctor } from '@/types';
import { ShieldCheck, Users, Activity, TrendingUp, UserPlus, Loader2 } from 'lucide-react';
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

  if (loading) {
     return (
        <div className="flex items-center justify-center h-full">
            <Loader2 className="w-10 h-10 text-emerald-600 animate-spin" />
        </div>
     );
  }

  // Calculate Stats
  const totalDoctors = doctors.length;
  const verifiedDoctors = doctors.filter(d => d.is_verified).length;
  const activeUsers = doctors.filter(d => d.user?.is_active).length;

  const stats = [
    { label: 'Total Doctors', value: totalDoctors, icon: Users, color: 'emerald' },
    { label: 'Verified', value: verifiedDoctors, icon: ShieldCheck, color: 'green' },
    { label: 'Active Accounts', value: activeUsers, icon: Activity, color: 'teal' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Dashboard Overview</h1>
        <p className="text-gray-500 mt-1">Key metrics and recent activity.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat) => {
            const Icon = stat.icon;
            // Dynamic classes need map or safelist usually, but explicit classes preferred.
            // Simplified for brevity: using explicit map logic
            let bgClass = 'bg-emerald-50';
            let textClass = 'text-emerald-600';
            if (stat.color === 'green') { bgClass = 'bg-green-50'; textClass = 'text-green-600'; }
            if (stat.color === 'teal') { bgClass = 'bg-teal-50'; textClass = 'text-teal-600'; }
            if (stat.color === 'purple') { bgClass = 'bg-purple-50'; textClass = 'text-purple-600'; }

            return (
                <div key={stat.label} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow group">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                            <p className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
                        </div>
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${bgClass} ${textClass} group-hover:scale-110 transition-transform`}>
                            <Icon className="w-6 h-6" />
                        </div>
                    </div>
                </div>
            );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         <div className="bg-gradient-to-br from-emerald-500 to-green-600 rounded-3xl p-8 text-white relative overflow-hidden shadow-lg shadow-emerald-500/20">
             <div className="relative z-10">
                 <h2 className="text-2xl font-bold mb-2">Manage Doctors</h2>
                 <p className="text-emerald-50 mb-6 max-w-sm">Review applications, verify credentials, and manage access for all clinic doctors.</p>
                 <Link href="/dashboard/doctors" className="inline-flex items-center px-6 py-3 bg-white text-emerald-600 rounded-xl font-semibold hover:bg-emerald-50 transition-colors shadow-sm">
                    View All Doctors
                 </Link>
             </div>
             <Users className="absolute -right-6 -bottom-6 w-48 h-48 text-white/10 rotate-12" />
         </div>

         <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm">
             <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h2>
             <div className="space-y-3">
                 <Link 
                   href="/dashboard/doctors"
                   className="w-full flex items-center justify-between p-4 rounded-xl bg-gray-50 hover:bg-emerald-50 group transition-colors border border-transparent hover:border-emerald-100"
                 >
                     <span className="font-medium text-gray-700 group-hover:text-emerald-700">View All Doctors</span>
                     <Users className="w-5 h-5 text-gray-400 group-hover:text-emerald-600" />
                 </Link>
                 <Link 
                   href="/dashboard/profile"
                   className="w-full flex items-center justify-between p-4 rounded-xl bg-gray-50 hover:bg-blue-50 group transition-colors border border-transparent hover:border-blue-100"
                 >
                     <span className="font-medium text-gray-700 group-hover:text-blue-700">Edit Clinic Profile</span>
                     <Activity className="w-5 h-5 text-gray-400 group-hover:text-blue-600" />
                 </Link>
             </div>
         </div>
      </div>
    </div>
  );
}

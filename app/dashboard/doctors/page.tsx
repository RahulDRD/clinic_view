'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Doctor } from '@/types';
import { 
  Check, X, Shield, ShieldCheck, ShieldAlert, Activity, 
  User as UserIcon, Building2, Search, Filter, Loader2, Trash2 
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterQualification, setFilterQualification] = useState('All');
  const [selectedImage, setSelectedImage] = useState<{ url: string; name: string } | null>(null);

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

  async function handleToggle(did: string, uid: string, action: 'verify_doctor' | 'activate_user', currentValue: boolean) {
    setDoctors(prev => prev.map(doc => {
        if (doc.did === did) {
            if (action === 'verify_doctor') return { ...doc, is_verified: !currentValue };
            if (action === 'activate_user' && doc.user) return { ...doc, user: { ...doc.user, is_active: !currentValue } };
        }
        return doc;
    }));

    try {
        const res = await fetch('/api/clinic/doctors', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ did, uid, action, value: !currentValue })
        });
        if (!res.ok) throw new Error('Failed');
        
        const actionName = action === 'verify_doctor' ? 'Verification' : 'Account status';
        toast.success(`${actionName} updated successfully`);
    } catch (error) {
        console.error(error);
        toast.error('Failed to update. Please try again.');
        fetchDoctors(); // Revert on error
    }
  }

  async function handleDelete(did: string, doctorName: string) {
    if (!confirm(`Are you sure you want to remove ${doctorName} from your clinic?\n\nNote: This will unassign the doctor from your clinic but won't delete their account.`)) {
      return;
    }

    const loadingToast = toast.loading('Removing doctor...');

    try {
      const res = await fetch('/api/clinic/doctors', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ did })
      });

      const data = await res.json();

      if (data.success) {
        // Remove doctor from local state
        setDoctors(prev => prev.filter(doc => doc.did !== did));
        toast.success(`${doctorName} removed from clinic successfully`, { id: loadingToast });
      } else {
        toast.error(data.error || 'Failed to remove doctor', { id: loadingToast });
      }
    } catch (error) {
      console.error('Error removing doctor:', error);
      toast.error('Failed to remove doctor', { id: loadingToast });
    }
  }

  const filteredDoctors = doctors.filter(doc => {
    const searchLower = searchTerm.toLowerCase();
    const nameMatch = doc.user?.name.toLowerCase().includes(searchLower) || false;
    const emailMatch = doc.user?.email.toLowerCase().includes(searchLower) || false;
    const qualificationMatch = doc.qualification?.toLowerCase().includes(searchLower) || false;
    
    const qualificationFilter = filterQualification === 'All' || doc.qualification === filterQualification;

    return (nameMatch || emailMatch || qualificationMatch) && qualificationFilter;
  });

  const uniqueQualifications = Array.from(new Set(doctors.map(d => d.qualification).filter(Boolean))) as string[];

  if (loading) {
    return (
        <div className="flex items-center justify-center h-full">
            <Loader2 className="w-10 h-10 text-emerald-600 animate-spin" />
        </div>
    );
  }

  return (
    <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Doctors Management</h1>
            <p className="text-gray-500 mt-1">View and manage doctors affiliated with your clinic. Doctors register independently through the doctor portal.</p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input 
                    type="text" 
                    placeholder="Search by name, email, or qualification..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all shadow-sm"
                />
            </div>
            
            <div className="relative w-full md:w-64">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select 
                    value={filterQualification}
                    onChange={(e) => setFilterQualification(e.target.value)}
                    className="w-full pl-10 pr-10 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all appearance-none bg-white shadow-sm"
                >
                    <option value="All">All Qualifications</option>
                    {uniqueQualifications.map(q => <option key={q} value={q}>{q}</option>)}
                </select>
                <Filter className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Doctor</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Qualification & Spec</th>
                            <th className="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Verification</th>
                            <th className="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Account</th>
                            <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filteredDoctors.map((doc) => (
                            <tr key={doc.did} className="hover:bg-gray-50/50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-4">
                                        <div 
                                            onClick={() => doc.user?.profile_image_url && setSelectedImage({ url: doc.user.profile_image_url, name: doc.user.name })}
                                            className={`w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold text-lg overflow-hidden shrink-0 ${doc.user?.profile_image_url ? 'cursor-pointer hover:ring-2 hover:ring-emerald-500 transition-all' : ''}`}
                                        >
                                            {doc.user?.profile_image_url ? (
                                                <img src={doc.user.profile_image_url} alt={doc.user.name} className="w-full h-full object-cover" />
                                            ) : (
                                                doc.user?.name?.charAt(0) || 'D'
                                            )}
                                        </div>
                                        <div>
                                            <div className="font-semibold text-gray-900">{doc.user?.name || 'Unknown'}</div>
                                            <div className="text-sm text-gray-500">{doc.user?.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="text-gray-900 font-medium">{doc.qualification || 'Not Specified'}</div>
                                    <div className="text-sm text-gray-500">
                                        {Array.isArray(doc.specialization) ? doc.specialization.join(', ') : doc.specialization || 'General'}
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <button 
                                        onClick={() => handleToggle(doc.did, doc.uid, 'verify_doctor', doc.is_verified)}
                                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all ${
                                            doc.is_verified 
                                            ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' 
                                            : 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                                        }`}
                                    >
                                        {doc.is_verified ? <ShieldCheck className="w-3.5 h-3.5" /> : <ShieldAlert className="w-3.5 h-3.5" />}
                                        {doc.is_verified ? 'Verified' : 'Unverified'}
                                    </button>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <button 
                                        onClick={() => handleToggle(doc.did, doc.user!.uid, 'activate_user', doc.user!.is_active)}
                                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all ${
                                            doc.user?.is_active 
                                            ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}
                                    >
                                        <Activity className="w-3.5 h-3.5" />
                                        {doc.user?.is_active ? 'Active' : 'Locked'}
                                    </button>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                      <Link 
                                        href={`/dashboard/doctors/${doc.did}`}
                                        className="text-blue-600 hover:text-blue-800 font-medium text-sm px-3 py-1.5 hover:bg-blue-50 rounded-lg transition-colors"
                                      >
                                        View
                                      </Link>
                                      <Link 
                                        href={`/dashboard/doctors/${doc.did}/edit`}
                                        className="text-emerald-600 hover:text-emerald-800 font-medium text-sm px-3 py-1.5 hover:bg-emerald-50 rounded-lg transition-colors"
                                      >
                                        Edit
                                      </Link>
                                      <button
                                        onClick={() => handleDelete(doc.did, doc.user?.name || 'this doctor')}
                                        className="text-red-600 hover:text-red-800 font-medium text-sm px-3 py-1.5 hover:bg-red-50 rounded-lg transition-colors"
                                      >
                                        Remove
                                      </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            
            {filteredDoctors.length === 0 && (
                <div className="p-12 text-center text-gray-500">
                    No doctors found matching your criteria.
                </div>
            )}
        </div>

        {/* Image Modal */}
        {selectedImage && (
            <div 
                onClick={() => setSelectedImage(null)}
                className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
            >
                <div className="relative max-w-4xl max-h-[90vh] animate-in zoom-in-95 duration-200">
                    <img 
                        src={selectedImage.url} 
                        alt={selectedImage.name}
                        className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    />
                    <div className="absolute top-4 right-4 bg-white/10 backdrop-blur-md rounded-full p-2 cursor-pointer hover:bg-white/20 transition-colors">
                        <X className="w-6 h-6 text-white" onClick={() => setSelectedImage(null)} />
                    </div>
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-md px-6 py-3 rounded-full">
                        <p className="text-white font-medium text-center">{selectedImage.name}</p>
                    </div>
                </div>
            </div>
        )}
    </div>
  );
}

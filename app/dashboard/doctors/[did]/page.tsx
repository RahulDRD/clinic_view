'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, ShieldCheck, ShieldAlert, Activity, User, Mail, Phone, MapPin, 
  Calendar, FileText, Loader2, Building2, GraduationCap, Stethoscope 
} from 'lucide-react';
import { Doctor } from '@/types';

interface DoctorDetails extends Doctor {
    stats?: {
        patients: number;
        appointments: number;
    }
}

export default function DoctorDetailsPage() {
  const params = useParams();
  const did = params.did as string;
  const router = useRouter();

  const [doctor, setDoctor] = useState<DoctorDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (did) fetchDoctor();
  }, [did]);

  async function fetchDoctor() {
    try {
      const res = await fetch(`/api/doctors/${did}`);
      const data = await res.json();
      if (data.success) {
        setDoctor({ ...data.doctor, stats: data.stats });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  async function handleToggle(action: 'verify_doctor' | 'activate_user') {
     if (!doctor || !doctor.user) return;
     const currentValue = action === 'verify_doctor' ? doctor.is_verified : doctor.user.is_active;

     // Optimistic
     setDoctor(prev => {
        if (!prev) return null;
        if (action === 'verify_doctor') return { ...prev, is_verified: !currentValue };
        if (action === 'activate_user' && prev.user) return { ...prev, user: { ...prev.user, is_active: !currentValue } };
        return prev;
     });

     try {
        await fetch('/api/doctors', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ did: doctor.did, uid: doctor.uid, action, value: !currentValue })
        });
     } catch (e) {
        fetchDoctor(); // Revert
     }
  }

  if (loading) {
    return (
        <div className="flex items-center justify-center h-full">
            <Loader2 className="w-10 h-10 text-emerald-600 animate-spin" />
        </div>
    );
  }

  if (!doctor) return <div>Doctor not found</div>;

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
       <button 
         onClick={() => router.back()}
         className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors"
       >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Doctors</span>
       </button>

       {/* Header Card */}
       <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm flex flex-col md:flex-row gap-8 items-start">
           <div className="w-32 h-32 rounded-2xl bg-emerald-100 shrink-0 overflow-hidden flex items-center justify-center">
               {doctor.user?.profile_image_url ? (
                   <img src={doctor.user.profile_image_url} alt="" className="w-full h-full object-cover" />
               ) : (
                   <div className="text-emerald-600 text-4xl font-bold">
                       {doctor.user?.name?.charAt(0)}
                   </div>
               )}
           </div>
           
           <div className="flex-1 space-y-4">
               <div>
                   <h1 className="text-3xl font-bold text-gray-900">{doctor.user?.name}</h1>
                   <div className="flex items-center gap-2 text-gray-500 mt-1">
                       <Stethoscope className="w-4 h-4" />
                       <span>{Array.isArray(doctor.specialization) ? doctor.specialization.join(', ') : doctor.specialization}</span>
                       <span className="w-1 h-1 bg-gray-300 rounded-full" />
                       <Building2 className="w-4 h-4 ml-1" />
                       <span>{doctor.clinic_name}</span>
                   </div>
               </div>

               <div className="flex flex-wrap gap-3">
                   <button 
                       onClick={() => handleToggle('verify_doctor')}
                       className={`px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-semibold transition-colors ${
                           doctor.is_verified ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                       }`}
                   >
                       {doctor.is_verified ? <ShieldCheck className="w-4 h-4" /> : <ShieldAlert className="w-4 h-4" />}
                       {doctor.is_verified ? 'Verified Doctor' : 'Unverified'}
                   </button>

                   <button 
                       onClick={() => handleToggle('activate_user')}
                       className={`px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-semibold transition-colors ${
                           doctor.user?.is_active ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-red-100 text-red-700 hover:bg-red-200'
                       }`}
                   >
                       <Activity className="w-4 h-4" />
                       {doctor.user?.is_active ? 'Account Active' : 'Account Locked'}
                   </button>
               </div>
           </div>

           <div className="flex gap-4 md:flex-col md:gap-2 min-w-[200px]">
               <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                   <p className="text-sm text-gray-500">Total Patients</p>
                   <p className="text-2xl font-bold text-gray-900">{doctor.stats?.patients || 0}</p>
               </div>
               <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                   <p className="text-sm text-gray-500">Appointments</p>
                   <p className="text-2xl font-bold text-gray-900">{doctor.stats?.appointments || 0}</p>
               </div>
           </div>
       </div>

       {/* Details Grid */}
       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           {/* Professional Info */}
           <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm space-y-6">
               <h2 className="text-xl font-bold text-gray-900">Professional Details</h2>
               
               <div className="space-y-4">
                   <div className="flex items-start gap-3">
                       <GraduationCap className="w-5 h-5 text-gray-400 mt-1" />
                       <div>
                           <p className="text-sm font-medium text-gray-500">Qualification</p>
                           <p className="text-gray-900">{doctor.qualification}</p>
                       </div>
                   </div>
                   
                   <div className="flex items-start gap-3">
                       <FileText className="w-5 h-5 text-gray-400 mt-1" />
                       <div>
                           <p className="text-sm font-medium text-gray-500">Registration Number</p>
                           <p className="text-gray-900 font-mono bg-gray-50 px-2 py-0.5 rounded text-sm">{doctor.registration_number || 'N/A'}</p>
                       </div>
                   </div>

                   <div className="flex items-start gap-3">
                       <Calendar className="w-5 h-5 text-gray-400 mt-1" />
                       <div>
                           <p className="text-sm font-medium text-gray-500">Experience</p>
                           <p className="text-gray-900">{doctor.years_of_experience} Years</p>
                       </div>
                   </div>

                   <div className="flex items-start gap-3">
                       <div className="font-bold text-gray-400 mt-0.5">₹</div>
                       <div>
                           <p className="text-sm font-medium text-gray-500">Consultation Fee</p>
                           <p className="text-gray-900">₹{doctor.consultation_fee}</p>
                       </div>
                   </div>
               </div>
           </div>

           {/* Contact Info */}
           <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm space-y-6">
               <h2 className="text-xl font-bold text-gray-900">Contact Information</h2>
               
               <div className="space-y-4">
                   <div className="flex items-start gap-3">
                       <Mail className="w-5 h-5 text-gray-400 mt-1" />
                       <div>
                           <p className="text-sm font-medium text-gray-500">Email</p>
                           <p className="text-gray-900">{doctor.user?.email}</p>
                       </div>
                   </div>

                   <div className="flex items-start gap-3">
                       <Phone className="w-5 h-5 text-gray-400 mt-1" />
                       <div>
                           <p className="text-sm font-medium text-gray-500">Phone</p>
                           <p className="text-gray-900">{doctor.user?.phone || 'N/A'}</p>
                       </div>
                   </div>

                   <div className="flex items-start gap-3">
                       <MapPin className="w-5 h-5 text-gray-400 mt-1" />
                       <div>
                           <p className="text-sm font-medium text-gray-500">Address</p>
                           <p className="text-gray-900">
                               {[doctor.address_line1, doctor.city, doctor.state, doctor.country].filter(Boolean).join(', ')}
                           </p>
                       </div>
                   </div>
               </div>
           </div>
       </div>
    </div>
  );
}

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { LoginLink, RegisterLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { Activity, ShieldCheck, Users, TrendingUp } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-100 via-teal-50 to-emerald-100 font-sans flex flex-col">
      <Navbar />
      
      <main className="pt-32 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col items-center justify-center flex-grow w-full">
        
        <div className="text-center space-y-8 max-w-5xl mx-auto">
           <div className="space-y-4">
              <div className="inline-flex items-center gap-2 bg-emerald-100/50 text-emerald-700 px-4 py-1.5 rounded-full text-sm font-medium border border-emerald-100 backdrop-blur-sm">
                  <Activity className="w-4 h-4" />
                  <span>Clinic Management Portal</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 tracking-tight leading-tight">
                  Manage your medical practice <br /> with <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-500">Confidence</span>
              </h1>
              <p className="text-lg text-gray-600 max-w-xl mx-auto">
                  Streamline doctor verification, manage patient records, and oversee clinic operations from a single, secure dashboard.
              </p>
           </div>

           <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
               <LoginLink className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-emerald-500 to-green-500 text-white font-semibold rounded-xl hover:from-emerald-600 hover:to-green-600 transition-all shadow-lg shadow-emerald-500/30 flex items-center justify-center gap-2 transform hover:scale-[1.02]">
                   Access Dashboard
               </LoginLink>
               <RegisterLink className="w-full sm:w-auto px-8 py-3.5 bg-white text-gray-700 border border-gray-200 font-semibold rounded-xl hover:bg-gray-50 hover:border-emerald-200 hover:text-emerald-700 transition-all flex items-center justify-center gap-2 shadow-sm">
                   Register Clinic
               </RegisterLink>
           </div>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20 w-full mb-12">
            {[
                { icon: ShieldCheck, title: "Verified Doctors", desc: "Ensure all practitioners meet compliance standards with easy verification tools." },
                { icon: Users, title: "Patient Integrated", desc: "Seamless connection to patient records and appointment history." },
                { icon: TrendingUp, title: "Performance Insights", desc: "Track appointments, active staff, and clinic growth in real-time." }
            ].map((feature, i) => (
                <div key={i} className="bg-white/60 backdrop-blur-md p-6 rounded-2xl border border-white/50 shadow-sm hover:shadow-emerald-100 hover:border-emerald-100 transition-all group">
                    <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 mb-4 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                        <feature.icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">{feature.desc}</p>
                </div>
            ))}
        </div>

      </main>

      <Footer />
    </div>
  );
}

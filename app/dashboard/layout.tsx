
import { ReactNode } from 'react';
import Sidebar from '@/components/Sidebar';
import AuthSync from '@/components/AuthSync';
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import { Toaster } from 'react-hot-toast';

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const { isAuthenticated } = getKindeServerSession();
  
  if (!(await isAuthenticated())) {
      redirect("/api/auth/login");
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Toaster position="top-right" />
      <AuthSync />
      <Sidebar />
      <main className="flex-1 ml-64 p-8">
        {children}
      </main>
    </div>
  );
}

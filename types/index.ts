export type UserRole = 'patient' | 'doctor' | 'admin' | 'clinic' | 'delivery_boy';

export interface User {
  uid: string;
  email: string;
  phone?: string;
  password_hash?: string;
  role: UserRole;
  name: string;
  profile_image_url?: string;
  is_verified: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  last_login?: string;
  auth_id?: string;
}

export interface Clinic {
  clinic_id: string;
  uid: string;
  clinic_name: string;
  registration_number?: string;
  address_line1?: string;
  address_line2?: string;
  city?: string;
  state?: string;
  country?: string;
  postal_code?: string;
  phone?: string;
  email?: string;
  website?: string;
  description?: string;
  logo_url?: string;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface Doctor {
  did: string;
  uid: string;
  clinic_id?: string;
  specialization: any; // string array or string, existing code used string usually but DB is array
  qualification: string;
  registration_number?: string;
  years_of_experience: number;
  consultation_fee: number;
  bio?: string;
  clinic_name?: string;
  address_line1?: string;
  address_line2?: string;
  city?: string;
  state?: string;
  country: string;
  postal_code?: string;
  languages?: string[];
  is_verified: boolean;
  created_at: string;
  updated_at: string;
  treated_patient_uids: string[];
  custom_specializations?: string;
  // Joined user data
  user?: User;
}

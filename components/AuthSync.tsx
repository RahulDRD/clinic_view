'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

/**
 * AuthSync component
 * Ensures the authenticated user is synced to our database with correct role
 * This component should be included in the dashboard layout
 */
export default function AuthSync() {
  const [synced, setSynced] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function syncUser() {
      if (synced) return;

      try {
        const res = await fetch('/api/auth/sync', {
          method: 'POST',
        });

        const data = await res.json();

        if (data.success) {
          setSynced(true);
          // Refresh the page to load user data
          if (data.message === 'User and clinic created successfully') {
            router.refresh();
          }
        } else {
          console.error('Sync failed:', data.error);
        }
      } catch (error) {
        console.error('Sync error:', error);
      }
    }

    syncUser();
  }, [synced, router]);

  return null; // This component doesn't render anything
}

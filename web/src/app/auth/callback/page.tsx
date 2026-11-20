'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getSupabaseClient } from '@/lib/supabase';
import { AppStorage } from '@/lib/storage';
import { Loader2 } from 'lucide-react';

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const processAuth = async () => {
      try {
        const client = getSupabaseClient();
        if (client) {
          const { data: { session } } = await client.auth.getSession();
          if (session?.user) {
            await AppStorage.syncFromSupabase(session.user.id);
          }
        }
      } catch (err) {
        console.error('Error handling auth callback:', err);
      } finally {
        router.replace('/learn/english');
      }
    };
    processAuth();
  }, [router]);

  return (
    <div className="min-h-screen bg-[#060911] text-white flex flex-col items-center justify-center space-y-4 font-sans">
      <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
      <p className="text-sm font-mono text-slate-300">Conectando con tu cuenta de Nativa...</p>
    </div>
  );
}

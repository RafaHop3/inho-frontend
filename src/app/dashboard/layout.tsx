'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Menu } from 'lucide-react';
import { auth } from '@/lib/auth';
import { useAuth } from '@/lib/AuthContext';
import Sidebar from '@/components/Sidebar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, activeBusinessId, isLoading } = useAuth();
  const [canRender, setCanRender] = useState(false);

  useEffect(() => {
    // Await the AuthContext rehydration mechanism
    if (isLoading) return;

    if (!auth.isAuthenticated() || auth.isExpired() || !user) {
      auth.clear();
      router.replace('/login');
    } else {
      if (['admin', 'super_admin'].includes(user.role) && !activeBusinessId) {
        router.replace('/onboarding');
      } else {
        setCanRender(true);
      }
    }
  }, [router, user, activeBusinessId, isLoading]);

  if (!canRender) {
    return (
      <div className="min-h-screen bg-terminal-bg flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-neon-cyan border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-terminal-bg text-terminal-text font-mono">
      {/* Sidebar */}
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Mobile Top Header (Sticky on Mobile only) */}
        <header className="md:hidden flex items-center justify-between px-6 py-4 bg-terminal-surface border-b border-terminal-border sticky top-0 z-20">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-neon-cyan flex items-center justify-center shadow-[0_0_10px_rgba(0,255,245,0.4)]">
              <span className="font-black text-terminal-bg text-[10px]">O</span>
            </div>
            <span className="font-mono text-xs font-bold text-terminal-text tracking-widest uppercase">ORBE</span>
          </div>
          <button
            onClick={() => setMobileOpen(true)}
            className="p-1.5 text-terminal-muted hover:text-terminal-bright bg-white/5 rounded-lg border border-terminal-border hover:border-neon-cyan transition-colors"
          >
            <Menu size={18} />
          </button>
        </header>

        {/* Scrollable Page Wrapper */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

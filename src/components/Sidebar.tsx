'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  BarChart3, FileSignature, ShoppingCart, Monitor, ShieldCheck,
  ChevronDown, ChevronRight, LogOut, User, Users, FileText,
  X, Settings, BellRing, MessageSquare
} from 'lucide-react';
import OrbeLogo from './OrbeLogo';
import { useAuth } from '@/lib/AuthContext';

interface SidebarProps {
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

export default function Sidebar({ mobileOpen, setMobileOpen }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();  // ← AuthContext, not localStorage

  const [comOpen, setComOpen] = useState(true);
  const [finOpen, setFinOpen] = useState(true);
  const [sysOpen, setSysOpen] = useState(true);

  const handleLogout = async () => {
    await logout();          // clears memory token + HttpOnly cookie
    router.replace('/login');
  };

  const isLinkActive = (href: string) => {
    if (href === '/dashboard') return pathname === '/dashboard';
    return pathname.startsWith(href);
  };

  // ── RBAC helpers ─────────────────────────────────────────────────
  const normRole = (user?.role || 'admin').toLowerCase();
  const isAdmin = normRole === 'super_admin' || normRole === 'admin';

  const roleColor: Record<string, string> = {
    super_admin: 'text-neon-cyan border-neon-cyan/30 bg-neon-cyan/10',
    admin: 'text-neon-blue border-neon-blue/30 bg-neon-blue/10',
    operator: 'text-neon-green border-neon-green/30 bg-neon-green/10',
    viewer: 'text-terminal-muted border-terminal-border bg-terminal-surface/50',
    client: 'text-terminal-text border-terminal-border bg-terminal-surface/50',
  };

  const navContent = (
    <div className="flex flex-col h-full bg-terminal-surface border-r border-terminal-border font-mono text-xs">
      {/* Brand Header */}
      <div className="p-6 border-b border-terminal-border flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-2" onClick={() => setMobileOpen(false)}>
          <OrbeLogo className="w-7 h-7" variant="header" />
          <span className="font-bold text-sm text-terminal-text tracking-widest uppercase">ORBE INHO</span>
        </Link>
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 bg-neon-green rounded-full animate-pulse" />
          <span className="text-[10px] text-terminal-muted">Online</span>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        {/* Hub Principal */}
        <Link
          href="/dashboard"
          onClick={() => setMobileOpen(false)}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${isLinkActive('/dashboard') && pathname === '/dashboard'
            ? 'bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/20'
            : 'text-terminal-muted hover:text-terminal-text hover:bg-white/5 border border-transparent'
            }`}
        >
          <BarChart3 size={16} />
          <span className="font-bold uppercase tracking-wider">Hub Executivo</span>
        </Link>

        {/* SESSÃO 1: COMERCIAL & COOPERATIVA */}
        <div className="space-y-1">
          <button
            onClick={() => setComOpen(!comOpen)}
            className="w-full flex items-center justify-between px-3 py-2 text-neon-blue hover:bg-neon-blue/5 rounded-lg transition-colors font-bold uppercase tracking-wider"
          >
            <span className="flex items-center gap-2">
              <span className="w-1 h-3 bg-neon-blue rounded-full" />
              Comercial & CRM
            </span>
            {comOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </button>

          {comOpen && (
            <div className="pl-4 space-y-0.5 border-l border-neon-blue/10 ml-3.5 mt-1">
              {[
                { label: 'Dossiê Cooperativa', href: '/dashboard/cooperativa', icon: BarChart3 },
                { label: 'Sócios & Contatos', href: '/dashboard/contacts', icon: Users },
                { label: 'WhatsApp (OrBrick)', href: '/dashboard/whatsapp', icon: MessageSquare },
                { label: 'Pedidos de Venda', href: '/dashboard/sales-orders', icon: ShoppingCart },
                { label: 'Frente de Caixa (PDV)', href: '/dashboard/pdv', icon: Monitor },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-lg transition-colors ${isLinkActive(item.href)
                    ? 'bg-neon-blue/10 text-neon-blue font-bold'
                    : 'text-terminal-muted hover:text-terminal-text hover:bg-white/5'
                    }`}
                >
                  <item.icon size={14} />
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* SESSÃO 2: FINANCEIRO & RECORRÊNCIA */}
        <div className="space-y-1">
          <button
            onClick={() => setFinOpen(!finOpen)}
            className="w-full flex items-center justify-between px-3 py-2 text-purple-400 hover:bg-purple-500/5 rounded-lg transition-colors font-bold uppercase tracking-wider"
          >
            <span className="flex items-center gap-2">
              <span className="w-1 h-3 bg-purple-500 rounded-full" />
              Financeiro & DRE
            </span>
            {finOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </button>

          {finOpen && (
            <div className="pl-4 space-y-0.5 border-l border-purple-500/10 ml-3.5 mt-1">
              {[
                { label: 'Cobranças & Régua PIX', href: '/dashboard/billing', icon: BellRing },
                { label: 'Contas a Pagar', href: '/dashboard/payable', icon: FileText },
                { label: 'Contratos Recorrentes', href: '/dashboard/contracts', icon: FileSignature },
                { label: 'Relatórios & DRE', href: '/dashboard/reports', icon: BarChart3 },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-lg transition-colors ${isLinkActive(item.href)
                    ? 'bg-purple-500/10 text-purple-400 font-bold'
                    : 'text-terminal-muted hover:text-terminal-text hover:bg-white/5'
                    }`}
                >
                  <item.icon size={14} />
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* SESSÃO 3: GOVERNANÇA, CLIMA & SISTEMA */}
        <div className="space-y-1">
          <button
            onClick={() => setSysOpen(!sysOpen)}
            className="w-full flex items-center justify-between px-3 py-2 text-neon-green hover:bg-neon-green/5 rounded-lg transition-colors font-bold uppercase tracking-wider"
          >
            <span className="flex items-center gap-2">
              <span className="w-1 h-3 bg-neon-green rounded-full" />
              Governança & Sistema
            </span>
            {sysOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </button>

          {sysOpen && (
            <div className="pl-4 space-y-0.5 border-l border-neon-green/10 ml-3.5 mt-1">
              {[
                { label: 'Pesquisa de Clima (PCO)', href: '/dashboard/pco', icon: Users },
                ...(isAdmin ? [
                  { label: 'Trilha de Auditoria', href: '/dashboard/audit', icon: ShieldCheck },
                  { label: 'Equipe & Operadores', href: '/dashboard/users', icon: Users },
                  { label: 'Configurações & API', href: '/dashboard/settings', icon: Settings },
                ] : []),
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-lg transition-colors ${isLinkActive(item.href)
                    ? 'bg-neon-green/10 text-neon-green font-bold'
                    : 'text-terminal-muted hover:text-terminal-text hover:bg-white/5'
                    }`}
                >
                  <item.icon size={14} />
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* User Session Footer */}
      {user && (
        <div className="p-4 border-t border-terminal-border space-y-3 bg-terminal-bg/40">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-neon-cyan/10 border border-neon-cyan/20 flex items-center justify-center flex-shrink-0">
              <User size={14} className="text-neon-cyan" />
            </div>
            <div className="min-w-0 flex-1">
              {/* Now shows the real full_name from /users/me → AuthContext */}
              <p className="text-terminal-text font-bold truncate">{user.full_name}</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className={`text-[9px] px-1.5 py-0.5 rounded border font-bold uppercase tracking-widest ${roleColor[user.role] ?? roleColor.client}`}>
                  {user.role_label || (user.role === 'admin' ? 'Usuário Mestre' : user.role === 'operator' ? 'Operador' : user.role === 'super_admin' ? 'Super Admin' : 'Visualizador')}
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 bg-terminal-surface border border-terminal-border hover:border-red-500/50 hover:text-red-400 text-terminal-muted py-2 rounded-xl transition-all font-bold text-[10px] uppercase tracking-wider"
          >
            <LogOut size={12} />
            Sair da Conta
          </button>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-64 h-screen sticky top-0 flex-shrink-0 z-30">
        {navContent}
      </aside>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 flex md:hidden">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative flex flex-col w-64 max-w-xs h-full bg-terminal-surface animate-slide-right">
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-4 right-4 text-terminal-muted hover:text-terminal-text"
            >
              <X size={18} />
            </button>
            {navContent}
          </div>
        </div>
      )}
    </>
  );
}

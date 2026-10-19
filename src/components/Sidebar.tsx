'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  BarChart3, FileSignature, ShoppingCart, Monitor, ShieldCheck,
  ChevronDown, ChevronRight, LogOut, User, Users, FileText,
  X, Settings, BellRing, MessageSquare, Calendar, Receipt,
  Layers, Lock, TrendingUp, FileCheck, Wallet
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
  const { user, logout } = useAuth();

  const [crmOpen, setCrmOpen] = useState(true);
  const [recOpen, setRecOpen] = useState(true);
  const [pagOpen, setPagOpen] = useState(true);
  const [orgOpen, setOrgOpen] = useState(true);
  const [accOpen, setAccOpen] = useState(true);
  const [sysOpen, setSysOpen] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      setActiveCategory(params.get('category'));
    }
  }, [pathname]);

  const handleLogout = async () => {
    await logout();
    router.replace('/login');
  };

  const isExactOrSub = (href: string) => {
    if (href === '/dashboard') return pathname === '/dashboard';
    if (href === '/dashboard/billing') return pathname === '/dashboard/billing';
    if (href === '/dashboard/payable') return pathname === '/dashboard/payable';
    if (href === '/dashboard/contacts') return pathname === '/dashboard/contacts' && !activeCategory;
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
    <div className="flex flex-col h-full bg-[#05070B] border-r border-terminal-border font-mono text-xs select-none">
      {/* Brand Header */}
      <div className="p-5 border-b border-terminal-border flex items-center justify-between bg-[#080B11]">
        <Link href="/dashboard" className="flex items-center gap-2.5" onClick={() => setMobileOpen(false)}>
          <OrbeLogo className="w-7 h-7" variant="header" />
          <div>
            <span className="font-bold text-sm text-terminal-text tracking-widest uppercase block leading-none">ORBE INHO</span>
            <span className="text-[9px] text-neon-cyan tracking-widest uppercase">Enterprise ERP</span>
          </div>
        </Link>
        <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-neon-green/10 border border-neon-green/30">
          <div className="w-1.5 h-1.5 bg-neon-green rounded-full animate-pulse shadow-[0_0_8px_#39ff14]" />
          <span className="text-[9px] text-neon-green font-bold uppercase">Online</span>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-5 custom-scrollbar">
        {/* Hub Principal */}
        <Link
          href="/dashboard"
          onClick={() => { setActiveCategory(null); setMobileOpen(false); }}
          className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all duration-200 ${
            isExactOrSub('/dashboard')
              ? 'bg-neon-cyan/15 text-neon-cyan border border-neon-cyan/30 shadow-[0_0_15px_rgba(0,255,245,0.12)] font-bold'
              : 'text-terminal-muted hover:text-terminal-text hover:bg-white/5 border border-transparent'
          }`}
        >
          <BarChart3 size={16} />
          <span className="font-bold uppercase tracking-wider">Hub Executivo</span>
        </Link>

        {/* SESSÃO 1: CRM & ENTIDADES (Estilo NIBUS + SÓCIOS Cooperativismo) */}
        <div className="space-y-1">
          <button
            onClick={() => setCrmOpen(!crmOpen)}
            className="w-full flex items-center justify-between px-3 py-2 text-terminal-text hover:bg-white/5 rounded-lg transition-colors font-bold uppercase tracking-widest text-[11px]"
          >
            <span className="flex items-center gap-2.5">
              <Users size={15} className="text-neon-cyan drop-shadow-[0_0_6px_rgba(0,255,245,0.6)]" />
              <span>CRM & ENTIDADES</span>
            </span>
            {crmOpen ? <ChevronDown size={14} className="text-terminal-muted" /> : <ChevronRight size={14} className="text-terminal-muted" />}
          </button>

          {crmOpen && (
            <div className="pl-3 space-y-1 ml-2 mt-1">
              {[
                { label: 'CLIENTES', href: '/dashboard/contacts?category=CUSTOMER', cat: 'CUSTOMER' },
                { label: 'FORNECEDORES', href: '/dashboard/contacts?category=SUPPLIER', cat: 'SUPPLIER' },
                { label: 'FUNCIONÁRIOS', href: '/dashboard/contacts?category=EMPLOYEE', cat: 'EMPLOYEE' },
                { label: 'SÓCIOS', href: '/dashboard/cooperativa', cat: 'COOPERADO' },
              ].map((item) => {
                const isActive =
                  item.cat === 'COOPERADO'
                    ? pathname.startsWith('/dashboard/cooperativa')
                    : pathname === '/dashboard/contacts' && activeCategory === item.cat;
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => {
                      setActiveCategory(item.cat === 'COOPERADO' ? null : item.cat);
                      setMobileOpen(false);
                    }}
                    className={`block px-4 py-2.5 rounded-xl tracking-widest uppercase transition-all text-xs ${
                      isActive
                        ? 'bg-[#161B24] text-white font-extrabold border border-neon-cyan/30 shadow-[0_0_12px_rgba(0,255,245,0.1)]'
                        : 'text-[#8b949e] hover:text-white hover:bg-white/5 font-semibold'
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* SESSÃO 2: RECEBIMENTOS (Com indicador verde neon estilo NIBUS) */}
        <div className="space-y-1">
          <button
            onClick={() => setRecOpen(!recOpen)}
            className="w-full flex items-center justify-between px-3 py-2 text-terminal-text hover:bg-white/5 rounded-lg transition-colors font-bold uppercase tracking-widest text-[11px]"
          >
            <span className="flex items-center gap-2.5">
              <span className="w-3.5 h-3.5 rounded-full bg-neon-green/20 border border-neon-green flex items-center justify-center shadow-[0_0_10px_#39ff14]">
                <span className="w-1.5 h-1.5 rounded-full bg-neon-green" />
              </span>
              <span>RECEBIMENTOS</span>
            </span>
            {recOpen ? <ChevronDown size={14} className="text-terminal-muted" /> : <ChevronRight size={14} className="text-terminal-muted" />}
          </button>

          {recOpen && (
            <div className="pl-5 space-y-1 ml-2 mt-1 border-l border-neon-green/15">
              {[
                { label: 'Receber', href: '/dashboard/billing' },
                { label: 'Agendar', href: '/dashboard/billing/schedule' },
                { label: 'Boletos', href: '/dashboard/billing/boletos' },
                { label: 'NFS-e', href: '/dashboard/billing/nfse' },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => { setActiveCategory(null); setMobileOpen(false); }}
                  className={`block px-3.5 py-2 rounded-lg transition-colors text-xs ${
                    isExactOrSub(item.href)
                      ? 'bg-neon-green/10 text-neon-green font-bold border border-neon-green/25'
                      : 'text-[#8b949e] hover:text-white hover:bg-white/5'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* SESSÃO 3: PAGAMENTOS & CAIXA */}
        <div className="space-y-1">
          <button
            onClick={() => setPagOpen(!pagOpen)}
            className="w-full flex items-center justify-between px-3 py-2 text-terminal-text hover:bg-white/5 rounded-lg transition-colors font-bold uppercase tracking-widest text-[11px]"
          >
            <span className="flex items-center gap-2.5">
              <span className="w-3.5 h-3.5 rounded-full bg-amber-500/20 border border-amber-400 flex items-center justify-center shadow-[0_0_10px_rgba(245,158,11,0.5)]">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              </span>
              <span>PAGAMENTOS</span>
            </span>
            {pagOpen ? <ChevronDown size={14} className="text-terminal-muted" /> : <ChevronRight size={14} className="text-terminal-muted" />}
          </button>

          {pagOpen && (
            <div className="pl-5 space-y-1 ml-2 mt-1 border-l border-amber-500/15">
              {[
                { label: 'Contas a Pagar', href: '/dashboard/payable', icon: Wallet },
                { label: 'Agendar Pagamentos', href: '/dashboard/payable/schedule', icon: Calendar },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => { setActiveCategory(null); setMobileOpen(false); }}
                  className={`flex items-center gap-2.5 px-3.5 py-2 rounded-lg transition-colors text-xs ${
                    isExactOrSub(item.href)
                      ? 'bg-amber-500/10 text-amber-400 font-bold border border-amber-500/25'
                      : 'text-[#8b949e] hover:text-white hover:bg-white/5'
                  }`}
                >
                  <item.icon size={13} />
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* SESSÃO 4: ORGANIZAÇÃO & COMERCIAL */}
        <div className="space-y-1">
          <button
            onClick={() => setOrgOpen(!orgOpen)}
            className="w-full flex items-center justify-between px-3 py-2 text-[#d946ef] hover:bg-purple-500/5 rounded-lg transition-colors font-bold uppercase tracking-widest text-[11px]"
          >
            <span className="flex items-center gap-2">
              <span className="w-1 h-3.5 bg-[#d946ef] rounded-full shadow-[0_0_8px_#d946ef]" />
              <span>ORGANIZAÇÃO</span>
            </span>
            {orgOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </button>

          {orgOpen && (
            <div className="pl-3 space-y-1 border-l border-purple-500/15 ml-3 mt-1">
              {[
                { label: 'GESTÃO DE CONTATOS', href: '/dashboard/contacts', icon: Users },
                { label: 'WHATSAPP (ORBRICK)', href: '/dashboard/whatsapp', icon: MessageSquare },
                { label: 'FUNIL DE VENDAS', href: '/dashboard/funnel', icon: TrendingUp },
                { label: 'PROPOSTAS & ORÇAM.', href: '/dashboard/proposals', icon: FileCheck },
                { label: 'PEDIDOS DE VENDA', href: '/dashboard/sales-orders', icon: ShoppingCart },
                { label: 'FRENTE DE CAIXA (PDV)', href: '/dashboard/pdv', icon: Monitor },
                { label: 'COBRANÇAS E AVISOS', href: '/dashboard/billing', icon: BellRing },
                { label: 'ASSIST. E CONTRATOS', href: '/dashboard/contracts', icon: FileSignature },
              ].map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => { setActiveCategory(null); setMobileOpen(false); }}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-lg transition-colors text-[11px] tracking-wider ${
                    isExactOrSub(item.href)
                      ? 'bg-purple-500/15 text-[#e879f9] font-bold border border-purple-500/30'
                      : 'text-[#8b949e] hover:text-white hover:bg-white/5'
                  }`}
                >
                  <item.icon size={14} />
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* SESSÃO 5: CONTABILIDADE & INTELIGÊNCIA BI */}
        <div className="space-y-1">
          <button
            onClick={() => setAccOpen(!accOpen)}
            className="w-full flex items-center justify-between px-3 py-2 text-neon-cyan hover:bg-neon-cyan/5 rounded-lg transition-colors font-bold uppercase tracking-widest text-[11px]"
          >
            <span className="flex items-center gap-2">
              <span className="w-1 h-3.5 bg-neon-cyan rounded-full shadow-[0_0_8px_#00fff5]" />
              <span>CONTABILIDADE & BI</span>
            </span>
            {accOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </button>

          {accOpen && (
            <div className="pl-3 space-y-1 border-l border-neon-cyan/15 ml-3 mt-1">
              {[
                { label: 'RELATÓRIOS & DRE', href: '/dashboard/reports', icon: BarChart3 },
                { label: 'PLANO DE CONTAS', href: '/dashboard/categories', icon: Layers },
                { label: 'FECHAMENTO & CONTADOR', href: '/dashboard/accounting', icon: Lock },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => { setActiveCategory(null); setMobileOpen(false); }}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-lg transition-colors text-[11px] tracking-wider ${
                    isExactOrSub(item.href)
                      ? 'bg-neon-cyan/10 text-neon-cyan font-bold border border-neon-cyan/30'
                      : 'text-[#8b949e] hover:text-white hover:bg-white/5'
                  }`}
                >
                  <item.icon size={14} />
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* SESSÃO 6: SISTEMA & GOVERNANÇA */}
        <div className="space-y-1 pt-2 border-t border-terminal-border/60">
          <button
            onClick={() => setSysOpen(!sysOpen)}
            className="w-full flex items-center justify-between px-3 py-2 text-neon-blue hover:bg-neon-blue/5 rounded-lg transition-colors font-bold uppercase tracking-widest text-[11px]"
          >
            <span className="flex items-center gap-2">
              <span className="w-1 h-3.5 bg-neon-blue rounded-full shadow-[0_0_8px_#3b82f6]" />
              <span>SISTEMA</span>
            </span>
            {sysOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </button>

          {sysOpen && (
            <div className="pl-3 space-y-1 border-l border-neon-blue/15 ml-3 mt-1">
              {[
                { label: 'PESQUISA DE CLIMA (PCO)', href: '/dashboard/pco', icon: Users },
                ...(isAdmin
                  ? [
                      { label: 'TRILHA DE AUDITORIA', href: '/dashboard/audit', icon: ShieldCheck },
                      { label: 'EQUIPE & OPERADORES', href: '/dashboard/users', icon: Users },
                      { label: 'CONFIGURAÇÕES & API', href: '/dashboard/settings', icon: Settings },
                    ]
                  : []),
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => { setActiveCategory(null); setMobileOpen(false); }}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-lg transition-colors text-[11px] tracking-wider ${
                    isExactOrSub(item.href)
                      ? 'bg-neon-blue/10 text-neon-blue font-bold border border-neon-blue/30'
                      : 'text-[#8b949e] hover:text-white hover:bg-white/5'
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
        <div className="p-4 border-t border-terminal-border space-y-3 bg-[#080B11]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-neon-cyan/10 border border-neon-cyan/20 flex items-center justify-center flex-shrink-0">
              <User size={14} className="text-neon-cyan" />
            </div>
            <div className="min-w-0 flex-1">
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

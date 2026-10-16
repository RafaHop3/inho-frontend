'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ShieldCheck, ArrowRight, User, Users } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';
import { addLoginLog } from '@/lib/loginLog';
import { businessesApi } from '@/lib/api';
import Image from 'next/image';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();

  const [form, setForm] = useState({ email: '', password: '' });
  const [showMfa, setShowMfa] = useState(false);
  const [mfaCode, setMfaCode] = useState('');
  const [loginMode, setLoginMode] = useState<'selection' | 'colaborador' | 'proprietario'>('selection');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const ssoToken = searchParams.get('token') || searchParams.get('sso_token');
    if (ssoToken) {
      localStorage.setItem('inho_access_token', ssoToken);
      router.push('/dashboard');
    }
  }, [searchParams, router]);



  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      setError('Preencha e-mail e senha.');
      return;
    }
    if (showMfa && (!mfaCode || mfaCode.length !== 6)) {
      setError('Digite o código de 6 dígitos do seu Authenticator.');
      return;
    }
    setLoading(true);
    setError('');
    const payload = { email: form.email, password: form.password, ...(showMfa && mfaCode ? { mfa_code: mfaCode } : {}) };
    try {
      const loggedUser = await login(payload);
      await addLoginLog({ timestamp: new Date().toISOString(), payload, result: loggedUser });
      if (loggedUser && (loggedUser.role === 'admin' || loggedUser.role === 'super_admin')) {
        router.push('/admin');
      } else if (loggedUser && loggedUser.role === 'operator') {
        router.push('/dashboard');
      } else {
        router.push('/dashboard');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      await addLoginLog({ timestamp: new Date().toISOString(), payload, error: err });
      if (msg.includes('MFA_REQUIRED') || msg.includes('2FA')) {
        setShowMfa(true);
        setError('Autenticação de 2 fatores ativada! Digite o código do seu aplicativo Authenticator.');
      } else {
        setError(msg || 'Credenciais inválidas ou acesso não autorizado.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-inho-black grid-bg flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Ambient lights */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/3 right-1/4 w-64 h-64 bg-inho-gold/10 rounded-full blur-3xl animate-float-delayed" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Brand Header */}
        <div className="text-center mb-8 animate-fade-in flex flex-col items-center">
          <div className="w-16 h-16 rounded-2xl bg-inho-gold-gradient shadow-inho-gold flex items-center justify-center mb-4 border border-inho-gold/30 relative">
            <span className="font-sans font-black text-3xl text-inho-black shadow-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">I</span>
          </div>
          <h1 className="text-3xl font-black text-inho-text mb-2 tracking-tight">
            Portal <span className="text-shimmer">INHO</span>
          </h1>
          <p className="text-inho-muted text-sm font-mono tracking-widest uppercase">
            Acesso à Plataforma
          </p>
        </div>

        {/* Card */}
        <div className="glassmorphism rounded-3xl p-6 md:p-8 border border-white/5 shadow-2xl animate-slide-up relative overflow-hidden">

          {loginMode === 'selection' ? (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <p className="text-slate-300 text-sm">Selecione o seu perfil de acesso para entrar no sistema.</p>
              </div>

              {/* Path 1: Proprietário */}
              <button
                onClick={() => setLoginMode('proprietario')}
                className="group w-full p-5 bg-cyan-500/5 hover:bg-cyan-500/10 border border-cyan-500/20 hover:border-cyan-400/50 rounded-2xl transition-all flex items-start gap-4 text-left"
              >
                <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  <ShieldCheck size={20} className="text-cyan-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-cyan-300 font-bold text-sm tracking-wide mb-1">Proprietário / Admin</h3>
                  <p className="text-xs text-inho-muted leading-relaxed">
                    Acesso administrativo do negócio focado em gestão.
                  </p>
                </div>
              </button>

              {/* Path 2: Equipe / Sub-usuários */}
              <button
                onClick={() => setLoginMode('colaborador')}
                className="group w-full p-5 bg-inho-gold/5 hover:bg-inho-gold/10 border border-inho-gold/20 hover:border-inho-gold/50 rounded-2xl transition-all flex items-start gap-4 text-left"
              >
                <div className="w-10 h-10 rounded-full bg-inho-gold/20 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  <Users size={20} className="text-inho-gold" />
                </div>
                <div className="flex-1">
                  <h3 className="text-inho-gold font-bold text-sm tracking-wide mb-1">Equipe / Colaborador</h3>
                  <p className="text-xs text-inho-muted leading-relaxed">
                    Acesso exclusivo para funcionários da instituição.
                  </p>
                </div>
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                <button
                  onClick={() => setLoginMode('selection')}
                  className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-inho-muted hover:text-white hover:bg-white/10 transition-colors"
                >
                  ←
                </button>
                <div>
                  <h2 className="text-inho-text font-bold text-sm">
                    {loginMode === 'proprietario' ? 'Entrar como Proprietário' : 'Entrar como Colaborador'}
                  </h2>
                  <p className="text-xs text-inho-muted">
                    {loginMode === 'proprietario'
                      ? 'Gestão Financeira e Administrativa'
                      : 'Use suas credenciais cadastradas pelo gestor.'}
                  </p>
                </div>
              </div>

              <form onSubmit={handleLoginSubmit} className="space-y-5" noValidate>
                {error && (
                  <div className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium">
                    {error}
                  </div>
                )}
                <div className="space-y-1.5">
                  <label className="text-inho-muted text-[11px] font-bold uppercase tracking-wider pl-1">E-mail de Acesso</label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    placeholder="Seu e-mail cadastrado"
                    className="w-full bg-inho-dark/80 border border-inho-border rounded-xl px-4 py-3.5 text-inho-text text-sm focus:outline-none focus:border-inho-gold/50 transition-colors"
                  />
                </div>
                <div className="space-y-1.5 pt-1">
                  <label className="text-inho-muted text-[11px] font-bold uppercase tracking-wider pl-1">Senha de Segurança</label>
                  <input
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                    placeholder="Sua senha secreta"
                    className="w-full bg-inho-dark/80 border border-inho-border rounded-xl px-4 py-3.5 text-inho-text text-sm focus:outline-none focus:border-inho-gold/50 transition-colors"
                  />
                </div>
                {showMfa && (
                  <div className="space-y-1.5 pt-1 animate-fade-in">
                    <label className="text-inho-gold text-[11px] font-bold uppercase tracking-wider pl-1 flex items-center gap-1">
                      <ShieldCheck size={14} /> Código 2FA Authenticator (6 dígitos)
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      value={mfaCode}
                      onChange={e => setMfaCode(e.target.value.replace(/\D/g, ''))}
                      placeholder="000000"
                      className="w-full text-center text-xl font-mono tracking-[0.4em] font-black bg-inho-black border border-inho-gold/50 rounded-xl py-3 text-inho-gold focus:outline-none focus:border-inho-gold shadow-[0_0_15px_rgba(255,200,87,0.15)]"
                    />
                  </div>
                )}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 bg-inho-gold text-inho-black font-black text-sm rounded-xl hover:bg-inho-gold/90 transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,200,87,0.15)] disabled:opacity-50"
                  >
                    {loading ? 'Validando Acesso...' : 'Acessar Painel'}
                    {!loading && <ArrowRight size={16} />}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Security Footer */}
        <div className="mt-8 flex items-center justify-center gap-2 text-inho-muted text-[10px] opacity-60">
          <ShieldCheck size={12} />
          <span className="font-mono uppercase tracking-widest">Ambiente Seguro</span>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-inho-black flex items-center justify-center text-inho-gold">Carregando Portal...</div>}>
      <LoginContent />
    </Suspense>
  );
}

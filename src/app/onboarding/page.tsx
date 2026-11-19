'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/AuthContext';
import { businessesApi } from '@/lib/api';
import {
  Building2,
  Hotel,
  ArrowRight,
  Loader2,
  Plus,
  Store,
  Plane,
  Briefcase,
  Utensils,
  Sparkles,
  LayoutDashboard,
} from 'lucide-react';
import { GlassButton } from '@/components/ui/glass-button';

interface VerticalConfig {
  key: string;
  category: string;
  matchCategories: string[];
  title: string;
  badge: string;
  description: string;
  defaultName: string;
  targetHref: string;
  icon: any;
  accentClass: string;
  active: boolean;
}

const INHO_VERTICALS: VerticalConfig[] = [
  {
    key: 'cooperativa',
    category: 'COOPERATIVA',
    matchCategories: ['COOPERATIVA'],
    title: 'Cooperativismo & Capital Social',
    badge: 'MÓDULO OURO ATIVO',
    description:
      'Quadro societário (Lei 5.764/71), integralização de cota-parte, rateio de sobras AGO, faturamento PIX/Boleto, Open Finance BACEN e OrBrick-IA com PolicyEngine.',
    defaultName: 'Cooperativa INHO',
    targetHref: '/dashboard/cooperativa',
    icon: Building2,
    accentClass: 'text-[#8B6508] border-[#D4AF37]/40 bg-amber-50/70',
    active: true,
  },
  {
    key: 'mercados',
    category: 'MERCADOS_E_AFINS',
    matchCategories: ['MERCADOS_E_AFINS', 'VAREJO'],
    title: 'Mercados, Varejo & Frente de Caixa (PDV)',
    badge: 'PDV & SMART POS ATIVO',
    description:
      'Frente de Caixa rápida com leitor EAN-13, balanças pesáveis, fechamento cego auditado por IA, Maquininha Stripe Terminal (Zero Aluguel) e radar CBM de clientes.',
    defaultName: 'Supermercado & PDV INHO',
    targetHref: '/dashboard/pdv',
    icon: Store,
    accentClass: 'text-emerald-700 border-emerald-300 bg-emerald-50/70',
    active: true,
  },
  {
    key: 'turismo',
    category: 'TURISMO',
    matchCategories: ['TURISMO'],
    title: 'INHO Turismo, Agências & Milhas (AI-First)',
    badge: 'NOVO · ORBE INHO TURISMO',
    description:
      'Cotador Híbrido Dinheiro vs Milhas, Proposta Viva A/B/C, Smart Import PNR, Cofre de Milhas & Semáforo CPF (sem senhas), DRE de Intermediação, Radar de Embarque e Omnichannel Custo Zero.',
    defaultName: 'Agência INHO Turismo',
    targetHref: '/dashboard/turismo',
    icon: Plane,
    accentClass: 'text-sky-700 border-sky-300 bg-sky-50/70',
    active: true,
  },
  {
    key: 'servicos',
    category: 'SERVICOS',
    matchCategories: ['SERVICOS', 'OUTROS'],
    title: 'Serviços, ERP Corporativo & OrbeJobs',
    badge: 'ERP & ORBEJOBS ATIVO',
    description:
      'Contratos B2B, NFS-e, Contas a Pagar Dual-Control (> R$ 5.000), Funil CRM, Contabilidade DRE/Balancete e esteira autônoma de recrutamento e carreira OrbeJobs.',
    defaultName: 'Matriz Serviços & OrbeJobs',
    targetHref: '/dashboard/orbejobs',
    icon: Briefcase,
    accentClass: 'text-orange-700 border-orange-300 bg-orange-50/70',
    active: true,
  },
  {
    key: 'hotelaria',
    category: 'HOTELARIA',
    matchCategories: [],
    title: 'Redes de Hotelaria & Hospedagem',
    badge: 'EM BREVE',
    description:
      'Gestão multi-unidade de reservas, tarifação diária, governança de quartos e check-in digital integrado.',
    defaultName: 'Rede Hoteleira',
    targetHref: '#',
    icon: Hotel,
    accentClass: 'text-slate-500 border-slate-200 bg-slate-100',
    active: false,
  },
  {
    key: 'gastronomia',
    category: 'GASTRONOMIA',
    matchCategories: [],
    title: 'Gastronomia, Eventos & Sindicatos',
    badge: 'EM BREVE',
    description:
      'Controle de mesas, comandas em tempo real, ficha técnica de CMV e gestão de associados sindicais.',
    defaultName: 'Gastronomia & Eventos',
    targetHref: '#',
    icon: Utensils,
    accentClass: 'text-slate-500 border-slate-200 bg-slate-100',
    active: false,
  },
];

export default function OnboardingPage() {
  const router = useRouter();
  const { user, setActiveBusinessId } = useAuth();

  const [businesses, setBusinesses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [creatingKey, setCreatingKey] = useState<string | null>(null);
  const [customNames, setCustomNames] = useState<Record<string, string>>({});
  const [error, setError] = useState('');

  useEffect(() => {
    if (user && user.role === 'operator') {
      router.replace('/dashboard');
    }
  }, [user, router]);

  useEffect(() => {
    const fetchBiz = async () => {
      try {
        const data = await businessesApi.list();
        setBusinesses(Array.isArray(data) ? data : []);
      } catch (e: any) {
        setError(e.message || 'Falha ao buscar empresas.');
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchBiz();
  }, [user]);

  const handleSelect = (id: string, targetHref = '/dashboard') => {
    setActiveBusinessId(id);
    router.push(targetHref);
  };

  const handleCreateVertical = async (v: VerticalConfig) => {
    setCreatingKey(v.key);
    setError('');
    try {
      const chosenName = (customNames[v.key] || '').trim() || v.defaultName;
      const data = await businessesApi.create({
        name: chosenName,
        category: v.category as any,
      });
      setActiveBusinessId(data.id);
      router.push(v.targetHref || '/dashboard');
    } catch (e: any) {
      setError(e.message || `Falha ao inicializar ${v.title}.`);
      setCreatingKey(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#B8860B] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] relative flex flex-col items-center justify-center py-12 px-4 sm:px-8 overflow-x-hidden">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#D4AF37]/8 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-6xl relative z-10 animate-fade-in">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-amber-200 text-[#8B6508] text-xs font-extrabold uppercase tracking-wider shadow-sm mb-4">
            <Sparkles size={14} className="text-[#B8860B]" /> Ecossistema Multi-Vertical Orbe Systems · INHO
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-[#0F172A] mb-3 tracking-tight">
            Escolha o <span className="bg-inho-gold-gradient text-transparent bg-clip-text">Módulo &amp; Tipo de Negócio</span>
          </h1>
          <p className="text-[#475569] max-w-2xl mx-auto text-sm sm:text-base">
            Selecione uma matriz existente ou inicialize um novo ambiente operacional (Cooperativismo, Mercados &amp; PDV, Turismo &amp; Milhas ou Serviços &amp; OrbeJobs) com isolamento estrito por tenant.
          </p>

          {businesses.length > 0 && (
            <div className="mt-5 flex justify-center">
              <button
                onClick={() => handleSelect(businesses[0].id, '/dashboard')}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#0F172A] hover:bg-slate-800 text-white text-xs font-extrabold uppercase tracking-wider shadow-md transition-all"
              >
                <LayoutDashboard size={15} />
                Ir Direto ao Hub Executivo Completo ({businesses.length} {businesses.length === 1 ? 'Matriz Ativa' : 'Matrizes Ativas'})
                <ArrowRight size={15} />
              </button>
            </div>
          )}
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm text-center font-semibold">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {INHO_VERTICALS.map((v) => {
            const Icon = v.icon;
            const matchingBiz = businesses.filter((b) => v.matchCategories.includes(String(b.category || '').toUpperCase()));
            const isCreatingThis = creatingKey === v.key;

            return (
              <div
                key={v.key}
                className={`bg-white p-7 rounded-3xl border transition-all duration-300 text-left relative overflow-hidden flex flex-col justify-between ${
                  v.active
                    ? 'border-[#E2E8F0] hover:border-[#D4AF37] shadow-sm hover:shadow-md'
                    : 'border-[#E2E8F0] opacity-60 cursor-not-allowed'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-5">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${v.accentClass}`}>
                      <Icon size={24} />
                    </div>
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider border ${v.accentClass}`}
                    >
                      {v.badge}
                    </span>
                  </div>

                  <h2 className="text-xl font-extrabold text-[#0F172A] mb-2">{v.title}</h2>
                  <p className="text-[#64748B] text-xs leading-relaxed mb-6">{v.description}</p>
                </div>

                {v.active ? (
                  <div className="space-y-3 pt-3 border-t border-slate-100">
                    {matchingBiz.length > 0 && (
                      <div className="space-y-2">
                        <span className="text-[10px] font-mono font-bold text-[#8B6508] uppercase tracking-wider block">
                          Matrizes Ativas Encontradas ({matchingBiz.length}):
                        </span>
                        {matchingBiz.map((b) => (
                          <div key={b.id} className="flex gap-1.5">
                            <button
                              onClick={() => handleSelect(b.id, v.targetHref)}
                              className="flex-1 flex justify-between items-center bg-[#F8FAFC] border border-[#E2E8F0] px-3.5 py-2.5 rounded-xl hover:bg-amber-50/60 hover:border-[#D4AF37]/60 transition-all font-bold text-xs text-[#0F172A]"
                            >
                              <span className="truncate">{b.name}</span>
                              <span className="inline-flex items-center gap-1 text-[10px] text-[#8B6508] font-extrabold uppercase">
                                Abrir Módulo <ArrowRight size={13} />
                              </span>
                            </button>
                            <button
                              onClick={() => handleSelect(b.id, '/dashboard')}
                              title="Abrir no Hub Geral"
                              className="px-2.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-extrabold uppercase"
                            >
                              Hub
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="space-y-2">
                      <input
                        type="text"
                        placeholder={`Nome da nova matriz (ex: ${v.defaultName})`}
                        value={customNames[v.key] || ''}
                        onChange={(e) => setCustomNames({ ...customNames, [v.key]: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-[#F8FAFC] border border-slate-200 text-xs text-[#0F172A] focus:outline-none focus:border-[#B8860B]"
                      />
                      <GlassButton
                        onClick={() => handleCreateVertical(v)}
                        disabled={Boolean(creatingKey)}
                        glowColor="gold"
                        className="w-full flex justify-center items-center gap-1.5 py-3 text-xs font-extrabold"
                      >
                        {isCreatingThis ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <>
                            <Plus size={14} /> Inicializar {v.title.split(' ')[0]}
                          </>
                        )}
                      </GlassButton>
                    </div>
                  </div>
                ) : (
                  <button
                    disabled
                    className="mt-4 w-full py-3 font-bold rounded-xl bg-[#F1F5F9] text-[#64748B] border border-[#E2E8F0] uppercase tracking-widest text-[10px]"
                  >
                    Em Breve
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

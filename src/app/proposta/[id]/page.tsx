'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { CheckCircle2, Plane, Sparkles } from 'lucide-react';
import { turismoApi } from '@/lib/api';

export default function PublicPropostaVivaPage() {
  const params = useParams();
  const slug = String(params?.id || '');
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!slug) return;
    turismoApi
      .getPublicProposta(slug)
      .then(setData)
      .catch((err) => setError(err?.message || 'Proposta não encontrada.'));
  }, [slug]);

  const handleSelect = async (opt: 'A' | 'B' | 'C') => {
    setSaving(true);
    try {
      const res = await turismoApi.selectPublicProposta(slug, opt);
      setData((prev: any) => ({ ...prev, selected_option: res.selected_option, status: res.status }));
    } catch (err: any) {
      setError(err?.message || 'Erro ao confirmar opção.');
    } finally {
      setSaving(false);
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6">
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 text-sm">{error}</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-300 flex items-center justify-center p-6 text-sm">
        Carregando Proposta Viva...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white py-12 px-4 sm:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/15 border border-sky-400/40 text-sky-300 text-xs font-bold uppercase">
            <Plane size={14} /> Proposta Viva · {data.origin} → {data.destination}
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold mt-3">
            Olá, {data.client_name}! Escolha a melhor opção para sua viagem
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            {data.passengers} passageiro(s) · Modo recomendado pela inteligência tarifária:{' '}
            <strong className="text-emerald-400">{data.recommended_mode}</strong>
            {Number(data.savings_brl) > 0 && ` (Economia estimada de R$ ${Number(data.savings_brl).toFixed(2)})`}
          </p>
        </div>

        {data.status === 'APPROVED' && (
          <div className="p-4 rounded-2xl bg-emerald-950/70 border border-emerald-500/40 text-emerald-200 text-sm font-bold flex items-center gap-2">
            <CheckCircle2 size={18} /> Opção {data.selected_option} aprovada! Nossa equipe já recebeu sua escolha para emissão.
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {(data.options || []).map((opt: any) => {
            const isSelected = data.selected_option === opt.code;
            return (
              <div
                key={opt.code}
                className={`p-6 rounded-2xl border flex flex-col justify-between transition-all ${
                  isSelected
                    ? 'bg-emerald-950/40 border-emerald-400 shadow-lg'
                    : 'bg-slate-900 border-slate-800 hover:border-sky-500/60'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-xs font-extrabold">Opção {opt.code}</span>
                    {opt.mode === data.recommended_mode && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-amber-300 uppercase">
                        <Sparkles size={11} /> Recomendada
                      </span>
                    )}
                  </div>
                  <h2 className="text-lg font-extrabold mt-3">{opt.label}</h2>
                  <p className="text-2xl font-extrabold text-sky-400 mt-2">
                    R$ {Number(opt.price_brl).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                  <p className="text-xs text-slate-400 mt-2">{opt.highlights}</p>
                </div>
                <button
                  disabled={saving}
                  onClick={() => handleSelect(opt.code)}
                  className="mt-6 w-full py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-extrabold uppercase tracking-wider disabled:opacity-50"
                >
                  {isSelected ? 'Opção Selecionada' : `Escolher Opção ${opt.code}`}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

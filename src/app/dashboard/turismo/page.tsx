'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Plane,
  Calculator,
  ShieldCheck,
  TrendingUp,
  Users,
  MessageSquare,
  ExternalLink,
  Plus,
  Send,
  Radar,
  Sparkles,
} from 'lucide-react';
import { turismoApi } from '@/lib/api';
import OrBrickChannelsQrCard from '@/components/OrBrickChannelsQrCard';

type TabKey = 'quotes' | 'miles' | 'dre' | 'groups' | 'omnichannel';

export default function TurismoDashboardPage() {
  const [tab, setTab] = useState<TabKey>('quotes');
  const [overview, setOverview] = useState<any>(null);
  const [quotes, setQuotes] = useState<any[]>([]);
  const [miles, setMiles] = useState<any[]>([]);
  const [dre, setDre] = useState<any>(null);
  const [groups, setGroups] = useState<any[]>([]);
  const [club, setClub] = useState<any[]>([]);
  const [channels, setChannels] = useState<any>(null);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  // Form states
  const [qForm, setQForm] = useState({
    client_name: '',
    origin: 'GRU',
    destination: 'MIA',
    departure_date: '2026-12-15',
    cash_price_brl: '4500',
    miles_required: '120000',
    mile_cost_per_k_brl: '17.5',
    tax_fees_brl: '350',
  });
  const [pnrText, setPnrText] = useState('');
  const [mForm, setMForm] = useState({
    program_name: 'SMILES',
    holder_name: '',
    holder_document: '',
    miles_balance: '250000',
    cpfs_used_year: '10',
  });
  const [gForm, setGForm] = useState({ group_name: '', destination: '', price_per_person_brl: '4900' });
  const [cForm, setCForm] = useState({ member_name: '', member_email: '', telegram_chat_id: '' });
  const [bcForm, setBcForm] = useState({ title: 'Alerta Milhas VIP', message: 'GRU-LIS por 55k milhas!' });
  const [omniTest, setOmniTest] = useState({
    channel: 'WHATSAPP' as 'WHATSAPP' | 'INSTAGRAM' | 'TELEGRAM',
    sender_ref: '5511999998888',
    message_text: 'Quero cotar passagem GRU para MIA em dezembro',
  });
  const [omniResult, setOmniResult] = useState<any>(null);

  const loadAll = async () => {
    try {
      const [ov, ql, ml, dr, gl, cl, ch] = await Promise.all([
        turismoApi.getOverview(),
        turismoApi.listQuotes(),
        turismoApi.listMiles(),
        turismoApi.getDre(),
        turismoApi.listGroups(),
        turismoApi.listClub(),
        turismoApi.getChannels(),
      ]);
      setOverview(ov);
      setQuotes(ql);
      setMiles(ml);
      setDre(dr);
      setGroups(gl);
      setClub(cl);
      setChannels(ch);
    } catch (e: any) {
      setStatusMsg(e?.message || 'Erro ao carregar painel Turismo.');
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  const handleCreateQuote = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await turismoApi.createQuote({
        client_name: qForm.client_name || 'Viajante Orbe',
        origin: qForm.origin,
        destination: qForm.destination,
        departure_date: qForm.departure_date,
        cash_price_brl: Number(qForm.cash_price_brl),
        miles_required: Number(qForm.miles_required),
        mile_cost_per_k_brl: Number(qForm.mile_cost_per_k_brl),
        tax_fees_brl: Number(qForm.tax_fees_brl),
        is_public_offer: true,
      });
      setStatusMsg(`Proposta Viva criada (${res.proposal_slug}) · Recomendado: ${res.recommended_mode}`);
      await loadAll();
    } catch (err: any) {
      setStatusMsg(err?.message || 'Erro ao criar cotação.');
    }
  };

  const handleImportPnr = async () => {
    if (!pnrText.trim()) return;
    try {
      const res = await turismoApi.importPnr({ pnr_raw_text: pnrText });
      setStatusMsg(`PNR ${res.pnr_locator} importado (${res.origin}-${res.destination}).`);
      setPnrText('');
      await loadAll();
    } catch (err: any) {
      setStatusMsg(err?.message || 'Erro ao importar PNR.');
    }
  };

  const handleCreateMiles = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await turismoApi.createMiles({
        program_name: mForm.program_name,
        holder_name: mForm.holder_name || 'Titular Agência',
        holder_document: mForm.holder_document || '12345678901',
        miles_balance: Number(mForm.miles_balance),
        cpfs_used_year: Number(mForm.cpfs_used_year),
      });
      setStatusMsg('Conta de milhas cadastrada no cofre (zero senhas armazenadas).');
      await loadAll();
    } catch (err: any) {
      setStatusMsg(err?.message || 'Erro ao cadastrar milhas.');
    }
  };

  const handleRunRadar = async () => {
    try {
      const res = await turismoApi.runBoardingRadar();
      setStatusMsg(`Radar de Embarque executado: ${res.dispatches?.length || 0} alertas disparados.`);
    } catch (err: any) {
      setStatusMsg(err?.message || 'Erro no radar.');
    }
  };

  return (
    <div className="flex-1 overflow-y-auto min-h-full bg-[#F8FAFC] p-6 lg:p-10">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-sky-800 text-[11px] font-extrabold uppercase">
              <Plane size={13} /> INHO Turismo · AI-First / Human-Last · Custo Zero
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 mt-2">
              Central Operacional de Turismo &amp; Milhas (Piloto NYDROBS)
            </h1>
            <p className="text-xs text-slate-600 mt-1">
              Cotador Híbrido Dinheiro vs Milhas, Proposta Viva A/B/C, Cofre de Milhas (zero senhas), DRE Intermediação e Omnichannel WhatsApp/Instagram/Telegram.
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <div className="text-[10px] font-bold uppercase text-slate-500">Cotações</div>
              <div className="text-lg font-extrabold text-slate-900">{overview?.quotes_count ?? 0}</div>
            </div>
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
              <div className="text-[10px] font-bold uppercase text-emerald-700">Economia Milhas</div>
              <div className="text-lg font-extrabold text-emerald-800">
                R$ {Number(overview?.total_miles_savings_brl ?? 0).toFixed(0)}
              </div>
            </div>
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200">
              <div className="text-[10px] font-bold uppercase text-amber-700">Alertas CPF</div>
              <div className="text-lg font-extrabold text-amber-800">{overview?.cpf_semaphore_red_alerts ?? 0}</div>
            </div>
            <div className="p-3 rounded-xl bg-sky-50 border border-sky-200">
              <div className="text-[10px] font-bold uppercase text-sky-700">AI-First</div>
              <div className="text-lg font-extrabold text-sky-900">{overview?.ai_first_handled ?? 0}</div>
            </div>
          </div>
        </div>

        {statusMsg && (
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-900 flex justify-between">
            <span>{statusMsg}</span>
            <button onClick={() => setStatusMsg(null)} className="underline">Fechar</button>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'quotes', label: 'Cotador & Proposta Viva', icon: Calculator },
            { id: 'miles', label: 'Cofre de Milhas & Semáforo CPF', icon: ShieldCheck },
            { id: 'dre', label: 'DRE Agência & Radar Embarque', icon: TrendingUp },
            { id: 'groups', label: 'Grupos & NYDROBS Club', icon: Users },
            { id: 'omnichannel', label: 'Omnichannel AI-First (WA/IG/TG)', icon: MessageSquare },
          ].map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id as TabKey)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wider border transition-all ${
                  tab === t.id
                    ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <Icon size={14} /> {t.label}
              </button>
            );
          })}
        </div>

        {tab === 'quotes' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <form onSubmit={handleCreateQuote} className="bg-white p-5 rounded-2xl border border-slate-200 space-y-3">
              <h2 className="text-sm font-extrabold text-slate-900 uppercase">Nova Cotação Híbrida (Cash vs Milhas)</h2>
              <input
                placeholder="Nome do Viajante"
                value={qForm.client_name}
                onChange={(e) => setQForm({ ...qForm, client_name: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  placeholder="Origem (GRU)"
                  value={qForm.origin}
                  onChange={(e) => setQForm({ ...qForm, origin: e.target.value })}
                  className="px-3 py-2 rounded-lg border border-slate-300 text-xs uppercase"
                />
                <input
                  placeholder="Destino (MIA)"
                  value={qForm.destination}
                  onChange={(e) => setQForm({ ...qForm, destination: e.target.value })}
                  className="px-3 py-2 rounded-lg border border-slate-300 text-xs uppercase"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  placeholder="Tarifa Pagante (R$)"
                  value={qForm.cash_price_brl}
                  onChange={(e) => setQForm({ ...qForm, cash_price_brl: e.target.value })}
                  className="px-3 py-2 rounded-lg border border-slate-300 text-xs"
                />
                <input
                  type="number"
                  placeholder="Milhas Exigidas"
                  value={qForm.miles_required}
                  onChange={(e) => setQForm({ ...qForm, miles_required: e.target.value })}
                  className="px-3 py-2 rounded-lg border border-slate-300 text-xs"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  step="0.1"
                  placeholder="Milheiro (R$)"
                  value={qForm.mile_cost_per_k_brl}
                  onChange={(e) => setQForm({ ...qForm, mile_cost_per_k_brl: e.target.value })}
                  className="px-3 py-2 rounded-lg border border-slate-300 text-xs"
                />
                <input
                  type="number"
                  placeholder="Taxas (R$)"
                  value={qForm.tax_fees_brl}
                  onChange={(e) => setQForm({ ...qForm, tax_fees_brl: e.target.value })}
                  className="px-3 py-2 rounded-lg border border-slate-300 text-xs"
                />
              </div>
              <button className="w-full py-2.5 rounded-xl bg-sky-700 hover:bg-sky-800 text-white text-xs font-extrabold uppercase">
                <Plus size={14} className="inline mr-1" /> Gerar Proposta Viva A/B/C
              </button>

              <div className="pt-3 border-t border-slate-200 space-y-2">
                <p className="text-[11px] font-bold uppercase text-slate-600">Smart Import PNR</p>
                <textarea
                  rows={2}
                  placeholder="Cole localizador / trecho ex: LOCATOR XYZ987 GRU-LIS PAX: MARIA"
                  value={pnrText}
                  onChange={(e) => setPnrText(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                />
                <button
                  type="button"
                  onClick={handleImportPnr}
                  className="w-full py-2 rounded-lg bg-slate-800 text-white text-xs font-bold uppercase"
                >
                  Importar PNR Automaticamente
                </button>
              </div>
            </form>

            <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-slate-200 space-y-3">
              <h2 className="text-sm font-extrabold text-slate-900 uppercase">Cotações &amp; Propostas Vivas</h2>
              {quotes.length === 0 ? (
                <p className="text-xs text-slate-500">Nenhuma cotação cadastrada ainda.</p>
              ) : (
                <div className="space-y-2.5">
                  {quotes.map((q) => (
                    <div key={q.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="text-sm font-extrabold text-slate-900">
                          {q.client_name} · {q.origin} → {q.destination}
                        </div>
                        <div className="text-xs text-slate-600 mt-0.5">
                          Pagante: R$ {Number(q.cash_price_brl).toFixed(2)} | Milhas: R$ {Number(q.total_miles_cost_brl).toFixed(2)} ·{' '}
                          <strong className="text-emerald-700">Recomendado: {q.recommended_mode}</strong> (Economia R$ {Number(q.savings_brl).toFixed(2)})
                        </div>
                      </div>
                      <Link
                        href={`/proposta/${q.proposal_slug}`}
                        target="_blank"
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white border border-slate-300 text-xs font-bold text-slate-800 hover:bg-slate-100"
                      >
                        Abrir Proposta Viva <ExternalLink size={12} />
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {tab === 'miles' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <form onSubmit={handleCreateMiles} className="bg-white p-5 rounded-2xl border border-slate-200 space-y-3">
              <h2 className="text-sm font-extrabold text-slate-900 uppercase">Cadastrar Conta no Cofre (Sem Senha)</h2>
              <select
                value={mForm.program_name}
                onChange={(e) => setMForm({ ...mForm, program_name: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-bold"
              >
                <option value="SMILES">SMILES</option>
                <option value="LATAM_PASS">LATAM PASS</option>
                <option value="AZUL">TUDO AZUL</option>
                <option value="LIVELO">LIVELO</option>
              </select>
              <input
                placeholder="Nome do Titular"
                value={mForm.holder_name}
                onChange={(e) => setMForm({ ...mForm, holder_name: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
              />
              <input
                placeholder="CPF (será mascarado com LGPD)"
                value={mForm.holder_document}
                onChange={(e) => setMForm({ ...mForm, holder_document: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  placeholder="Saldo Milhas"
                  value={mForm.miles_balance}
                  onChange={(e) => setMForm({ ...mForm, miles_balance: e.target.value })}
                  className="px-3 py-2 rounded-lg border border-slate-300 text-xs"
                />
                <input
                  type="number"
                  placeholder="CPFs usados ano"
                  value={mForm.cpfs_used_year}
                  onChange={(e) => setMForm({ ...mForm, cpfs_used_year: e.target.value })}
                  className="px-3 py-2 rounded-lg border border-slate-300 text-xs"
                />
              </div>
              <button className="w-full py-2.5 rounded-xl bg-emerald-700 text-white text-xs font-extrabold uppercase">
                Salvar no Cofre de Milhas
              </button>
            </form>
            <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-slate-200 space-y-3">
              <h2 className="text-sm font-extrabold text-slate-900 uppercase">Semáforo de CPF (Limite Anual)</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {miles.map((m) => (
                  <div key={m.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-extrabold text-slate-900">
                        {m.program_name} · {m.holder_name} ({m.holder_document_masked})
                      </div>
                      <div className="text-xs text-slate-600 mt-1">
                        Saldo: <strong>{Number(m.miles_balance).toLocaleString('pt-BR')}</strong> milhas · CPFs: {m.cpfs_used_year}/{m.cpfs_limit_year}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold ${
                          m.semaphore_status === 'RED'
                            ? 'bg-red-100 text-red-700'
                            : m.semaphore_status === 'YELLOW'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-emerald-700'
                        }`}
                      >
                        {m.semaphore_status}
                      </span>
                      <button
                        onClick={async () => {
                          await turismoApi.useMilesCpf(m.id);
                          await loadAll();
                        }}
                        className="px-2.5 py-1 rounded-lg bg-slate-900 text-white text-[10px] font-bold"
                      >
                        +1 CPF
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === 'dre' && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-extrabold text-slate-900 uppercase">
                  DRE da Agência (Intermediação vs Repasse Fornecedor &amp; ISS)
                </h2>
                <p className="text-xs text-slate-500">
                  Separa contabilmente o valor repassado à cia aérea/hotel da receita líquida real de intermediação.
                </p>
              </div>
              <button
                onClick={handleRunRadar}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-sky-700 text-white text-xs font-extrabold uppercase"
              >
                <Radar size={14} /> Executar Radar Embarque (D-7/D-2/D0/D+2)
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div className="text-[10px] font-bold uppercase text-slate-500">Venda Bruta</div>
                <div className="text-lg font-extrabold text-slate-900">R$ {Number(dre?.gross_sales_brl ?? 0).toFixed(2)}</div>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div className="text-[10px] font-bold uppercase text-slate-500">Repasse Fornecedor</div>
                <div className="text-lg font-extrabold text-slate-700">R$ {Number(dre?.supplier_payout_brl ?? 0).toFixed(2)}</div>
              </div>
              <div className="p-4 rounded-xl bg-sky-50 border border-sky-200">
                <div className="text-[10px] font-bold uppercase text-sky-700">Receita Intermediação</div>
                <div className="text-lg font-extrabold text-sky-900">R$ {Number(dre?.intermediation_revenue_brl ?? 0).toFixed(2)}</div>
              </div>
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200">
                <div className="text-[10px] font-bold uppercase text-amber-700">ISS s/ Fee</div>
                <div className="text-lg font-extrabold text-amber-900">R$ {Number(dre?.iss_tax_total_brl ?? 0).toFixed(2)}</div>
              </div>
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200">
                <div className="text-[10px] font-bold uppercase text-emerald-700">Lucro Líquido Agência</div>
                <div className="text-lg font-extrabold text-emerald-900">R$ {Number(dre?.net_profit_brl ?? 0).toFixed(2)}</div>
              </div>
            </div>
          </div>
        )}

        {tab === 'groups' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-3">
              <h2 className="text-sm font-extrabold text-slate-900 uppercase">Grupos &amp; Rooming List</h2>
              <div className="flex gap-2">
                <input
                  placeholder="Nome do Grupo (ex: Caravana Orlando)"
                  value={gForm.group_name}
                  onChange={(e) => setGForm({ ...gForm, group_name: e.target.value })}
                  className="flex-1 px-3 py-2 rounded-lg border border-slate-300 text-xs"
                />
                <input
                  placeholder="Destino"
                  value={gForm.destination}
                  onChange={(e) => setGForm({ ...gForm, destination: e.target.value })}
                  className="w-28 px-3 py-2 rounded-lg border border-slate-300 text-xs"
                />
                <button
                  onClick={async () => {
                    await turismoApi.createGroup({
                      group_name: gForm.group_name || 'Grupo Orbe',
                      destination: gForm.destination || 'MCO',
                      price_per_person_brl: Number(gForm.price_per_person_brl),
                    });
                    await loadAll();
                  }}
                  className="px-3 py-2 rounded-lg bg-slate-900 text-white text-xs font-bold"
                >
                  Criar
                </button>
              </div>
              {groups.map((g) => (
                <div key={g.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                  <strong>{g.group_name}</strong> · {g.destination} · R$ {Number(g.price_per_person_brl).toFixed(2)}/pessoa
                </div>
              ))}
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-3">
              <h2 className="text-sm font-extrabold text-slate-900 uppercase">NYDROBS Club (VIP 50% OFF + Telegram)</h2>
              <div className="grid grid-cols-3 gap-2">
                <input
                  placeholder="Nome VIP"
                  value={cForm.member_name}
                  onChange={(e) => setCForm({ ...cForm, member_name: e.target.value })}
                  className="px-3 py-2 rounded-lg border border-slate-300 text-xs"
                />
                <input
                  placeholder="E-mail"
                  value={cForm.member_email}
                  onChange={(e) => setCForm({ ...cForm, member_email: e.target.value })}
                  className="px-3 py-2 rounded-lg border border-slate-300 text-xs"
                />
                <input
                  placeholder="Telegram Chat ID"
                  value={cForm.telegram_chat_id}
                  onChange={(e) => setCForm({ ...cForm, telegram_chat_id: e.target.value })}
                  className="px-3 py-2 rounded-lg border border-slate-300 text-xs"
                />
              </div>
              <button
                onClick={async () => {
                  await turismoApi.createClubMember(cForm);
                  await loadAll();
                }}
                className="w-full py-2 rounded-lg bg-amber-600 text-white text-xs font-extrabold uppercase"
              >
                Adicionar Membro NYDROBS Club ({club.length} ativos)
              </button>
              <div className="pt-3 border-t border-slate-200 flex gap-2">
                <input
                  placeholder="Mensagem Broadcast Telegram VIP"
                  value={bcForm.message}
                  onChange={(e) => setBcForm({ ...bcForm, message: e.target.value })}
                  className="flex-1 px-3 py-2 rounded-lg border border-slate-300 text-xs"
                />
                <button
                  onClick={async () => {
                    const r = await turismoApi.broadcastClub(bcForm);
                    setStatusMsg(`Broadcast VIP enviado para ${r.telegram_dispatches} membros Telegram.`);
                  }}
                  className="px-4 py-2 rounded-lg bg-sky-700 text-white text-xs font-bold"
                >
                  <Send size={12} className="inline mr-1" /> Disparar
                </button>
              </div>
            </div>
          </div>
        )}

        {tab === 'omnichannel' && (
          <div className="space-y-6">
            <OrBrickChannelsQrCard />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-3">
              <h2 className="text-sm font-extrabold text-slate-900 uppercase">Canais Custo Zero Conectados</h2>
              <div className="space-y-2 text-xs">
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex justify-between">
                  <span><strong>WhatsApp</strong> (Baileys Container orbe_whatsapp:3001)</span>
                  <span className="font-extrabold text-emerald-700">{channels?.whatsapp_enabled ? 'ATIVO' : 'OFF'}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex justify-between">
                  <span><strong>Instagram</strong> (Meta Messaging API Oficial · R$ 0/msg)</span>
                  <span className="font-bold">{channels?.instagram_enabled ? 'ATIVO' : 'CONFIGURÁVEL'}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex justify-between">
                  <span><strong>Telegram</strong> (Bot API Oficial · R$ 0/msg)</span>
                  <span className="font-bold">{channels?.telegram_enabled ? 'ATIVO' : 'CONFIGURÁVEL'}</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-3">
              <h2 className="text-sm font-extrabold text-slate-900 uppercase flex items-center gap-2">
                <Sparkles size={14} className="text-sky-600" /> Simulador AI-First / Human-Last
              </h2>
              <select
                value={omniTest.channel}
                onChange={(e) => setOmniTest({ ...omniTest, channel: e.target.value as any })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-bold"
              >
                <option value="WHATSAPP">WhatsApp (Baileys)</option>
                <option value="INSTAGRAM">Instagram (Meta Official API)</option>
                <option value="TELEGRAM">Telegram (Bot API)</option>
              </select>
              <input
                value={omniTest.message_text}
                onChange={(e) => setOmniTest({ ...omniTest, message_text: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
              />
              <button
                onClick={async () => {
                  const res = await turismoApi.testOmnichannelInbound(omniTest);
                  setOmniResult(res);
                  await loadAll();
                }}
                className="w-full py-2.5 rounded-xl bg-slate-900 text-white text-xs font-extrabold uppercase"
              >
                Simular Mensagem Omnichannel
              </button>
              {omniResult && (
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                  <div>
                    <strong>Modo:</strong> {omniResult.handled_by}{' '}
                    {omniResult.escalation_trigger && <span className="text-red-600">({omniResult.escalation_trigger})</span>}
                  </div>
                  <div className="text-slate-700 whitespace-pre-line">{omniResult.reply_text}</div>
                </div>
              )}
            </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

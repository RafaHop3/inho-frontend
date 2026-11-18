/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useCallback, useEffect, useState } from 'react';
import {
  AlertOctagon,
  Award,
  Briefcase,
  CheckCircle2,
  FileText,
  KeyRound,
  Mail,
  MessageSquarePlus,
  Plus,
  RefreshCw,
  Send,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Trash2,
  Upload,
} from 'lucide-react';
import { orbejobsApi, OrbeJobsApplication, OrbeJobsLivingCV } from '@/lib/api';

const KANBAN_COLUMNS = [
  { key: 'DISCOVERED', label: 'Descobertas (ATS)', badge: 'bg-slate-100 text-slate-700 border-slate-300' },
  { key: 'TAILORED', label: 'Adaptadas (IMORTAL)', badge: 'bg-amber-50 text-amber-800 border-amber-300' },
  { key: 'READY_TO_SEND', label: 'Fila / Aprovação', badge: 'bg-blue-50 text-blue-800 border-blue-300' },
  { key: 'SENT', label: 'Enviadas (Gmail)', badge: 'bg-emerald-50 text-emerald-800 border-emerald-300' },
  { key: 'INTERVIEW', label: 'Entrevistas', badge: 'bg-purple-50 text-purple-800 border-purple-300' },
];

export default function OrbeJobsPage() {
  const [activeTab, setActiveTab] = useState<'kanban' | 'living_cv' | 'lgpd'>('kanban');
  const [loading, setLoading] = useState(true);
  const [banner, setBanner] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);

  const [profile, setProfile] = useState<OrbeJobsLivingCV | null>(null);
  const [dailyQuota, setDailyQuota] = useState({ sent_today: 0, daily_send_limit: 12, hard_cap: 15, remaining_today: 12 });
  const [oauthVault, setOauthVault] = useState<{ connected: boolean; account_email?: string; cipher_algorithm?: string }>({
    connected: false,
  });
  const [applications, setApplications] = useState<OrbeJobsApplication[]>([]);
  const [queueItems, setQueueItems] = useState<any[]>([]);
  const [lgpdAudit, setLgpdAudit] = useState<{ send_logs: any[]; audit_events: any[] }>({
    send_logs: [],
    audit_events: [],
  });

  // Scrape & New Job states
  const [greenhouseBoard, setGreenhouseBoard] = useState('');
  const [leverSlug, setLeverSlug] = useState('');
  const [rssFeed, setRssFeed] = useState('');
  const [newCompany, setNewCompany] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [newEmail, setNewEmail] = useState('');

  // Living CV XP / Course / WhatsApp / PDF states
  const [xpCompany, setXpCompany] = useState('');
  const [xpPosition, setXpPosition] = useState('');
  const [xpSummary, setXpSummary] = useState('');
  const [courseName, setCourseName] = useState('');
  const [courseIssuer, setCourseIssuer] = useState('');
  const [waCommand, setWaCommand] = useState('');
  const [selectedPdf, setSelectedPdf] = useState<File | null>(null);

  // Vault & DNS MX states
  const [gmailEmail, setGmailEmail] = useState('');
  const [gmailToken, setGmailToken] = useState('');
  const [mxTargetEmail, setMxTargetEmail] = useState('');
  const [mxCheckResult, setMxCheckResult] = useState<string | null>(null);

  const showNotice = (type: 'ok' | 'err', text: string) => {
    setBanner({ type, text });
    setTimeout(() => setBanner(null), 6000);
  };

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    try {
      const [dash, audit] = await Promise.all([
        orbejobsApi.getDashboard(),
        orbejobsApi.getLgpdAudit().catch(() => ({ send_logs: [], audit_events: [] })),
      ]);
      setProfile(dash.profile);
      setDailyQuota(dash.daily_quota);
      setOauthVault(dash.oauth_vault);
      setApplications(dash.applications || []);
      setQueueItems(dash.queue || []);
      setLgpdAudit(audit);
    } catch (err: any) {
      showNotice('err', err?.message || 'Erro ao carregar painel OrbeJobs.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const handleToggleHumanInLoop = async () => {
    if (!profile) return;
    try {
      const updated = await orbejobsApi.updateLivingCv({
        human_in_the_loop: !profile.human_in_the_loop,
      });
      setProfile(updated);
      showNotice(
        'ok',
        updated.human_in_the_loop
          ? 'Modo Human-in-the-Loop ATIVADO: envios exigem aprovação manual.'
          : 'Modo Autônomo ATIVADO dentro do teto diário.'
      );
    } catch (err: any) {
      showNotice('err', err?.message || 'Falha ao atualizar Human-in-the-Loop.');
    }
  };

  const handleUpdateDailyLimit = async (newLimit: number) => {
    try {
      const updated = await orbejobsApi.updateLivingCv({ daily_send_limit: newLimit });
      setProfile(updated);
      showNotice('ok', `Teto diário ajustado para ${updated.daily_send_limit} envios/dia.`);
      await loadDashboard();
    } catch (err: any) {
      showNotice('err', err?.message || 'Falha ao atualizar teto diário.');
    }
  };

  const handleKillSwitch = async () => {
    if (!profile) return;
    try {
      const nextState = !profile.kill_switch_active;
      const res = await orbejobsApi.toggleKillSwitch(nextState, 'Acionado pelo painel Executivo OrbeJobs');
      setProfile({ ...profile, kill_switch_active: res.kill_switch_active });
      showNotice(
        res.kill_switch_active ? 'err' : 'ok',
        res.kill_switch_active
          ? 'KILL-SWITCH ATIVADO: Todos os disparos e enfileiramentos foram suspensos imediatamente.'
          : 'OrbeJobs reativado com segurança.'
      );
    } catch (err: any) {
      showNotice('err', err?.message || 'Erro ao acionar Kill-Switch.');
    }
  };

  const handleScrape = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await orbejobsApi.triggerScrape({
        greenhouse_boards: greenhouseBoard ? [greenhouseBoard.trim()] : [],
        lever_companies: leverSlug ? [leverSlug.trim()] : [],
        rss_feeds: rssFeed ? [rssFeed.trim()] : [],
        manual_jobs:
          newCompany && newTitle && newUrl
            ? [{ company_name: newCompany, title: newTitle, job_url: newUrl, recipient_email: newEmail || undefined }]
            : [],
      });
      showNotice(
        'ok',
        `Varredura concluída: ${res.inserted_listings} vaga(s) novas, ${res.created_kanban_cards} card(s) no Kanban.`
      );
      setNewCompany('');
      setNewTitle('');
      setNewUrl('');
      setNewEmail('');
      await loadDashboard();
    } catch (err: any) {
      showNotice('err', err?.message || 'Falha na varredura ATS.');
    }
  };

  const handleTailorApp = async (appId: string) => {
    try {
      const res = await orbejobsApi.tailorApplication(appId);
      showNotice(
        'ok',
        `Currículo & carta adaptados via Motor IMORTAL Cascade (score pgvector: ${(res.pgvector_score * 100).toFixed(0)}%).`
      );
      await loadDashboard();
    } catch (err: any) {
      showNotice('err', err?.message || 'Falha ao adaptar candidatura.');
    }
  };

  const handleApproveAndQueue = async (app: OrbeJobsApplication) => {
    try {
      await orbejobsApi.updateApplicationStage(app.id, { approved_by_human: true });
      const res = await orbejobsApi.enqueueSend({
        application_id: app.id,
        recipient_email: app.recipient_email || undefined,
        auto_dispatch: !profile?.human_in_the_loop,
      });
      showNotice('ok', `Enfileirado com DNS MX validado e jitter de ${res.jitter_seconds}s (${res.status}).`);
      await loadDashboard();
    } catch (err: any) {
      showNotice('err', err?.message || 'Falha ao aprovar/enfileirar envio.');
    }
  };

  const handleMoveStage = async (appId: string, stage: string) => {
    try {
      await orbejobsApi.updateApplicationStage(appId, { stage });
      await loadDashboard();
    } catch (err: any) {
      showNotice('err', err?.message || 'Erro ao mover card.');
    }
  };

  const handleDispatchQueue = async (queueId: string) => {
    try {
      const res = await orbejobsApi.dispatchQueueItem(queueId);
      showNotice('ok', `Disparo processado: ${res.status} (${res.gmail_message_id || res.detail || 'ok'})`);
      await loadDashboard();
    } catch (err: any) {
      showNotice('err', err?.message || 'Erro ao despachar item.');
    }
  };

  const handleAddXpOrCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    const resume = { ...profile.json_resume };
    if (xpCompany && xpPosition) {
      resume.work = [
        {
          name: xpCompany.trim(),
          position: xpPosition.trim(),
          startDate: new Date().toISOString().slice(0, 10),
          summary: xpSummary.trim(),
        },
        ...(resume.work || []),
      ];
    }
    if (courseName) {
      resume.certificates = [
        {
          name: courseName.trim(),
          issuer: courseIssuer.trim() || 'Formação Executiva',
          date: new Date().toISOString().slice(0, 10),
        },
        ...(resume.certificates || []),
      ];
    }
    try {
      const updated = await orbejobsApi.updateLivingCv({ json_resume: resume });
      setProfile(updated);
      setXpCompany('');
      setXpPosition('');
      setXpSummary('');
      setCourseName('');
      setCourseIssuer('');
      showNotice('ok', 'Living CV JSON Resume atualizado e vetor pgvector recalculado.');
    } catch (err: any) {
      showNotice('err', err?.message || 'Erro ao atualizar Living CV.');
    }
  };

  const handleWhatsappCommand = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!waCommand.trim()) return;
    try {
      const res = await orbejobsApi.whatsappUpdate({ message: waCommand });
      setProfile(res.profile);
      setWaCommand('');
      showNotice('ok', `WhatsApp Living CV: ${res.actions.join(' | ')}`);
    } catch (err: any) {
      showNotice('err', err?.message || 'Erro ao processar comando WhatsApp.');
    }
  };

  const handleUploadPdf = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPdf) return;
    try {
      const res = await orbejobsApi.uploadPdf(selectedPdf);
      setProfile(res.profile);
      setSelectedPdf(null);
      showNotice('ok', `PDF processado (${res.extracted_chars} chars, SHA-256 ${res.pdf_sha256.slice(0, 12)}...).`);
    } catch (err: any) {
      showNotice('err', err?.message || 'Erro no upload de PDF.');
    }
  };

  const handleSaveVault = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await orbejobsApi.saveGmailVault({
        account_email: gmailEmail,
        access_token: gmailToken,
      });
      setGmailToken('');
      showNotice('ok', `Cofre OAuth2 (${res.cipher_algorithm}) conectado para ${res.account_email}.`);
      await loadDashboard();
    } catch (err: any) {
      showNotice('err', err?.message || 'Erro ao salvar cofre OAuth2.');
    }
  };

  const handleCheckMx = async () => {
    if (!mxTargetEmail) return;
    try {
      const res = await orbejobsApi.checkDnsMx(mxTargetEmail);
      setMxCheckResult(
        res.mx_valid
          ? `MX VÁLIDO: ${res.mx_hosts.join(', ')}`
          : `MX INVÁLIDO (Anti-Bounce bloqueia): ${res.error}`
      );
    } catch (err: any) {
      setMxCheckResult(err?.message || 'Erro na verificação DNS MX.');
    }
  };

  const handleLgpdPurge = async () => {
    try {
      await orbejobsApi.purgeLgpdData();
      showNotice('ok', 'Direito ao Esquecimento LGPD (Art. 18) executado com sucesso.');
      await loadDashboard();
    } catch (err: any) {
      showNotice('err', err?.message || 'Falha ao executar anonimização LGPD.');
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header Executivo */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-[#B8860B] font-extrabold text-xs uppercase tracking-widest">
            <Briefcase size={15} />
            <span>OrbeJobs • Motor IMORTAL Cascade (Zero-Key)</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 mt-1">
            Esteira de Candidaturas, Living CV & Blindagem LGPD
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Varredura híbrida ATS (Greenhouse/Lever/RSS), pré-filtro vetorial pgvector, cofre Gmail OAuth2 MultiFernet AES-256 e validação DNS MX.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            data-testid="orbejobs-hil-toggle"
            onClick={handleToggleHumanInLoop}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold border flex items-center gap-1.5 transition-all ${
              profile?.human_in_the_loop
                ? 'bg-amber-50 text-amber-900 border-amber-300'
                : 'bg-slate-100 text-slate-700 border-slate-300'
            }`}
          >
            <ShieldCheck size={14} />
            Human-in-the-Loop: {profile?.human_in_the_loop ? 'ATIVO' : 'OPCIONAL (AUTO)'}
          </button>

          <button
            data-testid="orbejobs-killswitch-btn"
            onClick={handleKillSwitch}
            className={`px-3.5 py-2 rounded-xl text-xs font-extrabold border flex items-center gap-1.5 transition-all ${
              profile?.kill_switch_active
                ? 'bg-red-600 text-white border-red-700 shadow-sm'
                : 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100'
            }`}
          >
            <AlertOctagon size={14} />
            {profile?.kill_switch_active ? 'KILL-SWITCH ATIVO (DESBLOQUEAR)' : 'KILL-SWITCH'}
          </button>

          <button
            onClick={loadDashboard}
            className="px-3 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold flex items-center gap-1.5 hover:bg-slate-800"
          >
            <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
            Atualizar
          </button>
        </div>
      </div>

      {banner && (
        <div
          data-testid="orbejobs-banner"
          className={`p-3.5 rounded-xl border text-xs font-semibold flex items-center gap-2 ${
            banner.type === 'ok'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
              : 'bg-red-50 border-red-200 text-red-900'
          }`}
        >
          {banner.type === 'ok' ? <CheckCircle2 size={15} /> : <ShieldAlert size={15} />}
          <span>{banner.text}</span>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
          <div className="text-[11px] font-bold uppercase text-slate-500">Teto Diário Anti-Spam</div>
          <div className="text-2xl font-extrabold text-slate-900 mt-1" data-testid="orbejobs-daily-quota">
            {dailyQuota.sent_today} / {dailyQuota.daily_send_limit}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Máximo rígido: {dailyQuota.hard_cap} envios/dia + jitter</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
          <div className="text-[11px] font-bold uppercase text-slate-500">Cofre Gmail OAuth2</div>
          <div className="text-sm font-extrabold text-slate-900 mt-1.5 flex items-center gap-1.5">
            <KeyRound size={15} className="text-[#B8860B]" />
            {oauthVault.connected ? oauthVault.account_email : 'Não conectado (Modo Sandbox)'}
          </div>
          <div className="text-[11px] text-emerald-700 font-semibold mt-1">MultiFernet AES-256 + escopo gmail.send</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
          <div className="text-[11px] font-bold uppercase text-slate-500">Candidaturas no Kanban</div>
          <div className="text-2xl font-extrabold text-slate-900 mt-1">{applications.length}</div>
          <div className="text-[11px] text-slate-500 mt-1">Deduplicação SHA-256 (user_id + job_url_hash)</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
          <div className="text-[11px] font-bold uppercase text-slate-500">Living CV (XP & Cursos)</div>
          <div className="text-2xl font-extrabold text-slate-900 mt-1">
            {(profile?.json_resume?.work?.length || 0)} XP / {(profile?.json_resume?.certificates?.length || 0)} Cursos
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Pré-filtro vetorial pgvector ativo</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-2">
        {[
          { id: 'kanban', label: '1. Esteira Kanban & Varredura ATS', icon: Briefcase },
          { id: 'living_cv', label: '2. Living CV (XP, Cursos, PDF & WhatsApp)', icon: Award },
          { id: 'lgpd', label: '3. Gmail Vault, DNS MX & Auditoria LGPD', icon: ShieldCheck },
        ].map((tab) => (
          <button
            key={tab.id}
            data-testid={`tab-${tab.id}`}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 border transition-all ${
              activeTab === tab.id
                ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <tab.icon size={14} />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* TAB 1: KANBAN */}
      {activeTab === 'kanban' && (
        <div className="space-y-6">
          {/* Formulário rápido de Varredura ATS / Inserção de Vaga */}
          <form onSubmit={handleScrape} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3">
            <div className="text-xs font-extrabold uppercase text-slate-700 flex items-center gap-2">
              <Plus size={14} className="text-[#B8860B]" />
              <span>Motor de Varredura Híbrido (Greenhouse / Lever / RSS) ou Vaga Direta</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <input
                value={greenhouseBoard}
                onChange={(e) => setGreenhouseBoard(e.target.value)}
                placeholder="Greenhouse board (ex: stripe)"
                className="px-3 py-2 border border-slate-200 rounded-xl text-xs"
              />
              <input
                value={leverSlug}
                onChange={(e) => setLeverSlug(e.target.value)}
                placeholder="Lever company slug"
                className="px-3 py-2 border border-slate-200 rounded-xl text-xs"
              />
              <input
                value={rssFeed}
                onChange={(e) => setRssFeed(e.target.value)}
                placeholder="URL feed RSS público"
                className="px-3 py-2 border border-slate-200 rounded-xl text-xs"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 pt-1">
              <input
                value={newCompany}
                onChange={(e) => setNewCompany(e.target.value)}
                placeholder="Empresa (vaga manual)"
                className="px-3 py-2 border border-slate-200 rounded-xl text-xs"
              />
              <input
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Cargo / Título"
                className="px-3 py-2 border border-slate-200 rounded-xl text-xs"
              />
              <input
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
                placeholder="URL oficial da vaga"
                className="px-3 py-2 border border-slate-200 rounded-xl text-xs"
              />
              <div className="flex gap-2">
                <input
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="E-mail RH (opcional)"
                  className="flex-1 px-3 py-2 border border-slate-200 rounded-xl text-xs"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#B8860B] text-white text-xs font-extrabold hover:bg-[#9A6F0B]"
                >
                  Coletar
                </button>
              </div>
            </div>
          </form>

          {/* Colunas Kanban */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4" data-testid="orbejobs-kanban-board">
            {KANBAN_COLUMNS.map((col) => {
              const colApps = applications.filter((a) => a.stage === col.key);
              return (
                <div
                  key={col.key}
                  data-testid={`kanban-col-${col.key}`}
                  className="bg-slate-50 border border-slate-200 rounded-2xl p-3 space-y-3 min-h-[280px]"
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-extrabold px-2 py-1 rounded-lg border uppercase ${col.badge}`}>
                      {col.label}
                    </span>
                    <span className="text-xs font-extrabold text-slate-600">{colApps.length}</span>
                  </div>

                  {colApps.map((app) => (
                    <div
                      key={app.id}
                      data-testid={`kanban-card-${app.id}`}
                      className="bg-white border border-slate-200 rounded-xl p-3 shadow-sm space-y-2"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="text-xs font-extrabold text-slate-900">{app.job_title}</div>
                          <div className="text-[11px] text-slate-500">{app.company_name}</div>
                        </div>
                        <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                          {Math.round((app.match_score || 0) * 100)}%
                        </span>
                      </div>

                      {app.tailored_cover_letter && (
                        <p className="text-[10px] text-slate-600 bg-slate-50 p-2 rounded-lg line-clamp-3">
                          {app.tailored_cover_letter}
                        </p>
                      )}

                      <div className="flex flex-wrap gap-1.5 pt-1">
                        <button
                          onClick={() => handleTailorApp(app.id)}
                          className="px-2 py-1 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-[10px] font-bold flex items-center gap-1"
                        >
                          <Sparkles size={11} /> Adaptar IA
                        </button>
                        {app.recipient_email && (
                          <button
                            onClick={() => handleApproveAndQueue(app)}
                            className="px-2 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 text-[10px] font-bold flex items-center gap-1"
                          >
                            <Send size={11} /> Aprovar & Fila
                          </button>
                        )}
                        {col.key !== 'INTERVIEW' && (
                          <button
                            onClick={() =>
                              handleMoveStage(
                                app.id,
                                col.key === 'DISCOVERED'
                                  ? 'TAILORED'
                                  : col.key === 'TAILORED'
                                  ? 'READY_TO_SEND'
                                  : col.key === 'READY_TO_SEND'
                                  ? 'SENT'
                                  : 'INTERVIEW'
                              )
                            }
                            className="px-2 py-1 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 text-[10px] font-bold"
                          >
                            Avançar →
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>

          {/* Fila de Envio Ativa */}
          {queueItems.length > 0 && (
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3">
              <h2 className="text-xs font-extrabold uppercase text-slate-700">
                Fila de Envio Gmail API (DNS MX + Jitter + Human-in-the-Loop)
              </h2>
              <div className="space-y-2">
                {queueItems.map((q) => (
                  <div key={q.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-xl border border-slate-200 bg-slate-50 text-xs">
                    <div>
                      <span className="font-bold text-slate-900">{q.subject}</span>
                      <div className="text-[11px] text-slate-500">
                        Para: {q.recipient_email} • Jitter: {q.jitter_seconds}s • Status: <strong>{q.status}</strong>
                      </div>
                    </div>
                    {q.status !== 'SENT' && (
                      <button
                        onClick={() => handleDispatchQueue(q.id)}
                        className="px-3 py-1.5 rounded-xl bg-slate-900 text-white text-[11px] font-bold flex items-center gap-1"
                      >
                        <Mail size={12} /> Despachar Agora
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: LIVING CV */}
      {activeTab === 'living_cv' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" data-testid="orbejobs-livingcv-panel">
          <form onSubmit={handleAddXpOrCourse} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
            <h2 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
              <Award size={16} className="text-[#B8860B]" />
              Atualização Estruturada de XP & Cursos (JSON Resume)
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                data-testid="input-xp-company"
                value={xpCompany}
                onChange={(e) => setXpCompany(e.target.value)}
                placeholder="Empresa / Projeto (XP)"
                className="px-3 py-2 border border-slate-200 rounded-xl text-xs"
              />
              <input
                data-testid="input-xp-position"
                value={xpPosition}
                onChange={(e) => setXpPosition(e.target.value)}
                placeholder="Cargo / Função"
                className="px-3 py-2 border border-slate-200 rounded-xl text-xs"
              />
            </div>
            <textarea
              data-testid="input-xp-summary"
              value={xpSummary}
              onChange={(e) => setXpSummary(e.target.value)}
              placeholder="Resumo das entregas e stack técnica..."
              rows={2}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-100">
              <input
                data-testid="input-course-name"
                value={courseName}
                onChange={(e) => setCourseName(e.target.value)}
                placeholder="Nome do Curso / Certificação"
                className="px-3 py-2 border border-slate-200 rounded-xl text-xs"
              />
              <input
                data-testid="input-course-issuer"
                value={courseIssuer}
                onChange={(e) => setCourseIssuer(e.target.value)}
                placeholder="Instituição Emissora"
                className="px-3 py-2 border border-slate-200 rounded-xl text-xs"
              />
            </div>
            <button
              type="submit"
              data-testid="btn-save-living-cv"
              className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-extrabold hover:bg-slate-800"
            >
              Salvar XP / Curso no Living CV
            </button>

            <div className="pt-3 border-t border-slate-100 space-y-2">
              <div className="text-xs font-extrabold text-slate-700">Histórico Atual no JSON Resume</div>
              {(profile?.json_resume?.work || []).map((w, idx) => (
                <div key={idx} className="text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5">
                  <strong>{w.position}</strong> — {w.name}
                </div>
              ))}
              {(profile?.json_resume?.certificates || []).map((c, idx) => (
                <div key={idx} className="text-xs bg-amber-50 border border-amber-200 rounded-xl p-2.5">
                  🎓 <strong>{c.name}</strong> ({c.issuer})
                </div>
              ))}
            </div>
          </form>

          <div className="space-y-6">
            <form onSubmit={handleWhatsappCommand} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3">
              <h2 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <MessageSquarePlus size={16} className="text-emerald-700" />
                Atualização Rápida via Comando WhatsApp (OrBrick)
              </h2>
              <p className="text-[11px] text-slate-500">
                Use <code>+XP Cargo na Empresa | Resumo</code>, <code>+Curso Nome @ Instituição</code> ou <code>+Skill Python, pgvector</code>.
              </p>
              <textarea
                value={waCommand}
                onChange={(e) => setWaCommand(e.target.value)}
                rows={3}
                placeholder="+XP Tech Lead na Orbe | FastAPI + Z3&#10;+Curso AppSec @ OWASP"
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
              />
              <button type="submit" className="px-4 py-2 rounded-xl bg-emerald-700 text-white text-xs font-extrabold">
                Aplicar Comando no Living CV
              </button>
            </form>

            <form onSubmit={handleUploadPdf} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3">
              <h2 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <FileText size={16} className="text-[#B8860B]" />
                Ingestão de Currículo em PDF
              </h2>
              <input
                type="file"
                accept="application/pdf,.pdf"
                onChange={(e) => setSelectedPdf(e.target.files?.[0] || null)}
                className="block w-full text-xs text-slate-600"
              />
              <button
                type="submit"
                disabled={!selectedPdf}
                className="px-4 py-2 rounded-xl bg-[#B8860B] text-white text-xs font-extrabold disabled:opacity-50 flex items-center gap-1.5"
              >
                <Upload size={13} /> Processar PDF e Atualizar Vetor
              </button>
            </form>
          </div>
        </div>
      )}

      {/* TAB 3: GMAIL VAULT, DNS MX & LGPD */}
      {activeTab === 'lgpd' && (
        <div className="space-y-6" data-testid="orbejobs-lgpd-panel">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <form onSubmit={handleSaveVault} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3">
              <h2 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <KeyRound size={16} className="text-[#B8860B]" />
                Cofre OAuth2 (gmail.send) • MultiFernet AES-256
              </h2>
              <input
                type="email"
                required
                value={gmailEmail}
                onChange={(e) => setGmailEmail(e.target.value)}
                placeholder="Seu e-mail Gmail remetente"
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
              />
              <input
                type="password"
                required
                value={gmailToken}
                onChange={(e) => setGmailToken(e.target.value)}
                placeholder="OAuth2 Access Token (armazenado cifrado AES-256)"
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
              />
              <div className="flex items-center justify-between pt-1">
                <label className="text-xs font-bold text-slate-600">
                  Teto Diário (10–15 envios):
                  <input
                    type="number"
                    min={1}
                    max={15}
                    defaultValue={profile?.daily_send_limit || 12}
                    onBlur={(e) => handleUpdateDailyLimit(Number(e.target.value))}
                    className="ml-2 w-16 px-2 py-1 border border-slate-200 rounded-lg text-xs"
                  />
                </label>
                <button type="submit" className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-extrabold">
                  Gravar no Cofre AES-256
                </button>
              </div>
            </form>

            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3">
              <h2 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <ShieldCheck size={16} className="text-emerald-700" />
                Validador Pré-Envio DNS MX (Anti-Bounce)
              </h2>
              <div className="flex gap-2">
                <input
                  value={mxTargetEmail}
                  onChange={(e) => setMxTargetEmail(e.target.value)}
                  placeholder="recrutamento@empresa.com.br"
                  className="flex-1 px-3 py-2 border border-slate-200 rounded-xl text-xs"
                />
                <button
                  type="button"
                  onClick={handleCheckMx}
                  className="px-4 py-2 rounded-xl bg-emerald-700 text-white text-xs font-extrabold"
                >
                  Testar MX
                </button>
              </div>
              {mxCheckResult && (
                <div className="text-xs p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 font-semibold">
                  {mxCheckResult}
                </div>
              )}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-500">LGPD Art. 18 — Direito ao Esquecimento</span>
                <button
                  type="button"
                  onClick={handleLgpdPurge}
                  className="px-3 py-1.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold flex items-center gap-1"
                >
                  <Trash2 size={13} /> Anonimizar Dados Pessoais
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3">
            <h2 className="text-sm font-extrabold text-slate-900">Trilha de Auditoria Imutável LGPD</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 uppercase text-[10px]">
                    <th className="py-2 pr-3">Entidade / Canal</th>
                    <th className="py-2 pr-3">Status / Ação</th>
                    <th className="py-2 pr-3">Detalhe / Hash LGPD</th>
                    <th className="py-2">Data</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {(lgpdAudit.send_logs || []).map((lg) => (
                    <tr key={lg.id}>
                      <td className="py-2 pr-3 font-bold">GMAIL ({lg.recipient_email})</td>
                      <td className="py-2 pr-3">{lg.status}</td>
                      <td className="py-2 pr-3 font-mono text-[10px]">{lg.lgpd_audit_hash}</td>
                      <td className="py-2 text-slate-500">{lg.created_at}</td>
                    </tr>
                  ))}
                  {(lgpdAudit.audit_events || []).map((ev) => (
                    <tr key={ev.id}>
                      <td className="py-2 pr-3 font-bold">{ev.entity}</td>
                      <td className="py-2 pr-3">{ev.action}</td>
                      <td className="py-2 pr-3 text-slate-600">{ev.detail}</td>
                      <td className="py-2 text-slate-500">{ev.timestamp}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

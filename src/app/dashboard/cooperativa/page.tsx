'use client';

import { useState, useEffect, ReactNode } from 'react';
import { Users, DollarSign, BarChart3, Search, UserPlus, CreditCard, Receipt, FileText, Filter, Loader2, X } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';
import OrbeLogo from '@/components/OrbeLogo';
import { crmApi, CRMContactOut, AccountPayableOut, billingApi } from '@/lib/api';

type TabView = 'CONTACTS' | 'FINANCE' | 'DASHBOARD';
type ContactCat = 'COOPERADO' | 'EMPLOYEE' | 'SUPPLIER' | 'CUSTOMER';

export default function CooperativaInho() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<TabView>('CONTACTS');
  const [contactCat, setContactCat] = useState<ContactCat>('COOPERADO');

  const [contacts, setContacts] = useState<CRMContactOut[]>([]);
  const [payables, setPayables] = useState<AccountPayableOut[]>([]);
  const [loading, setLoading] = useState(false);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newContact, setNewContact] = useState({ name: '', document: '', email: '', phone: '', bank_details: '' });

  // Invoice Modal State
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [newInvoice, setNewInvoice] = useState({ customer_name: '', customer_doc: '', amount: '', due_date: '', description: '' });

  const [submitting, setSubmitting] = useState(false);

  async function loadData() {
    setLoading(true);
    try {
      if (activeTab === 'CONTACTS') {
        const data = await crmApi.getContacts(contactCat);
        setContacts(data);
      } else if (activeTab === 'FINANCE') {
        const p = await crmApi.getPayables();
        setPayables(p);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, [activeTab, contactCat]);

  async function handleCreateContact(e: React.FormEvent) {
    e.preventDefault();
    if (!newContact.name) return;
    setSubmitting(true);
    try {
      if (contactCat === 'COOPERADO') {
        if (!newContact.document) { alert('Informe o CPF/CNPJ do cooperado.'); setSubmitting(false); return; }
        await crmApi.createCooperado(newContact);
      } else {
        await crmApi.createContact({ ...newContact, category: contactCat } as any);
      }
      setIsModalOpen(false);
      setNewContact({ name: '', document: '', email: '', phone: '', bank_details: '' });
      loadData();
    } catch (err) {
      alert(err);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleCreateInvoice(e: React.FormEvent) {
    e.preventDefault();
    if (!newInvoice.customer_name || !newInvoice.amount) return;
    setSubmitting(true);
    try {
      await billingApi.create({
        customer_name: newInvoice.customer_name,
        customer_doc: newInvoice.customer_doc,
        amount: Number(newInvoice.amount),
        due_date: new Date(newInvoice.due_date).toISOString(),
        description: newInvoice.description,
        payment_method: 'PIX'
      });
      setIsInvoiceModalOpen(false);
      setNewInvoice({ customer_name: '', customer_doc: '', amount: '', due_date: '', description: '' });
      loadData();
      alert("Fatura emitida e registrada com sucesso!");
    } catch (err) {
      alert(err);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex-1 overflow-y-auto bg-terminal-bg min-h-full font-mono text-terminal-text">
      {/* HEADER SECTION */}
      <div className="sticky top-0 z-10 glassmorphism border-b border-terminal-border px-8 py-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black uppercase tracking-widest text-terminal-bright flex items-center gap-3">
            <OrbeLogo className="w-8 h-8" variant="header" />
            Orbe Inho CRM <span className="text-neon-cyan">Cooperativa</span>
          </h1>
          <p className="text-xs text-terminal-muted mt-1 uppercase tracking-widest">
            Gestão Integrada de Sócios e Finanças
          </p>
        </div>

        {/* TABS NAVIGATION */}
        <div className="flex gap-2 p-1 bg-terminal-surface border border-terminal-border rounded-xl">
          {[
            { id: 'CONTACTS', label: 'Contatos', icon: Users },
            { id: 'FINANCE', label: 'Financeiro', icon: DollarSign },
            { id: 'DASHBOARD', label: 'Painel', icon: BarChart3 }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabView)}
              className={`flex items-center gap-2 px-6 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${activeTab === tab.id
                ? 'bg-neon-cyan/10 text-neon-cyan shadow-[0_0_15px_rgba(0,255,245,0.2)]'
                : 'text-terminal-muted hover:text-terminal-bright hover:bg-white/5'
                }`}
            >
              <tab.icon size={16} /> {tab.label}
            </button>
          ))}
        </div>
      </div>

      <main className="max-w-[1600px] mx-auto p-8 animate-fade-in">

        {/* ─── CONTACTS VIEW ──────────────────────────────────────────────────────── */}
        {activeTab === 'CONTACTS' && (
          <div className="space-y-6 animate-slide-up">

            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                {[
                  { id: 'COOPERADO', label: 'Sócios / Cooperados', color: 'neon-cyan' },
                  { id: 'EMPLOYEE', label: 'Funcionários', color: 'neon-green' },
                  { id: 'SUPPLIER', label: 'Fornecedores', color: 'neon-purple' },
                  { id: 'CUSTOMER', label: 'Clientes', color: 'neon-blue' }
                ].map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setContactCat(cat.id as ContactCat)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold uppercase transition-all ${contactCat === cat.id
                      ? `bg-${cat.color}/10 text-${cat.color} border border-${cat.color}/30 shadow-[0_0_10px_var(--${cat.color})]`
                      : 'bg-terminal-surface text-terminal-muted border border-terminal-border hover:border-terminal-muted'
                      }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              <div className="flex gap-3">
                <div className="relative">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-terminal-muted" />
                  <input
                    type="text"
                    placeholder="Buscar contato..."
                    className="bg-terminal-surface border border-terminal-border rounded-xl pl-10 pr-4 py-2 text-xs focus:outline-none focus:border-neon-cyan/50 text-terminal-bright transition-all"
                  />
                </div>
                <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-neon-cyan text-terminal-bg font-black text-xs uppercase tracking-wider rounded-xl hover:shadow-[0_0_20px_rgba(0,255,245,0.4)] transition-all">
                  <UserPlus size={16} /> Novo Cadastro
                </button>
              </div>
            </div>

            {/* Contacts Table Mockup */}
            <div className="bg-terminal-surface border border-terminal-border rounded-2xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-white/5 border-b border-terminal-border text-terminal-muted uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-4">Nome Registrado</th>
                    <th className="px-6 py-4">Documento</th>
                    <th className="px-6 py-4">Contato</th>
                    <th className="px-6 py-4">Dados Bancários</th>
                    <th className="px-6 py-4 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-terminal-border text-terminal-bright">
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-terminal-muted"><Loader2 className="animate-spin mx-auto mb-2" /> Carregando...</td>
                    </tr>
                  ) : contacts.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-terminal-muted">Nenhum registro encontrado nesta categoria.</td>
                    </tr>
                  ) : (
                    contacts.map(c => (
                      <tr key={c.id} className="hover:bg-white/5 transition-colors cursor-pointer">
                        <td className="px-6 py-4 font-bold flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-neon-cyan/10 flex items-center justify-center text-neon-cyan">
                            {c.name.substring(0, 2).toUpperCase()}
                          </div>
                          {c.name}
                        </td>
                        <td className="px-6 py-4 font-mono text-terminal-muted">{c.document || '---'}</td>
                        <td className="px-6 py-4">{c.email || '---'} <br /><span className="text-terminal-muted">{c.phone}</span></td>
                        <td className="px-6 py-4 text-neon-green">{c.bank_details || '---'}</td>
                        <td className="px-6 py-4 text-right">
                          <button className="px-3 py-1 bg-white/5 border border-terminal-border hover:border-neon-cyan rounded text-neon-cyan transition-colors">Abrir Dossiê</button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ─── FINANCE VIEW ──────────────────────────────────────────────────────── */}
        {activeTab === 'FINANCE' && (
          <div className="space-y-6 animate-slide-up">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-terminal-surface border border-terminal-border rounded-2xl p-6 relative overflow-hidden group">
                <div className="flex items-center gap-3 mb-4 text-neon-green">
                  <div className="p-2 bg-neon-green/10 rounded-lg"><DollarSign size={20} /></div>
                  <span className="font-bold tracking-widest uppercase text-xs">Contas a Receber</span>
                </div>
                <h2 className="text-3xl font-black text-terminal-bright">R$ 152.000,00</h2>
                <p className="text-terminal-muted text-xs mt-2 uppercase">Agendamentos futuros e pix gerados</p>
              </div>

              <div className="bg-terminal-surface border border-terminal-border rounded-2xl p-6 relative overflow-hidden group">
                <div className="flex items-center gap-3 mb-4 text-neon-purple">
                  <div className="p-2 bg-neon-purple/10 rounded-lg"><CreditCard size={20} /></div>
                  <span className="font-bold tracking-widest uppercase text-xs">Contas a Pagar</span>
                </div>
                <h2 className="text-3xl font-black text-terminal-bright">R$ 24.500,00</h2>
                <p className="text-terminal-muted text-xs mt-2 uppercase">Obrigações com Fornecedores</p>
              </div>

              <div className="bg-terminal-surface border border-terminal-border rounded-2xl p-6 relative overflow-hidden group flex flex-col justify-center gap-3">
                <button onClick={() => setIsInvoiceModalOpen(true)} className="flex items-center justify-center gap-2 w-full py-3 bg-neon-cyan/10 border border-neon-cyan/30 text-neon-cyan rounded-xl hover:bg-neon-cyan/20 transition-all font-bold uppercase tracking-wider text-xs">
                  <Receipt size={16} /> Emitir Nova Fatura
                </button>
                <button className="flex items-center justify-center gap-2 w-full py-3 bg-neon-purple/10 border border-neon-purple/30 text-neon-purple rounded-xl hover:bg-neon-purple/20 transition-all font-bold uppercase tracking-wider text-xs">
                  <CreditCard size={16} /> Lançar Despesa
                </button>
              </div>
            </div>

            <div className="bg-terminal-surface border border-terminal-border rounded-2xl overflow-hidden mt-6">
              <div className="p-4 border-b border-terminal-border flex justify-between items-center bg-white/5">
                <h3 className="font-bold tracking-widest uppercase text-xs text-terminal-bright">Fila Financeira (Agenda)</h3>
                <button className="flex items-center gap-2 text-xs text-terminal-muted hover:text-neon-cyan transition-colors">
                  <Filter size={14} /> Filtro
                </button>
              </div>
              <table className="w-full text-left text-xs">
                <thead className="bg-[#0a0d14] border-b border-terminal-border text-terminal-muted uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-4">Documento/Nota</th>
                    <th className="px-6 py-4">Relacionamento (Cooperado/Fornecedor)</th>
                    <th className="px-6 py-4">Vencimento</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Valor</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-terminal-border text-terminal-bright">
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-terminal-muted"><Loader2 className="animate-spin mx-auto mb-2" /> Carregando...</td>
                    </tr>
                  ) : payables.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-terminal-muted">Nenhuma obrigação financeira registrada.</td>
                    </tr>
                  ) : (
                    payables.map(p => (
                      <tr key={p.id} className="hover:bg-white/5 transition-colors cursor-pointer">
                        <td className="px-6 py-4 font-mono">{p.id.split('-')[0].toUpperCase()}</td>
                        <td className="px-6 py-4 flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-neon-purple"></div>
                          {p.supplier_name}
                        </td>
                        <td className="px-6 py-4">{new Date(p.due_date).toLocaleDateString()}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded font-bold border ${p.status === 'PAID' ? 'bg-neon-green/10 text-neon-green border-neon-green/20' : 'bg-neon-blue/10 text-neon-blue border-neon-blue/20'}`}>
                            {p.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right font-bold text-neon-purple">
                          - R$ {Number(p.amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ─── DASHBOARD VIEW ────────────────────────────────────────────────────── */}
        {activeTab === 'DASHBOARD' && (
          <div className="flex flex-col items-center justify-center p-20 animate-fade-in border border-terminal-border border-dashed rounded-3xl bg-terminal-surface/30">
            <BarChart3 size={48} className="text-terminal-muted mb-6" />
            <h2 className="text-xl font-black text-terminal-bright uppercase tracking-widest mb-2">Painel de Acompanhamento Metrônomo</h2>
            <p className="text-terminal-muted text-sm text-center max-w-lg mb-8">
              Os relatórios e fluxos de caixa gráfico estarão disponíveis automaticamente assim que o primeiro fechamento financeiro for consolidado na aba Financeiro.
            </p>
            <button
              onClick={() => setActiveTab('FINANCE')}
              className="px-6 py-3 bg-white/5 border border-terminal-border hover:border-terminal-muted rounded-xl transition-all font-bold uppercase tracking-widest text-xs"
            >
              Voltar ao Financeiro
            </button>
          </div>
        )}

      </main>

      {/* CREATE MODAL */}
      {activeTab === 'CONTACTS' && isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-[#0a0d14] border border-terminal-border rounded-2xl p-6 w-full max-w-md shadow-2xl relative">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-terminal-muted hover:text-red-500">
              <X size={20} />
            </button>
            <h2 className="text-lg font-black text-terminal-bright mb-4 uppercase tracking-widest">
              Novo <span className="text-neon-cyan">{contactCat.toLowerCase()}</span>
            </h2>
            <form onSubmit={handleCreateContact} className="space-y-4">
              <div>
                <label className="block text-xs text-terminal-muted mb-1">Nome Completo / Razão</label>
                <input required value={newContact.name} onChange={e => setNewContact({ ...newContact, name: e.target.value })} className="w-full bg-white/5 border border-terminal-border rounded px-3 py-2 text-xs text-terminal-bright focus:border-neon-cyan focus:outline-none" placeholder="Ex: João Silva" />
              </div>
              <div>
                <label className="block text-xs text-terminal-muted mb-1">Documento (CPF/CNPJ)</label>
                <input value={newContact.document} onChange={e => setNewContact({ ...newContact, document: e.target.value })} className="w-full bg-white/5 border border-terminal-border rounded px-3 py-2 text-xs text-terminal-bright focus:border-neon-cyan focus:outline-none" placeholder="000.000.000-00" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-terminal-muted mb-1">E-mail</label>
                  <input type="email" value={newContact.email} onChange={e => setNewContact({ ...newContact, email: e.target.value })} className="w-full bg-white/5 border border-terminal-border rounded px-3 py-2 text-xs text-terminal-bright focus:border-neon-cyan focus:outline-none" placeholder="joao@orbe.com.br" />
                </div>
                <div>
                  <label className="block text-xs text-terminal-muted mb-1">Telefone (WhatsApp)</label>
                  <input value={newContact.phone} onChange={e => setNewContact({ ...newContact, phone: e.target.value })} className="w-full bg-white/5 border border-terminal-border rounded px-3 py-2 text-xs text-terminal-bright focus:border-neon-cyan focus:outline-none" placeholder="(11) 90000-0000" />
                </div>
              </div>
              <div>
                <label className="block text-xs text-terminal-muted mb-1">Dados Bancários / PIX</label>
                <input value={newContact.bank_details} onChange={e => setNewContact({ ...newContact, bank_details: e.target.value })} className="w-full bg-white/5 border border-terminal-border rounded px-3 py-2 text-xs text-terminal-bright focus:border-neon-cyan focus:outline-none" placeholder="Ex: Chave PIX Celular" />
              </div>
              <button disabled={submitting} type="submit" className="w-full bg-neon-cyan text-terminal-bg font-bold uppercase text-xs tracking-wider py-3 rounded hover:bg-cyan-300 mt-4 transition-colors">
                {submitting ? 'Salvando...' : 'Salvar Registro'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* CREATE INVOICE MODAL */}
      {activeTab === 'FINANCE' && isInvoiceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-[#0a0d14] border border-terminal-border rounded-2xl p-6 w-full max-w-md shadow-2xl relative">
            <button onClick={() => setIsInvoiceModalOpen(false)} className="absolute top-4 right-4 text-terminal-muted hover:text-red-500">
              <X size={20} />
            </button>
            <h2 className="text-lg font-black text-terminal-bright mb-4 uppercase tracking-widest flex items-center gap-2">
              <Receipt className="text-neon-cyan" /> Nova Fatura
            </h2>
            <form onSubmit={handleCreateInvoice} className="space-y-4">
              <div>
                <label className="block text-xs text-terminal-muted mb-1">Faturar Para (Sacado)</label>
                <input required value={newInvoice.customer_name} onChange={e => setNewInvoice({ ...newInvoice, customer_name: e.target.value })} className="w-full bg-white/5 border border-terminal-border rounded px-3 py-2 text-xs text-terminal-bright focus:border-neon-cyan focus:outline-none" placeholder="Ex: Nome do Cooperado ou Fornecedor" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-terminal-muted mb-1">Documento (CPF/CNPJ)</label>
                  <input value={newInvoice.customer_doc} onChange={e => setNewInvoice({ ...newInvoice, customer_doc: e.target.value })} className="w-full bg-white/5 border border-terminal-border rounded px-3 py-2 text-xs text-terminal-bright focus:border-neon-cyan focus:outline-none" placeholder="Opcional" />
                </div>
                <div>
                  <label className="block text-xs text-terminal-muted mb-1">Vencimento</label>
                  <input required type="date" value={newInvoice.due_date} onChange={e => setNewInvoice({ ...newInvoice, due_date: e.target.value })} className="w-full bg-white/5 border border-terminal-border rounded px-3 py-2 text-xs text-terminal-bright focus:border-neon-cyan focus:outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-xs text-terminal-muted mb-1">Valor Final (R$)</label>
                <input required type="number" step="0.01" value={newInvoice.amount} onChange={e => setNewInvoice({ ...newInvoice, amount: e.target.value })} className="w-full bg-white/5 border border-terminal-border rounded px-3 py-2 text-xs text-terminal-bright focus:border-neon-cyan focus:outline-none" placeholder="Ex: 1550.00" />
              </div>
              <div>
                <label className="block text-xs text-terminal-muted mb-1">Descrição / Serviço</label>
                <input value={newInvoice.description} onChange={e => setNewInvoice({ ...newInvoice, description: e.target.value })} className="w-full bg-white/5 border border-terminal-border rounded px-3 py-2 text-xs text-terminal-bright focus:border-neon-cyan focus:outline-none" placeholder="Ex: Referente ao mês de Setembro" />
              </div>
              <button disabled={submitting} type="submit" className="w-full bg-neon-cyan text-terminal-bg font-bold uppercase text-xs tracking-wider py-3 rounded hover:bg-cyan-300 mt-4 transition-colors">
                {submitting ? 'Emitindo Fatura...' : 'Gerar Fatura & Cobrança'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, FileText, Plus, CheckCircle2, AlertTriangle, Clock, Search, Filter, ShieldCheck } from 'lucide-react';
import { crmApi } from '@/lib/api';

const fmtCurrency = (val: number | string) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(val));

export default function PayablePage() {
    const [payables, setPayables] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('ALL');
    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    const loadPayables = async () => {
        setLoading(true);
        try {
            const data = await crmApi.getPayables();
            if (Array.isArray(data) && data.length > 0) {
                setPayables(data);
            } else {
                setPayables([
                    { id: '1', supplier_name: 'AWS do Brasil', amount: 450.00, due_date: '2026-09-15', status: 'PENDING', document: '12.345.678/0001-90' },
                    { id: '2', supplier_name: 'Contabilidade Silva', amount: 1200.00, due_date: '2026-09-10', status: 'OVERDUE', document: '98.765.432/0001-01' },
                    { id: '3', supplier_name: 'Marketing Digital', amount: 800.00, due_date: '2026-09-01', status: 'PAID', document: '11.111.111/0001-11' },
                ]);
            }
        } catch {
            setPayables([
                { id: '1', supplier_name: 'AWS do Brasil', amount: 450.00, due_date: '2026-09-15', status: 'PENDING', document: '12.345.678/0001-90' },
                { id: '2', supplier_name: 'Contabilidade Silva', amount: 1200.00, due_date: '2026-09-10', status: 'OVERDUE', document: '98.765.432/0001-01' },
                { id: '3', supplier_name: 'Marketing Digital', amount: 800.00, due_date: '2026-09-01', status: 'PAID', document: '11.111.111/0001-11' },
            ]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadPayables();
    }, []);

    const toggleSelect = (id: string) => {
        if (selectedIds.includes(id)) {
            setSelectedIds(selectedIds.filter(i => i !== id));
        } else {
            setSelectedIds([...selectedIds, id]);
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'PAID':
                return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-green-500/10 text-green-400 border border-green-500/20 flex items-center gap-1 w-max"><CheckCircle2 size={12} /> Pago</span>;
            case 'OVERDUE':
                return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-red-500/10 text-red-400 border border-red-500/20 flex items-center gap-1 w-max"><AlertTriangle size={12} /> Atrasado</span>;
            case 'PENDING':
                return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 flex items-center gap-1 w-max"><Clock size={12} /> Pendente</span>;
            default:
                return <span className="px-2.5 py-1 rounded-full text-xs font-bold">{status}</span>;
        }
    };

    const totalSelectedAmount = payables
        .filter(p => selectedIds.includes(p.id))
        .reduce((acc, curr) => acc + curr.amount, 0);

    return (
        <div className="min-h-screen bg-inho-black p-6 lg:p-8">
            <div className="max-w-7xl mx-auto space-y-6">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <Link href="/dashboard" className="text-inho-muted hover:text-white transition-colors bg-inho-dark p-2 rounded-xl">
                            <ArrowLeft size={20} />
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                                Contas a Pagar
                                <FileText size={22} className="text-purple-400" />
                            </h1>
                            <p className="text-xs text-inho-muted mt-1">
                                Centralize boletos, impostos e folhas de pagamento.
                            </p>
                        </div>
                    </div>
                    <button className="flex items-center gap-2 bg-purple-500/20 border border-purple-500 hover:bg-purple-500/30 text-purple-300 font-bold px-4 py-2 rounded-xl transition-all shadow-[0_0_15px_rgba(168,85,247,0.2)] text-xs">
                        <Plus size={16} /> Nova Despesa
                    </button>
                </div>

                {/* KPIs */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="glassmorphism p-5 rounded-2xl border border-inho-border relative overflow-hidden">
                        <div className="flex gap-2 items-center mb-2">
                            <Clock size={16} className="text-yellow-400" />
                            <p className="text-xs uppercase text-inho-muted font-mono tracking-wider">A vencer (Mês Atual)</p>
                        </div>
                        <p className="text-2xl font-black font-mono text-yellow-400">R$ 450,00</p>
                    </div>

                    <div className="glassmorphism p-5 rounded-2xl border border-red-500/20 relative overflow-hidden">
                        <div className="flex gap-2 items-center mb-2">
                            <AlertTriangle size={16} className="text-red-400" />
                            <p className="text-xs uppercase text-inho-muted font-mono tracking-wider">Despesas Atrasadas</p>
                        </div>
                        <p className="text-2xl font-black font-mono text-red-400">R$ 1.200,00</p>
                    </div>

                    <div className="glassmorphism p-5 rounded-2xl border border-inho-border relative overflow-hidden">
                        <div className="flex gap-2 items-center mb-2">
                            <CheckCircle2 size={16} className="text-green-400" />
                            <p className="text-xs uppercase text-inho-muted font-mono tracking-wider">Total Pago (Mês)</p>
                        </div>
                        <p className="text-2xl font-black font-mono text-green-400">R$ 800,00</p>
                    </div>
                </div>

                {/* Table Controls */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-inho-dark/50 border border-inho-border p-4 rounded-xl">
                    <div className="flex gap-2 w-full md:w-auto">
                        <button className="px-4 py-1.5 rounded-lg text-xs font-bold bg-white/10 text-white border border-white/20">Em Aberto</button>
                        <button className="px-4 py-1.5 rounded-lg text-xs font-bold text-inho-muted hover:text-white">Concluídos</button>
                    </div>

                    <div className="flex w-full md:w-auto gap-4 items-center">
                        <div className="relative flex-grow">
                            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-inho-muted" />
                            <input type="text" placeholder="Buscar fornecedor..." className="bg-black/40 border border-inho-border rounded-lg pl-9 pr-3 py-1.5 text-xs text-white outline-none focus:border-purple-500 w-full" />
                        </div>
                    </div>
                </div>

                {/* Multi-select ActionBar */}
                {selectedIds.length > 0 && (
                    <div className="bg-purple-900/30 border border-purple-500/50 p-4 rounded-xl flex items-center justify-between animate-fade-in shadow-xl backdrop-blur-md">
                        <p className="text-sm font-bold text-purple-100 flex items-center gap-2">
                            <ShieldCheck size={18} className="text-purple-400" />
                            {selectedIds.length} item(s) selecionado(s) — Total: <span className="font-mono text-purple-300">{fmtCurrency(totalSelectedAmount)}</span>
                        </p>
                        <button className="bg-purple-500 hover:bg-purple-400 text-purple-950 font-black px-5 py-2 rounded-lg text-xs transition-colors shadow-glow-purple">
                            Liquidar em Lote (PIX/Lote)
                        </button>
                    </div>
                )}

                {/* Table */}
                <div className="glassmorphism rounded-2xl border border-inho-border overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-inho-text">
                            <thead className="bg-inho-dark border-b border-inho-border text-inho-muted font-mono text-[10px] uppercase tracking-widest">
                                <tr>
                                    <th className="px-4 py-3 w-10"></th>
                                    <th className="px-6 py-3">Fornecedor / Descrição</th>
                                    <th className="px-6 py-3">Vencimento</th>
                                    <th className="px-6 py-3">Valor (R$)</th>
                                    <th className="px-6 py-3">Status</th>
                                    <th className="px-6 py-3 text-right">Ação</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-inho-border/40">
                                {loading ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center">
                                            <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto" />
                                        </td>
                                    </tr>
                                ) : payables.map(p => (
                                    <tr key={p.id} className="hover:bg-white/[0.02] transition-colors">
                                        <td className="px-4 py-4 text-center">
                                            <input
                                                type="checkbox"
                                                checked={selectedIds.includes(p.id)}
                                                onChange={() => toggleSelect(p.id)}
                                                className="accent-purple-500 w-4 h-4 rounded border-gray-600 bg-gray-700 cursor-pointer"
                                            />
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="font-bold text-white text-sm">{p.supplier_name}</p>
                                            <p className="text-xs text-inho-muted font-mono mt-0.5">{p.document}</p>
                                        </td>
                                        <td className="px-6 py-4 font-mono text-xs text-white">
                                            {new Date(p.due_date).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}
                                        </td>
                                        <td className="px-6 py-4 font-bold font-mono text-white">
                                            {fmtCurrency(p.amount)}
                                        </td>
                                        <td className="px-6 py-4">
                                            {getStatusBadge(p.status)}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="text-xs font-bold bg-white/5 border border-white/10 hover:border-purple-500 hover:text-purple-400 px-3 py-1.5 rounded-lg transition-colors inline-block">
                                                Detalhes
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </div>
    );
}

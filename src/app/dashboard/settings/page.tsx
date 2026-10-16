'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Settings, Key, Building, Users, ShieldCheck, Banknote, Briefcase, Plus, Trash2, Eye, Copy } from 'lucide-react';

const TABS = [
    { id: 'WORKSPACE', label: 'Empresa & Identidade', icon: Building },
    { id: 'BANKING', label: 'Open Banking', icon: Banknote },
    { id: 'API_KEYS', label: 'Tokens de API', icon: Key },
    { id: 'RBAC', label: 'Controle de Acesso', icon: ShieldCheck },
];

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState('WORKSPACE');

    // Pseudo-State for Bank Integrations
    const [banks] = useState([
        { id: 1, name: 'Banco Inter', status: 'Ativa', created_at: '2026-08-10' },
        { id: 2, name: 'Cora', status: 'Inativa', created_at: '2026-06-01' }
    ]);

    // Pseudo-State for API Tokens
    const [tokens] = useState([
        { id: 1, name: 'Integração ERP Externo', hash: 'inho_...e3x9', created_at: '2026-09-08', expires_at: '2027-09-08' },
        { id: 2, name: 'ZapMailer Automator', hash: 'inho_...b1f4', created_at: '2026-08-20', expires_at: '2027-08-20' }
    ]);

    return (
        <div className="min-h-screen bg-inho-black p-6 lg:p-8">
            <div className="max-w-6xl mx-auto space-y-6">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <Link href="/dashboard" className="text-inho-muted hover:text-white transition-colors bg-inho-dark p-2 rounded-xl">
                            <ArrowLeft size={20} />
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                                Configurações do Hub
                                <Settings size={22} className="text-gray-400" />
                            </h1>
                            <p className="text-xs text-inho-muted mt-1">
                                Acesse o Console Administrativo para integrações Money Layer e Segredos.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Console Layout: Sidebar + Content */}
                <div className="flex flex-col md:flex-row gap-6 items-start mt-8">

                    {/* Vertical Tabs Sidebar */}
                    <div className="w-full md:w-64 glassmorphism rounded-2xl border border-inho-border p-3 space-y-1 flex-shrink-0">
                        {TABS.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all
                  ${activeTab === tab.id
                                        ? 'bg-white/10 text-white border border-white/20'
                                        : 'text-inho-muted hover:bg-white/5 border border-transparent'}`}
                            >
                                <tab.icon size={16} className={activeTab === tab.id ? 'text-neon-cyan' : ''} />
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Main Content Area */}
                    <div className="flex-1 w-full glassmorphism rounded-2xl border border-inho-border p-6 min-h-[500px]">

                        {activeTab === 'WORKSPACE' && (
                            <div className="animate-fade-in space-y-8">
                                <div className="border-b border-inho-border pb-4">
                                    <h2 className="text-xl font-bold text-white flex items-center gap-2"><Briefcase size={20} /> Dados da Empresa</h2>
                                    <p className="text-xs text-inho-muted mt-1">Configure logotipo Invoices e Razão Social.</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="text-xs text-inho-muted font-mono mb-1 block">Razão Social</label>
                                        <input type="text" defaultValue="Orbe Systems Solutions" className="w-full bg-black/60 border border-inho-border rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-neon-cyan" />
                                    </div>
                                    <div>
                                        <label className="text-xs text-inho-muted font-mono mb-1 block">Logotipo (URL S3)</label>
                                        <input type="text" defaultValue="https://s3.amazonaws.com/logo-orbe.png" className="w-full bg-black/60 border border-inho-border rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-neon-cyan text-inho-gold" />
                                    </div>
                                    <div>
                                        <label className="text-xs text-inho-muted font-mono mb-1 block">Inscrição Estadual (IE)</label>
                                        <input type="text" placeholder="Isento" className="w-full bg-black/60 border border-inho-border rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-neon-cyan" />
                                    </div>
                                    <div>
                                        <label className="text-xs text-inho-muted font-mono mb-1 block">Horizonte de Caixa (Meses no DRE)</label>
                                        <input type="number" defaultValue="6" className="w-full bg-black/60 border border-inho-border rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-neon-cyan font-mono" />
                                    </div>
                                </div>
                                <button className="bg-white text-black px-6 py-2.5 rounded-lg font-bold text-xs hover:bg-gray-200 transition-colors">
                                    Salvar Configurações
                                </button>
                            </div>
                        )}

                        {activeTab === 'API_KEYS' && (
                            <div className="animate-fade-in space-y-6">
                                <div className="flex justify-between items-center border-b border-inho-border pb-4">
                                    <div>
                                        <h2 className="text-xl font-bold text-white flex items-center gap-2"><Key size={20} /> Endpoints & Tokens</h2>
                                        <p className="text-xs text-inho-muted mt-1">Gere chaves protegidas para APIs GraphQL e REST.</p>
                                    </div>
                                    <button className="flex items-center gap-2 bg-neon-cyan/20 border border-neon-cyan text-neon-cyan px-4 py-2 rounded-lg font-bold text-xs shadow-glow-cyan hover:bg-neon-cyan/30">
                                        <Plus size={16} /> Gerar Token
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    {tokens.map(tk => (
                                        <div key={tk.id} className="bg-black/40 border border-inho-border rounded-xl p-4 flex justify-between items-center">
                                            <div>
                                                <p className="text-sm font-bold text-white">{tk.name}</p>
                                                <p className="text-[10px] text-inho-muted font-mono mt-1">Expira em: {new Date(tk.expires_at).toLocaleDateString()}</p>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <div className="flex items-center gap-2 bg-inho-dark px-3 py-1.5 rounded-lg border border-white/5">
                                                    <span className="font-mono text-xs text-inho-gold">{tk.hash}</span>
                                                    <Copy size={12} className="text-inho-muted cursor-pointer hover:text-white" />
                                                </div>
                                                <button className="text-red-400 hover:text-red-300 transition-colors p-2"><Trash2 size={16} /></button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <p className="text-[10px] font-mono text-inho-muted border-l-2 border-neon-cyan pl-3">
                                    Nenhum token real é renderizado após a criação. Guarde-os em cofres HSM (ex: AWS KMS).
                                </p>
                            </div>
                        )}

                        {activeTab === 'BANKING' && (
                            <div className="animate-fade-in space-y-6">
                                <div className="flex justify-between items-center border-b border-inho-border pb-4">
                                    <div>
                                        <h2 className="text-xl font-bold text-white flex items-center gap-2"><Banknote size={20} /> Automação Bancária BaaS</h2>
                                        <p className="text-xs text-inho-muted mt-1">Vincule contas PJ para conciliação automática de Pix e Boleto.</p>
                                    </div>
                                    <button className="flex items-center gap-2 bg-purple-500/20 border border-purple-500 text-purple-400 px-4 py-2 rounded-lg font-bold text-xs hover:bg-purple-500/30">
                                        <Plus size={16} /> Conectar Banco
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 gap-4">
                                    {banks.map(bank => (
                                        <div key={bank.id} className="bg-black/40 border border-inho-border rounded-xl p-4 flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${bank.status === 'Ativa' ? 'bg-orange-500' : 'bg-pink-500'}`}>
                                                    {bank.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-sm text-white">{bank.name}</p>
                                                    <p className="text-[10px] text-inho-muted font-mono mt-0.5">Autorizado em {new Date(bank.created_at).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className={`px-2 py-1 rounded text-[9px] font-bold uppercase tracking-widest border ${bank.status === 'Ativa' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-gray-500/10 text-gray-400 border-gray-500/20'
                                                    }`}>
                                                    {bank.status}
                                                </span>
                                                <button className="text-purple-400 font-bold text-[10px] uppercase hover:text-purple-300">Configurar</button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === 'RBAC' && (
                            <div className="animate-fade-in text-center py-20">
                                <ShieldCheck size={48} className="mx-auto text-inho-muted opacity-50 mb-4" />
                                <h2 className="text-xl font-bold text-white mb-2">Controle de Acesso</h2>
                                <p className="text-inho-muted text-sm max-w-md mx-auto">
                                    O gerenciamento granular de privilégios de Usuários e Operadores (ACL) é editado na aba <strong>Equipe & Permissões</strong> no Dashboard Principal.
                                </p>
                                <Link href="/dashboard/users" className="inline-block mt-6 px-6 py-2 bg-neon-cyan/10 border border-neon-cyan/50 text-neon-cyan font-bold text-xs rounded-lg">
                                    Ir para Equipe & Permissões
                                </Link>
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </div>
    );
}

'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/AuthContext';
import {
    Users2, Building, Store, Utensils,
    PlusCircle, Lock, ArrowRight, LayoutTemplate
} from 'lucide-react';

export default function DashboardHub() {
    const { user } = useAuth();

    const isAdmin = user?.role === 'admin' || user?.role === 'super_admin';

    const segments = [
        {
            id: 'cooperativa',
            title: 'Cooperativismo',
            icon: Users2,
            description: 'Gestão completa para Cooperativas com módulos B2B e B2C integrados.',
            status: 'active',
            href: '/dashboard/cooperativa',
            color: 'inho-blue',
            gradient: 'from-inho-blue/20 to-inho-green/20',
            border: 'border-inho-blue/50'
        },
        {
            id: 'hotelaria',
            title: 'Redes de Hotelaria',
            icon: Building,
            description: 'Módulo unificado para controle de hospedagem, consumo e gestão tarifária.',
            status: 'locked',
            href: '#',
            color: 'inho-gold',
            gradient: 'from-inho-gold/5 to-transparent',
            border: 'border-inho-border'
        },
        {
            id: 'sindicato',
            title: 'Sindicatos e Associações',
            icon: LayoutTemplate,
            description: 'Arrecadação e gestão completa de sindicalizados e benefícios associativos.',
            status: 'locked',
            href: '#',
            color: 'purple-500',
            gradient: 'from-purple-500/5 to-transparent',
            border: 'border-inho-border'
        },
        {
            id: 'supermercado',
            title: 'Supermercados',
            icon: Store,
            description: 'Integração massiva B2C, controle logístico de reposição e frente de caixa rápida.',
            status: 'locked',
            href: '#',
            color: 'orange-500',
            gradient: 'from-orange-500/5 to-transparent',
            border: 'border-inho-border'
        },
        {
            id: 'restaurante',
            title: 'Bares e Restaurantes',
            icon: Utensils,
            description: 'Gestão de mesas, pedidos em tempo real e controle de desperdício.',
            status: 'locked',
            href: '#',
            color: 'red-500',
            gradient: 'from-red-500/5 to-transparent',
            border: 'border-inho-border'
        }
    ];

    return (
        <div className="flex-1 overflow-y-auto min-h-full">
            <main className="max-w-[1600px] mx-auto p-8 fade-in">

                {/* Hub Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6 relative">

                    <div className="z-10">
                        <h1 className="text-4xl font-black text-inho-text mb-3">
                            Hub de <span className="text-inho-gold">Modelos de Negócios</span>
                        </h1>
                        <p className="text-inho-muted text-sm max-w-xl leading-relaxed">
                            O Portal INHO é adaptável. Selecione o modelo de negócio abaixo para operar a interface e as lógicas de negócio específicas da sua instituição.
                        </p>
                    </div>

                    {/* MASSIVE ADD OPERATOR BUTTON - Only Admins */}
                    {isAdmin && (
                        <div className="relative z-10 group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-inho-green to-inho-blue rounded-2xl blur opacity-30 group-hover:opacity-75 transition duration-500" />
                            <Link
                                href="/dashboard/users"
                                className="relative flex items-center gap-3 px-8 py-4 bg-inho-black border border-inho-green/50 rounded-2xl text-inho-text hover:bg-inho-dark transition-colors shadow-2xl"
                            >
                                <PlusCircle size={24} className="text-inho-green" />
                                <div className="flex flex-col items-start pr-4">
                                    <span className="font-black text-lg tracking-wide uppercase">Novo Operador</span>
                                    <span className="text-[10px] text-inho-muted font-mono uppercase tracking-widest">Adicionar Colaborador</span>
                                </div>
                            </Link>
                        </div>
                    )}
                </div>

                {/* Segments Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {segments.map((segment) => {
                        const isActive = segment.status === 'active';
                        const Icon = segment.icon;

                        return (
                            <Link
                                key={segment.id}
                                href={isActive ? segment.href : '#'}
                                className={`relative flex flex-col p-8 rounded-3xl border transition-all duration-300 overflow-hidden group
                  ${isActive
                                        ? `bg-gradient-to-br ${segment.gradient} ${segment.border} hover:-translate-y-2 hover:shadow-[0_20px_40px_-20px_rgba(14,165,233,0.3)]`
                                        : `bg-inho-dark/30 ${segment.border} opacity-70 cursor-not-allowed`
                                    }
                `}
                            >
                                {/* Background Accent */}
                                <div className="absolute top-0 right-0 p-8 opacity-5">
                                    <Icon size={180} />
                                </div>

                                <div className="flex justify-between items-start mb-16 relative z-10">
                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border shadow-lg
                    ${isActive ? `bg-${segment.color}/10 border-${segment.color}/30 text-${segment.color}` : 'bg-inho-black border-inho-border text-inho-muted'}
                  `}>
                                        <Icon size={28} />
                                    </div>

                                    {!isActive ? (
                                        <span className="flex items-center gap-1.5 px-3 py-1.5 bg-inho-black border border-inho-border rounded-lg text-xs font-bold text-inho-muted">
                                            <Lock size={12} />
                                            EM BREVE
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-1.5 px-3 py-1.5 bg-inho-blue/20 border border-inho-blue/30 rounded-lg text-xs font-bold text-inho-blue">
                                            <span className="w-2 h-2 rounded-full bg-inho-blue animate-pulse" />
                                            DISPONÍVEL
                                        </span>
                                    )}
                                </div>

                                <div className="relative z-10 mt-auto">
                                    <h3 className={`text-2xl font-black mb-2 ${isActive ? 'text-inho-text' : 'text-inho-muted'}`}>
                                        {segment.title}
                                    </h3>
                                    <p className="text-sm text-inho-muted leading-relaxed max-w-sm mb-6">
                                        {segment.description}
                                    </p>

                                    <div className={`flex items-center gap-2 text-sm font-bold uppercase tracking-wider
                    ${isActive ? `text-${segment.color} group-hover:translate-x-2 transition-transform duration-300` : 'text-inho-border'}
                  `}>
                                        {isActive ? 'Acessar Módulo' : 'Indisponível'}
                                        {isActive && <ArrowRight size={16} />}
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>

            </main>
        </div>
    );
}

'use client';

import React, { useState, useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import {
  Sparkles,
  Bot,
  X,
  Send,
  Zap,
  CreditCard,
  Scale,
  ShieldAlert,
  Wheat,
  MessageSquare,
  Lock,
  ChevronRight,
  Maximize2,
  Minimize2,
  RefreshCw,
  Terminal,
} from 'lucide-react';
import { API_BASE_URL } from '@/lib/api';

interface ActionShortcut {
  label: string;
  action_type: string;
  target: string;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  shortcuts?: ActionShortcut[];
  timestamp: string;
}

const QUICK_PROMPTS = [
  { label: 'Maquininha Stripe (POS)', icon: CreditCard, query: 'Como parear e usar a maquininha física Stripe Terminal WisePOS E?' },
  { label: 'Balança PLU & EAN-13', icon: Scale, query: 'Qual a tabela de PLU rápida e como funciona o decodificador de balança pesável?' },
  { label: 'Trava Dual-Control (> R$ 5k)', icon: ShieldAlert, query: 'Como funciona a aprovação de despesas acima de R$ 5.000,00 no Contas a Pagar?' },
  { label: 'Cooperativa & Retenções', icon: Wheat, query: 'Quais são as retenções de INSS Funrural e FATES pela Lei 5.764?' },
  { label: 'WhatsApp & Régua OrBrick', icon: MessageSquare, query: 'Como funciona a régua de cobrança automática e anti-prompt injection no WhatsApp?' },
  { label: 'Fechamento Cego de Caixa', icon: Lock, query: 'Como é feita a conferência cega e auditoria IA de quebra de caixa no PDV?' },
];

export default function OrbeAssistantRoot() {
  const pathname = usePathname();
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: `### ⚡ [ORBE ASSISTANT AI — PRIVILÉGIO ROOT ATIVO]

Olá, Operador! Sou seu co-piloto de inteligência operacional com **Poder ROOT** em todo o ecossistema INHO ERP.

Tenho domínio integral dos **30 Manuais de Arquitetura**, fluxos de PDV, maquininhas Stripe Terminal, balanças, regras fiscais de cooperativismo e governança financeira.

*Escolha uma ação rápida abaixo ou faça qualquer pergunta operacional.*`,
      shortcuts: [
        { label: 'Frente de Caixa (PDV)', action_type: 'NAVIGATE', target: '/dashboard/pdv' },
        { label: 'Configurar Maquininha', action_type: 'NAVIGATE', target: '/dashboard/settings' },
        { label: 'Painel Cooperativo', action_type: 'NAVIGATE', target: '/dashboard/cooperativa' },
      ],
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut Alt+A to toggle
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && (e.key === 'a' || e.key === 'A')) {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      inputRef.current?.focus();
    }
  }, [messages, isOpen]);

  const handleSend = async (queryText?: string) => {
    const query = (queryText || inputQuery).trim();
    if (!query || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setIsLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/copilot/root_assist`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query,
          context_screen: pathname || 'dashboard',
        }),
      });

      if (!res.ok) {
        throw new Error(`Erro ${res.status}`);
      }

      const data = await res.json();

      const assistantMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        text: data.reply || 'Comando processado com privilégios ROOT.',
        shortcuts: data.suggested_actions || [],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        sender: 'assistant',
        text: `### ⚠️ Modo de Resiliência Local (Offline Fallback)
Privilégio ROOT ativo localmente. Resposta de emergência para **"${query}"**:
* Para maquininhas Stripe Terminal, acesse **/dashboard/settings** aba Maquininha e use o código de 3 palavras.
* Para Frente de Caixa, acesse **/dashboard/pdv** e utilize os atalhos F1 a F10.
* Para Contas a Pagar (> R$ 5.000), aprove em **/dashboard/payable** com credenciais de dois gestores.`,
        shortcuts: [
          { label: 'Ir para PDV', action_type: 'NAVIGATE', target: '/dashboard/pdv' },
          { label: 'Configurações', action_type: 'NAVIGATE', target: '/dashboard/settings' },
        ],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleShortcutClick = (shortcut: ActionShortcut) => {
    if (shortcut.action_type === 'NAVIGATE' && shortcut.target) {
      router.push(shortcut.target);
      // Optional: keep drawer open or close on mobile
      if (window.innerWidth < 768) {
        setIsOpen(false);
      }
    }
  };

  // Render markdown-like text
  const formatText = (content: string) => {
    const lines = content.split('\n');
    return lines.map((line, idx) => {
      // Header 3
      if (line.startsWith('### ')) {
        return (
          <h4 key={idx} className="text-amber-400 font-bold text-sm mt-2 mb-1 flex items-center gap-1.5">
            {line.replace('### ', '')}
          </h4>
        );
      }
      // Bullet points
      if (line.trim().startsWith('* ') || line.trim().startsWith('- ')) {
        const clean = line.trim().substring(2);
        return (
          <li key={idx} className="ml-4 list-disc text-slate-200 text-xs my-0.5 leading-relaxed">
            {renderBoldAndCode(clean)}
          </li>
        );
      }
      // Numbered items
      if (/^\d+\.\s/.test(line.trim())) {
        return (
          <div key={idx} className="font-semibold text-slate-100 text-xs mt-1.5 mb-0.5">
            {renderBoldAndCode(line.trim())}
          </div>
        );
      }
      // Empty line
      if (!line.trim()) {
        return <div key={idx} className="h-1.5" />;
      }
      // Normal paragraph
      return (
        <p key={idx} className="text-slate-300 text-xs leading-relaxed my-0.5">
          {renderBoldAndCode(line)}
        </p>
      );
    });
  };

  const renderBoldAndCode = (str: string) => {
    // Basic bold **text** and code `text` parsing
    const parts = str.split(/(\*\*.*?\*\*|`.*?`)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="text-amber-200 font-semibold">{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith('`') && part.endsWith('`')) {
        return <code key={i} className="px-1 py-0.5 rounded bg-slate-800 text-cyan-300 font-mono text-[11px] border border-cyan-500/20">{part.slice(1, -1)}</code>;
      }
      return part;
    });
  };

  return (
    <>
      {/* Floating HUD Launcher (Bottom-Right) */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 group">
          <button
            onClick={() => setIsOpen(true)}
            className="relative flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950/90 text-white border-2 border-amber-500/60 shadow-[0_0_25px_rgba(245,158,11,0.35)] hover:shadow-[0_0_35px_rgba(245,158,11,0.6)] hover:border-amber-400 hover:scale-105 active:scale-95 transition-all duration-300"
            title="Orbe Assistant AI (Poder ROOT) — Alt+A"
          >
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
            </span>

            <div className="flex items-center gap-1.5">
              <Bot size={17} className="text-amber-400" />
              <span className="font-bold text-xs tracking-wider uppercase text-amber-100">
                Orbe AI
              </span>
              <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/40 tracking-wider">
                ROOT ⚡
              </span>
            </div>

            <span className="hidden group-hover:inline-block text-[10px] text-slate-400 font-mono ml-1 border-l border-slate-700 pl-2">
              Alt+A
            </span>
          </button>
        </div>
      )}

      {/* Floating ROOT Assistant Modal */}
      {isOpen && (
        <div
          className={`fixed z-50 transition-all duration-300 shadow-2xl flex flex-col ${
            isExpanded
              ? 'inset-4 md:inset-10 rounded-2xl'
              : 'bottom-4 right-4 md:bottom-6 md:right-6 w-[94vw] md:w-[460px] h-[640px] max-h-[90vh] rounded-2xl'
          } bg-slate-950/95 backdrop-blur-xl border border-amber-500/40 text-slate-100 overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)]`}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-slate-900 via-slate-950 to-amber-950/80 border-b border-amber-500/30">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center shadow-lg shadow-amber-500/20 text-slate-950 font-black">
                <Zap size={18} className="fill-slate-950 text-slate-950" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-sm tracking-wide text-white flex items-center gap-1.5">
                    ORBE ASSISTANT AI
                  </h3>
                  <span className="px-1.5 py-0.2 rounded text-[9px] font-black uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    ROOT PRIVILEGE
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[10px] text-slate-400">
                  <span className="text-amber-400/90 font-mono font-semibold">TELA: {pathname}</span>
                  <span>•</span>
                  <span>Manual 31 Super-Operator</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
                title={isExpanded ? 'Restaurar tamanho' : 'Expandir'}
              >
                {isExpanded ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-red-500/20 hover:text-red-300 transition-colors"
                title="Fechar (Alt+A)"
              >
                <X size={17} />
              </button>
            </div>
          </div>

          {/* Quick Prompts Bar */}
          <div className="px-3 py-2 bg-slate-900/60 border-b border-slate-800/80 flex gap-1.5 overflow-x-auto no-scrollbar">
            {QUICK_PROMPTS.map((qp, idx) => {
              const Icon = qp.icon;
              return (
                <button
                  key={idx}
                  onClick={() => handleSend(qp.query)}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-800/70 hover:bg-amber-500/20 text-slate-300 hover:text-amber-300 border border-slate-700/60 hover:border-amber-500/40 text-[11px] whitespace-nowrap font-medium transition-all"
                >
                  <Icon size={12} className="text-amber-400" />
                  <span>{qp.label}</span>
                </button>
              );
            })}
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs font-sans">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div className="flex items-center gap-1.5 mb-1 px-1">
                  {msg.sender === 'assistant' ? (
                    <>
                      <Sparkles size={11} className="text-amber-400" />
                      <span className="text-[10px] font-bold uppercase text-amber-400 tracking-wider">
                        Orbe AI Root
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                        Operador
                      </span>
                    </>
                  )}
                  <span className="text-[10px] text-slate-500 font-mono">{msg.timestamp}</span>
                </div>

                <div
                  className={`max-w-[92%] p-3.5 rounded-2xl shadow-md ${
                    msg.sender === 'user'
                      ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-tr-none font-medium'
                      : 'bg-slate-900/90 border border-slate-800 text-slate-200 rounded-tl-none'
                  }`}
                >
                  {formatText(msg.text)}

                  {/* Action Shortcuts */}
                  {msg.shortcuts && msg.shortcuts.length > 0 && (
                    <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex flex-wrap gap-1.5">
                      {msg.shortcuts.map((sc, i) => (
                        <button
                          key={i}
                          onClick={() => handleShortcutClick(sc)}
                          className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 text-[11px] font-semibold transition-all hover:scale-102"
                        >
                          <span>{sc.label}</span>
                          <ChevronRight size={12} />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-900/80 border border-slate-800 w-fit text-amber-300">
                <RefreshCw size={13} className="animate-spin text-amber-400" />
                <span className="text-xs font-mono">Processando comando com privilégios ROOT...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Footer Input Bar */}
          <div className="p-3 bg-slate-900/90 border-t border-slate-800">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <div className="relative flex-1">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputQuery}
                  onChange={(e) => setInputQuery(e.target.value)}
                  placeholder="Pergunte ao Co-piloto ROOT (ex: Como parear leitor Stripe?)..."
                  disabled={isLoading}
                  className="w-full pl-3 pr-8 py-2.5 rounded-xl bg-slate-950 border border-slate-700/80 focus:border-amber-400 focus:ring-1 focus:ring-amber-400/50 text-xs text-white placeholder-slate-500 outline-none transition-all"
                />
                <Terminal
                  size={13}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading || !inputQuery.trim()}
                className="p-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-md shadow-amber-500/20 active:scale-95"
              >
                <Send size={15} />
              </button>
            </form>

            <div className="flex items-center justify-between mt-2 px-1 text-[10px] text-slate-500">
              <span className="font-mono">Pressione Enter para enviar</span>
              <span className="font-mono">Atalho: Alt+A</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

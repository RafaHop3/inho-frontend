'use client';

import React, { useCallback, useEffect, useState } from 'react';
import QRCode from 'qrcode';
import {
  QrCode,
  RefreshCw,
  CheckCircle2,
  PowerOff,
  Smartphone,
  ShieldCheck,
  MessageSquare,
  Send,
  Instagram,
} from 'lucide-react';
import { crmApi } from '@/lib/api';

export default function OrBrickChannelsQrCard() {
  const [hub, setHub] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [busyChannel, setBusyChannel] = useState<string | null>(null);
  const [banner, setBanner] = useState<string | null>(null);

  const [waQrImg, setWaQrImg] = useState<string>('');
  const [igQrImg, setIgQrImg] = useState<string>('');
  const [tgQrImg, setTgQrImg] = useState<string>('');

  const [igHandle, setIgHandle] = useState('');
  const [igToken, setIgToken] = useState('');
  const [tgBot, setTgBot] = useState('');
  const [tgToken, setTgToken] = useState('');

  const loadQrHub = useCallback(async () => {
    setLoading(true);
    try {
      const data = await crmApi.getOrbrickChannelsQrHub();
      setHub(data);
      if (data?.instagram?.handle_or_page_id) setIgHandle(data.instagram.handle_or_page_id);
      if (data?.telegram?.bot_or_channel) setTgBot(data.telegram.bot_or_channel);

      // Build QR DataURLs locally
      if (data?.whatsapp?.qr_data_url) {
        setWaQrImg(data.whatsapp.qr_data_url);
      } else if (data?.whatsapp?.qr_payload) {
        setWaQrImg(await QRCode.toDataURL(data.whatsapp.qr_payload, { width: 200, margin: 1 }));
      }
      if (data?.instagram?.qr_payload) {
        setIgQrImg(await QRCode.toDataURL(data.instagram.qr_payload, { width: 200, margin: 1 }));
      }
      if (data?.telegram?.qr_payload) {
        setTgQrImg(await QRCode.toDataURL(data.telegram.qr_payload, { width: 200, margin: 1 }));
      }
    } catch (err: any) {
      setBanner(err?.message || 'Erro ao carregar hub de canais OrBrick.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadQrHub();
  }, [loadQrHub]);

  const handleConnect = async (channel: 'WHATSAPP' | 'INSTAGRAM' | 'TELEGRAM') => {
    setBusyChannel(channel);
    setBanner(null);
    try {
      const payload: any = { channel };
      if (channel === 'INSTAGRAM') {
        payload.handle_or_id = igHandle;
        if (igToken.trim()) payload.access_token = igToken.trim();
      } else if (channel === 'TELEGRAM') {
        payload.handle_or_id = tgBot;
        if (tgToken.trim()) payload.access_token = tgToken.trim();
      }
      await crmApi.connectOrbrickChannel(payload);
      setBanner(`Canal ${channel} sincronizado e QR Code atualizado para ${hub?.business_name || 'sua empresa'}!`);
      setIgToken('');
      setTgToken('');
      await loadQrHub();
    } catch (err: any) {
      setBanner(err?.message || `Erro ao conectar ${channel}.`);
    } finally {
      setBusyChannel(null);
    }
  };

  const handleDisconnect = async (channel: 'WHATSAPP' | 'INSTAGRAM' | 'TELEGRAM') => {
    setBusyChannel(channel);
    setBanner(null);
    try {
      await crmApi.disconnectOrbrickChannel(channel);
      setBanner(`Sessão ${channel} desconectada. Você já pode parear uma nova conta.`);
      await loadQrHub();
    } catch (err: any) {
      setBanner(err?.message || `Erro ao desconectar ${channel}.`);
    } finally {
      setBusyChannel(null);
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-sm space-y-5">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#E2E8F0]">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold uppercase bg-emerald-50 text-emerald-800 border border-emerald-200">
            <QrCode size={13} /> OrBrick Descentralizado Multi-Tenant · Custo Zero (R$ 0/msg)
          </div>
          <h2 className="text-xl font-extrabold text-[#0F172A] mt-2">
            Conecte Suas Próprias Contas por QR Code (WhatsApp, Instagram &amp; Telegram)
          </h2>
          <p className="text-xs text-[#64748B] mt-1">
            Sessão isolada para <strong>{hub?.business_name || 'sua Matriz'}</strong> (<code>{hub?.session_key || 'tenant_session'}</code>).
            Cada cliente INHO conecta seu próprio número e canais sem depender de conta centralizada.
          </p>
        </div>

        <button
          onClick={loadQrHub}
          disabled={loading}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-extrabold uppercase tracking-wider transition-all"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          Atualizar QR Codes
        </button>
      </div>

      {banner && (
        <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs font-bold text-amber-900 flex justify-between">
          <span>{banner}</span>
          <button onClick={() => setBanner(null)} className="underline ml-3">Fechar</button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 1. WHATSAPP QR CARD */}
        <div className="p-5 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 text-sm font-extrabold text-emerald-800">
                <MessageSquare size={16} /> 1. WhatsApp Próprio
              </span>
              <span
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                  hub?.whatsapp?.connected
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                {hub?.whatsapp?.connected ? 'Conectado' : 'Pronto p/ Scan QR'}
              </span>
            </div>
            <p className="text-[11px] text-slate-600">
              Abra o WhatsApp do seu negócio no celular &rarr; <strong>Aparelhos Conectados</strong> &rarr; Escaneie o QR Code exclusivo da sua matriz.
            </p>
            <div className="flex flex-col items-center justify-center bg-white p-4 rounded-xl border border-slate-200">
              {waQrImg ? (
                <img src={waQrImg} alt="QR Code WhatsApp Tenant" className="w-44 h-44 object-contain" />
              ) : (
                <div className="w-44 h-44 flex items-center justify-center text-xs text-slate-400">Gerando QR...</div>
              )}
              <span className="mt-2 text-[10px] font-mono text-slate-500">
                Sessão: {hub?.whatsapp?.session_id || 'tenant_wa'}
              </span>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => handleConnect('WHATSAPP')}
              disabled={busyChannel === 'WHATSAPP'}
              className="flex-1 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-extrabold uppercase"
            >
              <Smartphone size={13} className="inline mr-1" /> Gerar Novo QR
            </button>
            <button
              onClick={() => handleDisconnect('WHATSAPP')}
              disabled={busyChannel === 'WHATSAPP'}
              className="px-3 py-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-bold"
              title="Desconectar WhatsApp"
            >
              <PowerOff size={14} />
            </button>
          </div>
        </div>

        {/* 2. INSTAGRAM QR CARD */}
        <div className="p-5 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 text-sm font-extrabold text-pink-700">
                <Instagram size={16} /> 2. Instagram Direct
              </span>
              <span
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                  hub?.instagram?.connected
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-pink-100 text-pink-800'
                }`}
              >
                {hub?.instagram?.connected ? 'Pareado' : 'QR Direct Ativo'}
              </span>
            </div>
            <p className="text-[11px] text-slate-600">
              Informe o <strong>@usuario</strong> ou Page ID do Instagram da empresa para gerar o QR Code Direct + Webhook Meta Oficial (R$ 0/msg).
            </p>
            <div className="flex flex-col items-center justify-center bg-white p-4 rounded-xl border border-slate-200">
              {igQrImg && <img src={igQrImg} alt="QR Code Instagram Tenant" className="w-36 h-36 object-contain" />}
              <span className="mt-1.5 text-[10px] font-mono text-slate-500 truncate max-w-full">
                @{igHandle || 'suaempresa'}
              </span>
            </div>
            <div className="space-y-1.5">
              <input
                type="text"
                placeholder="@usuario ou Page ID Instagram"
                value={igHandle}
                onChange={(e) => setIgHandle(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs bg-white"
              />
              <input
                type="password"
                placeholder="Token Meta Graph API (opcional · AES-256)"
                value={igToken}
                onChange={(e) => setIgToken(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs bg-white"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => handleConnect('INSTAGRAM')}
              disabled={busyChannel === 'INSTAGRAM'}
              className="flex-1 py-2.5 rounded-xl bg-pink-700 hover:bg-pink-800 text-white text-xs font-extrabold uppercase"
            >
              Ativar QR Instagram
            </button>
            <button
              onClick={() => handleDisconnect('INSTAGRAM')}
              disabled={busyChannel === 'INSTAGRAM'}
              className="px-3 py-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-bold"
              title="Desconectar Instagram"
            >
              <PowerOff size={14} />
            </button>
          </div>
        </div>

        {/* 3. TELEGRAM QR CARD */}
        <div className="p-5 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 text-sm font-extrabold text-sky-700">
                <Send size={16} /> 3. Telegram Bot / VIP
              </span>
              <span
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                  hub?.telegram?.connected
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-sky-100 text-sky-800'
                }`}
              >
                {hub?.telegram?.connected ? 'Pareado' : 'QR Bot Ativo'}
              </span>
            </div>
            <p className="text-[11px] text-slate-600">
              Informe o <strong>@SeuBot</strong> e Token (@BotFather) para gerar o QR Code de pareamento direto do Telegram da sua empresa.
            </p>
            <div className="flex flex-col items-center justify-center bg-white p-4 rounded-xl border border-slate-200">
              {tgQrImg && <img src={tgQrImg} alt="QR Code Telegram Tenant" className="w-36 h-36 object-contain" />}
              <span className="mt-1.5 text-[10px] font-mono text-slate-500 truncate max-w-full">
                t.me/{tgBot || 'OrbeBrickBot'}
              </span>
            </div>
            <div className="space-y-1.5">
              <input
                type="text"
                placeholder="@UsernameDoBot ou Canal VIP"
                value={tgBot}
                onChange={(e) => setTgBot(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs bg-white"
              />
              <input
                type="password"
                placeholder="Bot Token @BotFather (opcional · AES-256)"
                value={tgToken}
                onChange={(e) => setTgToken(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs bg-white"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => handleConnect('TELEGRAM')}
              disabled={busyChannel === 'TELEGRAM'}
              className="flex-1 py-2.5 rounded-xl bg-sky-700 hover:bg-sky-800 text-white text-xs font-extrabold uppercase"
            >
              Ativar QR Telegram
            </button>
            <button
              onClick={() => handleDisconnect('TELEGRAM')}
              disabled={busyChannel === 'TELEGRAM'}
              className="px-3 py-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-bold"
              title="Desconectar Telegram"
            >
              <PowerOff size={14} />
            </button>
          </div>
        </div>
      </div>

      <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-[11px] text-slate-600">
        <span className="flex items-center gap-1.5">
          <ShieldCheck size={14} className="text-emerald-700" />
          Tokens criptografados em repouso com <strong>MultiFernet AES-256</strong> e sessões isoladas por <code>business_id</code>.
        </span>
        <span className="font-bold text-emerald-700 flex items-center gap-1">
          <CheckCircle2 size={13} /> RLS Multi-Tenant Ativo
        </span>
      </div>
    </div>
  );
}

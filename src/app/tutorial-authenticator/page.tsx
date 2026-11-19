'use client';

import React from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Smartphone,
  QrCode,
  KeyRound,
  Lock,
  CheckCircle2,
  ArrowLeft,
  HelpCircle,
  ExternalLink,
  Clock,
  Crown,
} from 'lucide-react';

const RECOMMENDED_APPS = [
  {
    name: 'Google Authenticator',
    badge: 'MAIS POPULAR · SIMPLES E RÁPIDO',
    description:
      'Aplicativo oficial do Google, extremamente leve, gratuito e fácil de usar. Permite sincronizar os códigos com a sua conta Google para não perder o acesso se trocar de celular.',
    platforms: 'Android (Google Play) e iPhone (App Store)',
    androidUrl: 'https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2',
    iosUrl: 'https://apps.apple.com/br/app/google-authenticator/id388497605',
  },
  {
    name: 'Microsoft Authenticator',
    badge: 'RECOMENDADO CORPORATIVO · BIOMETRIA',
    description:
      'Excelente para ambiente empresarial. Solicita sua impressão digital ou FaceID antes de exibir os códigos e possui backup em nuvem criptografado.',
    platforms: 'Android (Google Play) e iPhone (App Store)',
    androidUrl: 'https://play.google.com/store/apps/details?id=com.azure.authenticator',
    iosUrl: 'https://apps.apple.com/br/app/microsoft-authenticator/id983156458',
  },
  {
    name: '2FAS Auth / Twilio Authy',
    badge: 'CÓDIGO ABERTO & MULTI-DISPOSITIVO',
    description:
      'Alternativas modernas com backup criptografado, interface limpa e funcionamento 100% offline sem exigir cadastro complexo.',
    platforms: 'Android (Google Play) e iPhone (App Store)',
    androidUrl: 'https://play.google.com/store/apps/details?id=com.twofasapp',
    iosUrl: 'https://apps.apple.com/br/app/2fas-auth/id1217793794',
  },
  {
    name: 'Bitwarden / 1Password',
    badge: 'COFRE CORPORATIVO INTEGRADO',
    description:
      'Se você ou sua empresa já utilizam um gerenciador de senhas corporativo, ele também pode ler o QR Code e gerar os códigos de 6 dígitos automaticamente.',
    platforms: 'Android, iPhone, Windows e Mac',
    androidUrl: 'https://bitwarden.com/download/',
    iosUrl: 'https://1password.com/downloads/',
  },
];

export default function TutorialAuthenticatorPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] py-10 px-4 sm:px-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Topo / Voltar ao Login */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/login"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-100 border border-[#E2E8F0] text-xs font-extrabold text-[#0F172A] shadow-sm transition-all"
          >
            <ArrowLeft size={15} /> Voltar para a Tela de Login
          </Link>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-[#8B6508] text-[11px] font-extrabold uppercase tracking-wider">
            <Crown size={13} className="text-[#B8860B]" /> Protocolo de Segurança Padrão Ouro · INHO &amp; Orbe Systems
          </div>
        </div>

        {/* Hero Explicativo: Por que usamos isso? */}
        <div className="bg-white rounded-3xl p-6 sm:p-9 border border-[#E2E8F0] shadow-sm space-y-5 relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-[#9A6F0B] via-[#D4AF37] to-[#059669]" />
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-extrabold uppercase">
            <ShieldCheck size={15} /> Guia Didático de Primeiro Acesso (2FA Authenticator)
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-[#0F172A]">
            Como Configurar e Usar o Aplicativo Authenticator no Portal INHO
          </h1>
          <p className="text-sm sm:text-base text-[#475569] leading-relaxed">
            No ecossistema <strong>INHO &amp; Orbe Systems</strong>, você lida com informações financeiras críticas, faturas PIX,
            cadastros de cooperados, clientes e documentos protegidos pela <strong>LGPD</strong>. Por isso, utilizamos a{' '}
            <strong>Autenticação em Duas Etapas (2FA via Aplicativo Authenticator)</strong> em todos os logins.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-1.5">
              <div className="text-xs font-extrabold text-[#8B6508] uppercase flex items-center gap-1.5">
                <Lock size={15} /> 1. Proteção Contra Senhas Vazadas
              </div>
              <p className="text-xs text-[#475569] leading-relaxed">
                Mesmo que alguém descubra ou anote a sua senha, <strong>ninguém consegue entrar na sua conta</strong> sem o código
                temporário de 6 dígitos gerado exclusivamente no seu celular.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-1.5">
              <div className="text-xs font-extrabold text-emerald-700 uppercase flex items-center gap-1.5">
                <Smartphone size={15} /> 2. Muito Mais Seguro que SMS
              </div>
              <p className="text-xs text-[#475569] leading-relaxed">
                Códigos por SMS ou e-mail podem ser interceptados por golpes de clonagem de chip (<em>SIM Swap</em>). O aplicativo
                Authenticator gera o código <strong>100% dentro do seu aparelho, mesmo sem internet ou sinal de operadora</strong>.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-1.5">
              <div className="text-xs font-extrabold text-sky-700 uppercase flex items-center gap-1.5">
                <CheckCircle2 size={15} /> 3. Rápido e Melhor para Você
              </div>
              <p className="text-xs text-[#475569] leading-relaxed">
                Você só escaneia o QR Code <strong>uma única vez</strong> no primeiro acesso. Nos próximos logins, basta abrir o app
                e digitar os 6 números em menos de 5 segundos.
              </p>
            </div>
          </div>
        </div>

        {/* Passo a Passo Didático em 4 Etapas */}
        <div className="bg-white rounded-3xl p-6 sm:p-9 border border-[#E2E8F0] shadow-sm space-y-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-[#0F172A] flex items-center gap-2">
              <QrCode size={22} className="text-[#B8860B]" /> Passo a Passo: Como Fazer no Seu Primeiro Login
            </h2>
            <p className="text-xs sm:text-sm text-[#64748B] mt-1">
              Siga estas 4 etapas simples para vincular sua conta em menos de 1 minuto:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-amber-50/50 border border-amber-200 space-y-2">
              <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#B8860B] text-white text-[10px] font-extrabold uppercase">
                Passo 1 · No seu Celular
              </span>
              <h3 className="text-base font-extrabold text-[#0F172A]">Baixe um App Authenticator Gratuito</h3>
              <p className="text-xs text-[#475569] leading-relaxed">
                Instale o <strong>Google Authenticator</strong> ou o <strong>Microsoft Authenticator</strong> na loja do seu celular
                (veja a lista de links oficiais logo abaixo). Não é necessário pagar nada.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-amber-50/50 border border-amber-200 space-y-2">
              <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#B8860B] text-white text-[10px] font-extrabold uppercase">
                Passo 2 · Escaneie o QR Code
              </span>
              <h3 className="text-base font-extrabold text-[#0F172A]">Aponte a Câmera do App para a Tela</h3>
              <p className="text-xs text-[#475569] leading-relaxed">
                Abra o aplicativo no celular, toque no botão <strong>&ldquo;+&rdquo;</strong> e escolha{' '}
                <strong>&ldquo;Ler código QR&rdquo;</strong>. Aponte a câmera para o QR Code exibido na tela de login do Portal INHO.
                <br />
                <span className="text-[11px] text-[#8B6508] font-semibold">
                  (Se estiver acessando pelo próprio celular, basta copiar a &ldquo;Chave manual&rdquo; abaixo do QR Code e escolher
                  &ldquo;Inserir chave de configuração&rdquo; no app.)
                </span>
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-emerald-50/50 border border-emerald-200 space-y-2">
              <span className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-700 text-white text-[10px] font-extrabold uppercase">
                Passo 3 · Digite os 6 Dígitos
              </span>
              <h3 className="text-base font-extrabold text-[#0F172A]">Informe o Código Temporário</h3>
              <p className="text-xs text-[#475569] leading-relaxed">
                Assim que ler o QR Code, o aplicativo criará uma linha chamada <strong>INHO Platform</strong> com um número de{' '}
                <strong>6 dígitos</strong> que muda a cada 30 segundos. Digite esses 6 números no campo da tela de login.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-emerald-50/50 border border-emerald-200 space-y-2">
              <span className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-700 text-white text-[10px] font-extrabold uppercase">
                Passo 4 · Códigos de Emergência &amp; Nova Senha
              </span>
              <h3 className="text-base font-extrabold text-[#0F172A]">Guarde o Backup e Defina sua Senha Pessoal</h3>
              <p className="text-xs text-[#475569] leading-relaxed">
                Anote ou tire print dos <strong>8 Códigos de Emergência</strong> exibidos na tela (eles servem para você entrar caso
                perca o celular). Em seguida, cadastre a sua <strong>nova senha pessoal</strong> e pronto!
              </p>
            </div>
          </div>
        </div>

        {/* Principais Aplicativos Recomendados */}
        <div className="bg-white rounded-3xl p-6 sm:p-9 border border-[#E2E8F0] shadow-sm space-y-5">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-[#0F172A] flex items-center gap-2">
              <Smartphone size={22} className="text-[#B8860B]" /> Principais Aplicativos Authenticator Compatíveis
            </h2>
            <p className="text-xs sm:text-sm text-[#64748B] mt-1">
              Qualquer aplicativo compatível com o padrão internacional <strong>TOTP (RFC 6238)</strong> funciona perfeitamente no INHO:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {RECOMMENDED_APPS.map((app) => (
              <div
                key={app.name}
                className="p-5 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2">
                  <span className="inline-block px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-[#8B6508] text-[10px] font-extrabold uppercase">
                    {app.badge}
                  </span>
                  <h3 className="text-lg font-extrabold text-[#0F172A]">{app.name}</h3>
                  <p className="text-xs text-[#475569] leading-relaxed">{app.description}</p>
                  <p className="text-[11px] font-bold text-slate-500">Disponível para: {app.platforms}</p>
                </div>

                <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-200">
                  <a
                    href={app.androidUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-bold"
                  >
                    Android / Google Play <ExternalLink size={11} />
                  </a>
                  <a
                    href={app.iosUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-900 border border-slate-300 text-[11px] font-bold"
                  >
                    iPhone / App Store <ExternalLink size={11} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ / Dicas Úteis */}
        <div className="bg-white rounded-3xl p-6 sm:p-9 border border-[#E2E8F0] shadow-sm space-y-4">
          <h2 className="text-lg sm:text-xl font-black text-[#0F172A] flex items-center gap-2">
            <HelpCircle size={20} className="text-[#B8860B]" /> Dúvidas Frequentes (Solução Rápida)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-[#475569]">
            <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-1">
              <div className="font-extrabold text-[#0F172A] flex items-center gap-1.5">
                <Clock size={14} className="text-[#B8860B]" /> O código de 6 dígitos deu &ldquo;inválido ou expirado&rdquo;?
              </div>
              <p className="leading-relaxed">
                Verifique se a <strong>Data e Hora Automáticas</strong> estão ativadas nas configurações do seu celular. Como o código
                muda a cada 30 segundos, relógios atrasados em mais de 1 minuto geram códigos fora de sincronia.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-1">
              <div className="font-extrabold text-[#0F172A] flex items-center gap-1.5">
                <KeyRound size={14} className="text-emerald-700" /> Troquei ou perdi meu celular. Como faço login?
              </div>
              <p className="leading-relaxed">
                Use qualquer um dos seus <strong>8 Códigos de Emergência</strong> no próprio campo do código 2FA na tela de login, ou
                solicite ao administrador da sua empresa o reset de MFA no painel executivo.
              </p>
            </div>
          </div>

          <div className="pt-4 flex justify-center">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#9A6F0B] via-[#C59B27] to-[#9A6F0B] text-white text-xs font-extrabold uppercase tracking-wider shadow-md hover:brightness-105 transition-all"
            >
              <ArrowLeft size={15} /> Voltar ao Login e Concluir Meu Acesso
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

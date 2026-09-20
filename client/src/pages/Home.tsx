import { useMemo, useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { startLogin } from "@/const";
import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  BellRing,
  Check,
  ChevronDown,
  CircleDollarSign,
  ClipboardCheck,
  Clock3,
  CreditCard,
  ExternalLink,
  LockKeyhole,
  Menu,
  MessageSquareText,
  MoveRight,
  Play,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Target,
  WalletCards,
  X,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLocation } from "wouter";

const faqs = [
  {
    q: "Como eu acesso?",
    a: "Você recebe o acesso logo após a compra e abre o Radar de Dívidas pelo navegador do celular.",
  },
  {
    q: "É um curso em vídeo?",
    a: "Não. É uma ferramenta interativa que organiza seus dados e entrega um plano inicial.",
  },
  {
    q: "Quanto tempo leva para ver resultado?",
    a: "O diagnóstico leva até 30 minutos. Ao terminar, você já recebe uma ordem inicial para os próximos sete dias.",
  },
  {
    q: "Preciso de experiência com finanças?",
    a: "Não. O app explica cada pergunta em linguagem simples e aceita valores aproximados quando você não souber algum número.",
  },
  {
    q: "Funciona no celular?",
    a: "Sim. O produto foi pensado para ser usado no celular, sem planilha ou programa complicado.",
  },
  {
    q: "E se eu tiver muita dívida?",
    a: "Você informa as principais contas e o sistema ajuda a separar pressão, vencimento e prioridade. Ele não promete quitar tudo.",
  },
  {
    q: "O Radar garante desconto com o banco?",
    a: "Não. Ele prepara sua decisão e suas perguntas, mas a proposta depende do banco e do seu contrato.",
  },
  {
    q: "Preciso fazer outro empréstimo para seguir o plano?",
    a: "Não. O método foi criado para organizar o que você já tem e evitar decisões tomadas no desespero.",
  },
];

const debts = [
  { label: "Cartão principal", value: 2470, pressure: 86, color: "coral" },
  { label: "Empréstimo pessoal", value: 5100, pressure: 62, color: "blue" },
  { label: "Conta atrasada", value: 860, pressure: 43, color: "slate" },
];

function formatBRL(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  }).format(value);
}

function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function Home() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [faqOpen, setFaqOpen] = useState<number | null>(0);
  const [income, setIncome] = useState("4200");
  const [cash, setCash] = useState("780");
  const [showResult, setShowResult] = useState(false);

  const totalDebt = useMemo(() => debts.reduce((sum, debt) => sum + debt.value, 0), []);
  const cashNumber = Number(cash.replace(/\D/g, "")) || 0;
  const incomeNumber = Number(income.replace(/\D/g, "")) || 0;
  const available = Math.max(cashNumber - Math.round(incomeNumber * 0.08), 0);

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#f8f5ef] text-[#102d3c] selection:bg-[#ff7a61]/20">
      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[#102d3c]/95 text-white backdrop-blur-xl">
        <div className="mx-auto flex h-[72px] max-w-[1240px] items-center justify-between px-5 lg:px-8">
          <button className="group flex items-center gap-3" onClick={() => scrollToSection("top")} aria-label="Voltar ao topo">
            <span className="grid size-10 place-items-center rounded-xl bg-[#ff7a61] text-[#102d3c] shadow-[0_10px_26px_rgba(255,122,97,.24)] transition-transform duration-200 group-hover:-rotate-6">
              <RadarIcon />
            </span>
            <span className="text-left leading-none">
              <span className="block font-display text-[17px] font-extrabold tracking-[-0.04em]">RADAR DE</span>
              <span className="block font-display text-[17px] font-extrabold tracking-[-0.04em] text-[#ff957e]">DÍVIDAS</span>
            </span>
          </button>

          <nav className="hidden items-center gap-8 text-[13px] font-semibold text-white/70 md:flex">
            <button className="transition-colors hover:text-white" onClick={() => scrollToSection("como-funciona")}>Como funciona</button>
            <button className="transition-colors hover:text-white" onClick={() => scrollToSection("bonus")}>O que você recebe</button>
            <button className="transition-colors hover:text-white" onClick={() => scrollToSection("faq")}>Dúvidas</button>
            <button className="rounded-full border border-white/20 px-4 py-2 text-white transition-all hover:border-[#ff957e] hover:bg-white/10" onClick={() => user ? setLocation("/app") : startLogin()}>{user ? "Abrir app" : "Entrar"}</button>
          </nav>

          <button className="rounded-lg p-2 text-white md:hidden" onClick={() => setMenuOpen((open) => !open)} aria-label="Abrir menu">
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
        {menuOpen && (
          <div className="border-t border-white/10 bg-[#102d3c] px-5 py-4 md:hidden">
            <div className="flex flex-col gap-3 text-sm font-semibold text-white/80">
              <button className="py-2 text-left" onClick={() => { scrollToSection("como-funciona"); setMenuOpen(false); }}>Como funciona</button>
              <button className="py-2 text-left" onClick={() => { scrollToSection("bonus"); setMenuOpen(false); }}>O que você recebe</button>
              <button className="py-2 text-left" onClick={() => { scrollToSection("faq"); setMenuOpen(false); }}>Dúvidas</button>
              <button className="rounded-lg bg-[#ff7a61] px-4 py-3 text-left font-extrabold text-[#102d3c]" onClick={() => { user ? setLocation("/app") : startLogin(); setMenuOpen(false); }}>{user ? "Abrir app" : "Entrar"}</button>
            </div>
          </div>
        )}
      </header>

      <main id="top">
        <section className="relative isolate overflow-hidden bg-[#102d3c] pt-[120px] text-white">
          <div className="absolute inset-0 -z-10 opacity-80" style={{ backgroundImage: "radial-gradient(circle at 20% 15%, rgba(255,149,126,.19), transparent 28%), radial-gradient(circle at 90% 16%, rgba(88,167,190,.18), transparent 22%), linear-gradient(120deg, transparent 0 60%, rgba(255,255,255,.03) 60% 60.2%, transparent 60.2%)" }} />
          <div className="absolute -right-36 top-28 -z-10 size-[500px] rounded-full border border-white/10 opacity-50" />
          <div className="absolute -right-12 top-44 -z-10 size-[300px] rounded-full border border-[#ff957e]/20 opacity-60" />
          <div className="mx-auto grid max-w-[1240px] gap-14 px-5 pb-20 lg:grid-cols-[.92fr_1.08fr] lg:items-center lg:px-8 lg:pb-28">
            <div className="max-w-[590px]">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#ff957e]/30 bg-[#ff957e]/10 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-[#ffb19f]"><Sparkles size={13} /> Primeiro socorro financeiro</div>
              <h1 className="max-w-[620px] font-display text-[clamp(2.8rem,7vw,5.8rem)] font-extrabold leading-[.93] tracking-[-0.07em]">Acabe com o medo de <span className="text-[#ff957e]">pagar a conta errada.</span></h1>
              <p className="mt-7 max-w-[520px] text-[17px] leading-7 text-white/72 md:text-[19px]">O Radar de Dívidas cruza seus números e mostra qual conta merece atenção primeiro, sem outro empréstimo.</p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Button className="h-14 rounded-xl bg-[#ff7a61] px-6 text-[15px] font-extrabold text-[#102d3c] shadow-[0_14px_30px_rgba(255,122,97,.24)] hover:bg-[#ff927e]" onClick={() => scrollToSection("simulador")}>Ver como funciona <ArrowRight className="ml-2" size={18} /></Button>
                <button className="group flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold text-white/70 transition-colors hover:text-white" onClick={() => scrollToSection("como-funciona")}><span className="grid size-8 place-items-center rounded-full border border-white/25 group-hover:border-[#ff957e]"><Play size={12} fill="currentColor" /></span> Leva menos de 30 minutos</button>
              </div>
              <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-xs font-semibold text-white/55">
                <span className="flex items-center gap-2"><LockKeyhole size={14} className="text-[#ff957e]" /> Seus dados ficam protegidos</span>
                <span className="flex items-center gap-2"><ShieldCheck size={14} className="text-[#ff957e]" /> Garantia de 7 dias</span>
              </div>
            </div>

            <div id="simulador" className="relative lg:pl-8">
              <div className="absolute -inset-8 rounded-[36px] bg-[#ff7a61]/10 blur-3xl" />
              <div className="relative overflow-hidden rounded-[28px] border border-white/15 bg-[#f7f4ee] p-3 text-[#102d3c] shadow-[0_35px_90px_rgba(0,0,0,.28)] sm:p-4">
                <div className="rounded-[21px] bg-white p-5 sm:p-7">
                  <div className="mb-6 flex items-start justify-between gap-3">
                    <div><p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#ff7a61]">Seu diagnóstico</p><h2 className="mt-1 font-display text-2xl font-extrabold tracking-[-0.05em]">Pare de decidir no susto.</h2></div>
                    <span className="grid size-10 place-items-center rounded-xl bg-[#e9f2f0] text-[#176179]"><BarChart3 size={20} /></span>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="block"><span className="mb-2 block text-xs font-bold text-[#59717a]">Renda mensal</span><div className="relative"><span className="absolute left-3 top-3 text-sm font-bold text-[#97a6aa]">R$</span><Input value={income} onChange={(e) => setIncome(e.target.value)} className="h-11 rounded-xl border-[#dce6e5] pl-10 font-bold text-[#102d3c] focus-visible:ring-[#ff7a61]" inputMode="numeric" /></div></label>
                    <label className="block"><span className="mb-2 block text-xs font-bold text-[#59717a]">Dinheiro disponível</span><div className="relative"><span className="absolute left-3 top-3 text-sm font-bold text-[#97a6aa]">R$</span><Input value={cash} onChange={(e) => setCash(e.target.value)} className="h-11 rounded-xl border-[#dce6e5] pl-10 font-bold text-[#102d3c] focus-visible:ring-[#ff7a61]" inputMode="numeric" /></div></label>
                  </div>
                  <div className="mt-6 rounded-2xl bg-[#f5f7f4] p-4">
                    <div className="mb-3 flex items-center justify-between"><span className="text-xs font-extrabold uppercase tracking-[0.12em] text-[#59717a]">Pressão das contas</span><span className="rounded-full bg-[#ffebe6] px-2 py-1 text-[10px] font-extrabold text-[#db5c43]">AGORA</span></div>
                    <div className="space-y-4">
                      {debts.map((debt) => <DebtRow key={debt.label} {...debt} />)}
                    </div>
                  </div>
                  <div className="mt-5 flex items-center justify-between border-t border-[#e7edeb] pt-5"><div><span className="block text-xs font-semibold text-[#7b8c91]">Total informado</span><strong className="font-display text-2xl tracking-[-0.04em]">{formatBRL(totalDebt)}</strong></div><Button className="h-11 rounded-xl bg-[#102d3c] px-4 text-xs font-extrabold text-white hover:bg-[#194a5e]" onClick={() => setShowResult(true)}>{showResult ? "Diagnóstico pronto" : "Rodar diagnóstico"} <Zap size={14} className="ml-2" /></Button></div>
                  {showResult && <div className="mt-4 rounded-xl border border-[#bfe4d7] bg-[#eaf8f3] p-3 text-xs font-bold leading-5 text-[#236c57]">Sua primeira frente: <span className="text-[#102d3c]">Cartão principal.</span> Com {formatBRL(available)} disponíveis no mês, evite espalhar o dinheiro em todas as contas. Abra o plano de 7 dias.</div>}
                </div>
                <div className="flex items-center justify-between px-3 py-3 text-[10px] font-bold uppercase tracking-[0.12em] text-[#6e8084]"><span className="flex items-center gap-1.5"><CircleDollarSign size={13} /> Feito para a vida real</span><span>Dados aproximados funcionam</span></div>
              </div>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-10 bg-[#f8f5ef]" style={{ clipPath: "ellipse(70% 100% at 50% 100%)" }} />
        </section>

        <section className="bg-[#f8f5ef] py-20 lg:py-28">
          <div className="mx-auto max-w-[1080px] px-5 lg:px-8">
            <div className="mx-auto max-w-[680px] text-center"><p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#e36c55]">Você não está sem força</p><h2 className="mt-4 font-display text-4xl font-extrabold leading-[.98] tracking-[-0.06em] text-[#102d3c] md:text-5xl">Você está tentando resolver uma bagunça sem ordem.</h2><p className="mt-5 text-[16px] leading-7 text-[#59717a]">Planilhas e promessas de cortar tudo não ajudam quando cartão, vencimento e juros parecem urgentes ao mesmo tempo.</p></div>
            <div className="mt-14 grid gap-4 md:grid-cols-3"><PainCard icon={<CreditCard size={21} />} title="Você paga e a dívida não mexe" text="A conta mais barulhenta leva seu dinheiro. A mais cara continua crescendo." /><PainCard icon={<BellRing size={21} />} title="A próxima notificação trava você" text="Cada alerta do banco traz um aperto no peito e nenhuma decisão clara." /><PainCard icon={<RotateCcw size={21} />} title="Você volta para o mesmo buraco" text="Você tenta se organizar, mas não sabe qual conta merece atenção primeiro." /></div>
          </div>
        </section>

        <section id="como-funciona" className="bg-white py-20 lg:py-28">
          <div className="mx-auto max-w-[1120px] px-5 lg:px-8"><div className="grid gap-12 lg:grid-cols-[.8fr_1.2fr] lg:items-end"><div><p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#e36c55]">Como funciona</p><h2 className="mt-4 max-w-[500px] font-display text-4xl font-extrabold leading-[.98] tracking-[-0.06em] text-[#102d3c] md:text-5xl">Três passos para sair da confusão.</h2></div><p className="max-w-[450px] text-[16px] leading-7 text-[#59717a]">Você coloca os números que já conhece. O sistema faz o trabalho pesado e devolve uma sequência que cabe no seu momento.</p></div>
            <div className="mt-14 grid gap-4 md:grid-cols-3"><Step number="01" icon={<ClipboardCheck size={22} />} title="Seus números" text="Responda perguntas curtas sobre renda, dívidas, vencimentos e despesas essenciais." /><Step number="02" icon={<BarChart3 size={22} />} title="Ordem de pressão" text="O sistema cruza seus dados e mostra quais contas podem apertar mais seu mês." /><Step number="03" icon={<Target size={22} />} title="Plano de 7 dias" text="Receba as primeiras ações, perguntas para o banco e o que acompanhar depois." /></div>
          </div>
        </section>

        <section id="bonus" className="bg-[#e9f2f0] py-20 lg:py-28">
          <div className="mx-auto max-w-[1120px] px-5 lg:px-8"><div className="flex flex-col justify-between gap-5 md:flex-row md:items-end"><div><p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#227188]">Além do Radar</p><h2 className="mt-4 max-w-[600px] font-display text-4xl font-extrabold leading-[.98] tracking-[-0.06em] text-[#102d3c] md:text-5xl">Você recebe ferramentas para não travar no próximo passo.</h2></div><span className="max-w-[240px] text-sm font-semibold leading-6 text-[#59717a]">Tudo interativo. Tudo feito para abrir no celular.</span></div>
            <div className="mt-14 grid gap-4 sm:grid-cols-2"><Bonus icon={<WalletCards size={21} />} label="Bônus 01" title="Mapa do Alívio" text="Separe o que precisa ser protegido antes de pagar qualquer dívida." /><Bonus icon={<MessageSquareText size={21} />} label="Bônus 02" title="Gerador de Perguntas" text="Entre em contato com o banco sabendo exatamente o que perguntar." /><Bonus icon={<CircleDollarSign size={21} />} label="Bônus 03" title="Simulador de Acordo" text="Compare parcelas e custo total antes de dizer sim." /><Bonus icon={<BellRing size={21} />} label="Bônus 04" title="Alerta de Bola de Neve" text="Identifique decisões que aliviam hoje e apertam amanhã." /></div>
          </div>
        </section>

        <section className="bg-[#102d3c] py-20 text-white lg:py-28"><div className="mx-auto max-w-[1120px] px-5 lg:px-8"><div className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:items-center"><div><p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#ff957e]">Feito para vida real</p><h2 className="mt-4 max-w-[560px] font-display text-4xl font-extrabold leading-[.98] tracking-[-0.06em] md:text-5xl">Você não precisa saber tudo. Precisa saber o próximo passo.</h2><p className="mt-6 max-w-[490px] text-[16px] leading-7 text-white/65">O Radar aceita valores aproximados, não pede planilhas complicadas e não promete o que depende do banco.</p><div className="mt-8 space-y-4"><CheckLine text="Sem fórmula de Excel" /><CheckLine text="Sem promessa de desconto garantido" /><CheckLine text="Sem outro empréstimo para começar" /></div></div><div className="relative rounded-[26px] border border-white/10 bg-white/[.06] p-6 sm:p-8"><div className="absolute right-7 top-7 grid size-11 place-items-center rounded-2xl bg-[#ff7a61] text-[#102d3c]"><BadgeCheck size={22} /></div><p className="max-w-[260px] text-sm font-bold uppercase tracking-[0.14em] text-[#ffb19f]">Resultado do diagnóstico</p><div className="mt-10 flex items-end justify-between border-b border-white/10 pb-5"><div><span className="block text-sm text-white/55">Primeira frente</span><strong className="font-display text-3xl tracking-[-0.05em]">Cartão principal</strong></div><span className="rounded-full bg-[#ff7a61] px-3 py-1.5 text-xs font-extrabold text-[#102d3c]">86% pressão</span></div><div className="space-y-5 pt-6"><Progress label="Ação nesta semana" value="Negociar antes do vencimento" progress={86} /><Progress label="O que não fazer" value="Pagar mínimo e usar limite" progress={32} /><Progress label="Próxima revisão" value="Em 7 dias" progress={54} /></div></div></div></div></section>

        <section id="oferta" className="bg-[#f8f5ef] py-20 lg:py-28"><div className="mx-auto max-w-[900px] px-5 lg:px-8"><div className="overflow-hidden rounded-[30px] border border-[#dce6e5] bg-white shadow-[0_25px_80px_rgba(16,45,60,.10)]"><div className="grid lg:grid-cols-[1.1fr_.9fr]"><div className="p-7 sm:p-10"><div className="inline-flex items-center gap-2 rounded-full bg-[#eaf8f3] px-3 py-1.5 text-xs font-extrabold text-[#236c57]"><ShieldCheck size={14} /> Garantia de 7 dias</div><h2 className="mt-5 font-display text-4xl font-extrabold leading-[.98] tracking-[-0.06em] text-[#102d3c]">Pare de pagar no escuro.</h2><p className="mt-5 max-w-[460px] text-[16px] leading-7 text-[#59717a]">Abra, teste e veja se o Radar ajuda você a enxergar o primeiro movimento.</p><div className="mt-8 space-y-3"><Feature text="Diagnóstico interativo de dívidas" /><Feature text="Plano inicial de sete dias" /><Feature text="Mapa do Alívio" /><Feature text="Gerador de Perguntas" /><Feature text="Simulador de Acordo" /></div></div><div className="flex flex-col justify-between bg-[#102d3c] p-7 text-white sm:p-10"><div><p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#ff957e]">Acesso imediato</p><div className="mt-5 flex items-end gap-3"><span className="text-lg text-white/45 line-through">R$ 197</span><strong className="font-display text-6xl font-extrabold tracking-[-0.08em]">R$ 47</strong></div><p className="mt-2 text-sm text-white/55">Pagamento único. Sem mensalidade escondida.</p></div><div className="mt-10"><Button className="h-14 w-full rounded-xl bg-[#ff7a61] text-[15px] font-extrabold text-[#102d3c] shadow-[0_14px_30px_rgba(255,122,97,.2)] hover:bg-[#ff927e]" onClick={() => setShowResult(true)}>Quero ordenar minhas dívidas <ArrowRight size={18} className="ml-2" /></Button><p className="mt-4 flex items-center justify-center gap-2 text-center text-[11px] font-bold text-white/45"><LockKeyhole size={13} /> Compra segura e acesso pelo navegador</p></div></div></div></div></div></section>

        <section id="faq" className="bg-white py-20 lg:py-28"><div className="mx-auto max-w-[900px] px-5 lg:px-8"><div className="text-center"><p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#e36c55]">Perguntas frequentes</p><h2 className="mt-4 font-display text-4xl font-extrabold tracking-[-0.06em] text-[#102d3c] md:text-5xl">Antes de abrir o Radar.</h2></div><div className="mt-12 divide-y divide-[#e4ebea] border-y border-[#e4ebea]">{faqs.map((faq, index) => <div key={faq.q}><button className="flex w-full items-center justify-between gap-5 py-5 text-left text-[15px] font-extrabold text-[#102d3c]" onClick={() => setFaqOpen(faqOpen === index ? null : index)}><span>{faq.q}</span><ChevronDown className={`shrink-0 text-[#e36c55] transition-transform duration-200 ${faqOpen === index ? "rotate-180" : ""}`} size={19} /></button>{faqOpen === index && <p className="max-w-[760px] pb-5 pr-10 text-[14px] leading-6 text-[#59717a]">{faq.a}</p>}</div>)}</div></div></section>

        <section className="bg-[#ffebe6] py-20 lg:py-24"><div className="mx-auto max-w-[760px] px-5 text-center lg:px-8"><div className="mx-auto grid size-14 place-items-center rounded-2xl bg-[#102d3c] text-[#ff957e]"><ArrowRight size={25} /></div><h2 className="mt-7 font-display text-4xl font-extrabold leading-[.98] tracking-[-0.06em] text-[#102d3c] md:text-5xl">Não deixe a próxima fatura escolher por você.</h2><p className="mx-auto mt-5 max-w-[550px] text-[16px] leading-7 text-[#59717a]">Abra o Radar, coloque seus números e descubra qual é o primeiro passo.</p><Button className="mt-8 h-14 rounded-xl bg-[#102d3c] px-7 text-[15px] font-extrabold text-white shadow-[0_14px_30px_rgba(16,45,60,.2)] hover:bg-[#194a5e]" onClick={() => scrollToSection("oferta")}>Recuperar o controle agora <MoveRight className="ml-2" size={18} /></Button></div></section>
      </main>

      <footer className="bg-[#102d3c] px-5 py-8 text-white/50"><div className="mx-auto flex max-w-[1120px] flex-col gap-4 text-xs font-semibold sm:flex-row sm:items-center sm:justify-between"><span>Radar de Dívidas © 2026</span><span>Uma ferramenta educativa. Não substitui orientação financeira ou jurídica.</span><button className="flex items-center gap-1.5 text-left transition-colors hover:text-white" onClick={() => scrollToSection("top")}>Voltar ao topo <ExternalLink size={12} /></button></div></footer>
    </div>
  );
}

function RadarIcon() {
  return <span className="relative block size-5"><span className="absolute inset-0 rounded-full border-[2px] border-current" /><span className="absolute left-1/2 top-1/2 size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-current" /><span className="absolute left-1/2 top-1/2 h-[2px] w-3 origin-left -rotate-45 bg-current" /></span>;
}

function DebtRow({ label, value, pressure, color }: { label: string; value: number; pressure: number; color: string }) {
  return <div><div className="mb-1.5 flex items-center justify-between gap-3 text-xs font-bold"><span className="text-[#314d58]">{label}</span><span className="text-[#6c8187]">{formatBRL(value)}</span></div><div className="h-2 overflow-hidden rounded-full bg-[#e1e9e7]"><div className={`h-full rounded-full ${color === "coral" ? "bg-[#ff7a61]" : color === "blue" ? "bg-[#3e91a9]" : "bg-[#8ba6a7]"}`} style={{ width: `${pressure}%` }} /></div></div>;
}

function PainCard({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return <div className="rounded-2xl border border-[#e0e8e6] bg-white p-6 shadow-[0_12px_30px_rgba(16,45,60,.04)] transition-transform duration-200 hover:-translate-y-1"><span className="grid size-11 place-items-center rounded-xl bg-[#ffebe6] text-[#df684f]">{icon}</span><h3 className="mt-5 font-display text-xl font-extrabold leading-tight tracking-[-0.04em] text-[#102d3c]">{title}</h3><p className="mt-3 text-sm leading-6 text-[#6a7f85]">{text}</p></div>;
}

function Step({ number, icon, title, text }: { number: string; icon: React.ReactNode; title: string; text: string }) {
  return <div className="relative rounded-2xl border border-[#e0e8e6] bg-[#f8f5ef] p-6"><div className="flex items-center justify-between"><span className="font-display text-5xl font-extrabold tracking-[-0.08em] text-[#d6e6e3]">{number}</span><span className="grid size-11 place-items-center rounded-xl bg-[#102d3c] text-[#ff957e]">{icon}</span></div><h3 className="mt-8 font-display text-2xl font-extrabold tracking-[-0.05em] text-[#102d3c]">{title}</h3><p className="mt-3 text-sm leading-6 text-[#6a7f85]">{text}</p></div>;
}

function Bonus({ icon, label, title, text }: { icon: React.ReactNode; label: string; title: string; text: string }) {
  return <div className="group rounded-2xl border border-[#d3e3df] bg-white p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_16px_34px_rgba(16,45,60,.08)]"><div className="flex items-center justify-between"><span className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#e36c55]">{label}</span><span className="grid size-10 place-items-center rounded-xl bg-[#e9f2f0] text-[#227188] transition-colors group-hover:bg-[#102d3c] group-hover:text-[#ff957e]">{icon}</span></div><h3 className="mt-6 font-display text-2xl font-extrabold tracking-[-0.05em] text-[#102d3c]">{title}</h3><p className="mt-3 text-sm leading-6 text-[#6a7f85]">{text}</p><span className="mt-6 inline-flex items-center gap-1.5 text-xs font-extrabold text-[#227188]">Abrir ferramenta <ArrowRight size={14} /></span></div>;
}

function CheckLine({ text }: { text: string }) {
  return <div className="flex items-center gap-3 text-sm font-bold text-white/78"><span className="grid size-5 place-items-center rounded-full bg-[#ff7a61] text-[#102d3c]"><Check size={13} strokeWidth={3} /></span>{text}</div>;
}

function Progress({ label, value, progress }: { label: string; value: string; progress: number }) {
  return <div><div className="mb-2 flex items-center justify-between gap-3 text-xs"><span className="font-bold text-white/55">{label}</span><span className="font-extrabold text-white/90">{value}</span></div><div className="h-1.5 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-[#ff957e]" style={{ width: `${progress}%` }} /></div></div>;
}

function Feature({ text }: { text: string }) {
  return <div className="flex items-center gap-3 text-sm font-bold text-[#314d58]"><span className="grid size-5 place-items-center rounded-full bg-[#eaf8f3] text-[#236c57]"><Check size={13} strokeWidth={3} /></span>{text}</div>;
}

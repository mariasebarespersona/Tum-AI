'use client';

import { useState, useEffect, useRef } from 'react';
import {
  ArrowRight, ArrowUpRight, ChevronRight,
  TrendingUp, Shield, Eye, Zap,
  BarChart3, Bot, CreditCard, Building2, Wrench, Landmark, Calculator,
} from 'lucide-react';

// ═══════════════════════════════════════════════════════════════
// TUMAI — Marketing Website
// Design inspired by HappyRobot.ai: editorial serif headlines,
// first-line-black trick, video hero, outcomes-driven copy,
// services positioning (not SaaS self-serve).
// ═══════════════════════════════════════════════════════════════

const useCases = [
  {
    title: 'Payment Lifecycle',
    description: 'Generate recurring payments, track status automatically (scheduled → pending → late → paid), calculate late fees, and send reminders — all without manual intervention.',
    stats: ['8 automations', 'End-to-end'],
    icon: CreditCard,
    automations: 'recurring-payment-gen, payment-lifecycle, late-fee-calculator, payment-reminders',
  },
  {
    title: 'Property Evaluation',
    description: 'GPT-4 Vision inspects assets against checklists and scores condition. AI estimates renovation costs, recommends pricing based on comparables and historical data.',
    stats: ['ai-asset-inspector', 'ai-cost-estimator'],
    icon: Eye,
    automations: 'ai-asset-inspector, ai-cost-estimator, ai-price-analyzer, market-price-advisor',
  },
  {
    title: 'Market Scraping',
    description: 'Automated scraping of property listings from multiple sources with configurable filters. New matches delivered via email or WhatsApp alerts.',
    stats: ['JSON + Browser', 'Auto-dedup'],
    icon: BarChart3,
    automations: 'web-scraper-json, web-scraper-browser, screenshot-extractor, rules-engine',
  },
  {
    title: 'Investor Management',
    description: 'Track capital deployed, calculate returns (IRR, LTV, ROI), manage investor payouts, and generate periodic reports — automatically.',
    stats: ['capital-return-manager', 'investment-analyzer'],
    icon: TrendingUp,
    automations: 'investment-analyzer, capital-return-manager, financial-analyzer, periodic-report-gen',
  },
  {
    title: 'AI Transaction Classifier',
    description: 'GPT-4o classifies transactions to accounting categories automatically. Bank reconciliation with scoring by amount, date, and counterparty.',
    stats: ['ai-transaction-classifier', 'Learns over time'],
    icon: Bot,
    automations: 'ai-transaction-classifier, transaction-reconciler, ledger-sync',
  },
  {
    title: 'Document Generation',
    description: 'Auto-generate contracts, invoices, and reports as PDFs when business events happen. Upload to cloud storage with metadata tracking.',
    stats: ['pdf-generator', 'contract-pdf-gen'],
    icon: Eye,
    automations: 'pdf-generator, document-storage, contract-pdf-gen, periodic-report-gen',
  },
];

const caseStudies = [
  {
    company: 'Buy-Renovate-Sell Operation',
    industry: 'Real Estate',
    quote: 'Tumai automated our entire payment lifecycle — from generating recurring schedules to calculating late fees and sending reminders. The AI evaluates properties from photos before we even visit.',
    result: 'Full pipeline: scraping → evaluation → renovation → sale',
    person: 'Operations Director',
  },
  {
    company: 'Property Rental Portfolio',
    industry: 'Rental Management',
    quote: 'Every month, rent schedules generate automatically, late fees calculate on day 6, and delinquency scores update the portfolio risk dashboard. We spend zero time on payment admin.',
    result: 'Payment lifecycle fully automated',
    person: 'Portfolio Manager',
  },
  {
    company: 'Real Estate Lender',
    industry: 'Lending & Finance',
    quote: 'The affordability calculator screens every application, the investment analyzer evaluates every deal, and investor returns are tracked and distributed automatically.',
    result: 'Investor reporting on autopilot',
    person: 'Head of Capital',
  },
];

const deploymentPillars = [
  {
    number: '01',
    title: 'Discovery',
    description: 'We audit your operations and identify the workflows with the highest automation ROI — usually payments, client comms, and reporting.',
  },
  {
    number: '02',
    title: 'Deployment',
    description: 'Your AI agents go live within days, not months. Pre-built modules mean 80% of the work is already done.',
  },
  {
    number: '03',
    title: 'Continuous improvement',
    description: 'We monitor performance, tune the agents, and expand coverage as your business grows. You never manage the tech.',
  },
];

// Animated counter hook
function useCounter(target: number, duration: number = 2000, active: boolean = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!active) return;
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration, active]);
  return count;
}

export default function SitePage() {
  const [statsVisible, setStatsVisible] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const statsRef = useRef<HTMLDivElement>(null);

  // Scroll listener for navbar — check immediately + on scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 100);
    onScroll(); // check on mount
    window.addEventListener('scroll', onScroll, { passive: true });
    // Also listen on the document for delegated scroll
    document.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      document.removeEventListener('scroll', onScroll);
    };
  }, []);

  // Intersection observer for counter animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStatsVisible(true); },
      { threshold: 0.3 }
    );
    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  const automationCount = useCounter(36, 1500, statsVisible) || 36;
  const deployDays = useCounter(3, 1200, statsVisible) || 3;
  const successRate = useCounter(99, 1800, statsVisible) || 99;

  return (
    <div className="min-h-screen bg-[#FCFCFC] text-[#0E0D0C]" style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}>
      {/* Google Fonts */}
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet" />

      {/* ── NAVBAR ──────────────────────────────────── */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-xl border-b border-[#E5E5E5] shadow-sm'
          : 'bg-[#0E0D0C]/40 backdrop-blur-md'
      }`}>
        <div className="max-w-[1200px] mx-auto px-8 h-[56px] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className={`w-7 h-7 rounded-md flex items-center justify-center transition-colors duration-300 ${
              scrolled ? 'bg-[#0E0D0C]' : 'bg-white/15'
            }`}>
              <Zap size={14} className={scrolled ? 'text-white' : 'text-white'} />
            </div>
            <span style={{ fontFamily: "'DM Serif Display', Georgia, serif" }} className={`text-[18px] font-medium transition-colors duration-300 ${
              scrolled ? 'text-[#0E0D0C]' : 'text-white'
            }`}>
              Tumai
            </span>
          </div>
          <div className="hidden md:flex items-center gap-10" style={{ fontFamily: "'Inter', sans-serif" }}>
            {['Use Cases', 'How We Work', 'Results', 'About'].map(label => (
              <a key={label} href={`#${label.toLowerCase().replace(/\s+/g, '-')}`} className={`text-[13px] transition-colors ${
                scrolled ? 'text-[#858484] hover:text-[#0E0D0C]' : 'text-white/70 hover:text-white'
              }`}>{label}</a>
            ))}
          </div>
          <a
            href="mailto:hello@tumai.dev"
            className={`px-5 py-2 text-[13px] font-medium rounded-lg transition-all duration-300 ${
              scrolled
                ? 'bg-[#0E0D0C] text-white hover:bg-[#333]'
                : 'bg-white text-[#0E0D0C] hover:bg-white/90'
            }`}
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Book a demo
          </a>
        </div>
      </nav>

      {/* ── HERO — Full viewport video background ── */}
      <section className="relative flex" style={{ height: 'calc(100vh - 4.5rem)', marginTop: '3.5rem', marginLeft: '1rem', marginRight: '1rem', marginBottom: '1rem', overflow: 'hidden' }}>
        {/* Video background — fills entire hero */}
        <video
          autoPlay muted loop playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/videos/hero_montage.mp4" type="video/mp4" />
        </video>

        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/50 z-[1]" />

        {/* Content overlay — centered on video */}
        <div className="absolute inset-0 z-[2] flex flex-col items-center justify-center px-8" style={{ paddingBottom: '10%' }}>
          <div className="max-w-[62rem] text-center">
            <h1
              style={{ fontFamily: "'DM Serif Display', Georgia, serif", lineHeight: '0.95', letterSpacing: '-0.04em' }}
              className="text-white text-[56px] md:text-[80px] lg:text-[96px] mb-8"
            >
              The workforce that never{' '}
              <span className="text-[#858484]">clocks out</span>
            </h1>

            <p className="text-[17px] md:text-[19px] text-white/60 leading-[1.6] max-w-[36rem] mx-auto mb-10" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}>
              We deploy AI-powered teams that collect payments, answer customers, scan markets, and generate reports — while you focus on growing your business.
            </p>

            <div className="flex items-center justify-center gap-5" style={{ fontFamily: "'Inter', sans-serif" }}>
              <a
                href="mailto:hello@tumai.dev"
                className="group inline-flex items-center gap-3 px-7 py-3.5 bg-white text-[#0E0D0C] text-[15px] font-medium rounded-xl hover:bg-white/90 transition-all"
              >
                Book a demo
                <ArrowUpRight size={16} className="group-hover:rotate-45 transition-transform duration-200" />
              </a>
              <a
                href="#use-cases"
                className="inline-flex items-center gap-2 text-[15px] text-white/50 hover:text-white transition-colors"
              >
                See use cases
                <ChevronRight size={16} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar with subtle info */}
        <div className="absolute bottom-0 left-0 right-0 z-[3] px-10 py-6 flex items-end justify-between">
          <div className="flex items-center gap-8" style={{ fontFamily: "'Inter', sans-serif" }}>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-white/40 text-[12px]">36 automations live</span>
            </div>
            <span className="text-white/20 text-[12px]">Real Estate</span>
            <span className="text-white/20 text-[12px]">Lending</span>
            <span className="text-white/20 text-[12px]">Property Management</span>
          </div>
        </div>
      </section>

      {/* ── STATS BAR ───────────────────────────────── */}
      <section ref={statsRef} className="py-16 border-y border-[#F2F2F2] bg-[#FAFAFA]">
        <div className="max-w-[900px] mx-auto px-8 grid grid-cols-3 gap-8">
          {[
            { value: automationCount, suffix: '', label: 'Production-ready automations' },
            { value: deployDays, suffix: ' days', label: 'Average deployment time' },
            { value: successRate, suffix: '%', label: 'Execution success rate' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-[48px] font-light text-[#0E0D0C] tracking-tight" style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}>
                {stat.value}{stat.suffix}
              </p>
              <p className="text-[13px] text-[#858484] mt-2" style={{ fontFamily: "'Inter', sans-serif" }}>{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── AI WORKERS SECTION ──────────────────────── */}
      <section className="py-[120px] px-8">
        <div className="max-w-[1100px] mx-auto">
          <div className="max-w-[600px] mb-16">
            <p className="text-[13px] text-[#858484] tracking-[0.1em] uppercase mb-5" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500 }}>
              How it works
            </p>
            <h2
              style={{ fontFamily: "'DM Serif Display', Georgia, serif", lineHeight: '1.1', letterSpacing: '-0.02em' }}
              className="text-[40px] md:text-[48px] mb-6"
            >
              <span className="text-[#0E0D0C]">AI teams trained</span>{' '}
              <span className="text-[#858484]">on your playbook</span>
            </h2>
            <p className="text-[16px] text-[#858484] leading-[1.7]" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}>
              Every AI agent we deploy learns your rules, speaks your language, and executes across the tools you already use — from WhatsApp to Stripe to your database.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-6">
            {[
              {
                num: '01',
                title: 'Thinks before it acts',
                desc: 'Powered by GPT-4o, Vision AI, and Whisper. Makes contextual decisions — not just if/then rules.',
              },
              {
                num: '02',
                title: 'Follows your rules exactly',
                desc: 'Late fees, payment windows, qualification thresholds — your business logic encoded once, executed perfectly every time.',
              },
              {
                num: '03',
                title: 'Plugs into everything',
                desc: 'WhatsApp, email, Stripe, your CRM, your database. Takes real action — sends invoices, collects payments, answers clients.',
              },
            ].map((item) => (
              <div key={item.num} className="border border-[#F2F2F2] rounded-xl p-7 hover:border-[#E0E0E0] transition-colors bg-white">
                <span className="text-[13px] text-[#858484] font-medium" style={{ fontFamily: "'Inter', sans-serif" }}>{item.num}</span>
                <h3 className="text-[20px] text-[#0E0D0C] mt-4 mb-3" style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}>
                  {item.title}
                </h3>
                <p className="text-[14px] text-[#858484] leading-[1.7]" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Video banner between sections */}
          <div className="mt-16 rounded-2xl overflow-hidden relative aspect-[3/1]">
            <video autoPlay muted loop playsInline className="w-full h-full object-cover">
              <source src="/videos/v_banner1.mp4" type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-gradient-to-r from-[#0E0D0C]/70 via-[#0E0D0C]/30 to-transparent flex items-center">
              <div className="px-12">
                <p className="text-white/50 text-[12px] tracking-[0.15em] uppercase mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>Live infrastructure</p>
                <p className="text-white text-[24px]" style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}>
                  36 modules. 8 categories. Running 24/7.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── USE CASES ───────────────────────────────── */}
      <section id="use-cases" className="py-[120px] px-8 bg-[#FAFAFA]">
        <div className="max-w-[1100px] mx-auto">
          <div className="text-center mb-16">
            <p className="text-[13px] text-[#858484] tracking-[0.1em] uppercase mb-5" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500 }}>
              Use cases
            </p>
            <h2
              style={{ fontFamily: "'DM Serif Display', Georgia, serif", lineHeight: '1.1', letterSpacing: '-0.02em' }}
              className="text-[40px] md:text-[48px]"
            >
              <span className="text-[#0E0D0C]">What our clients</span>{' '}
              <span className="text-[#858484]">automate first</span>
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
            {useCases.map((uc) => {
              const Icon = uc.icon;
              return (
                <div key={uc.title} className="bg-white border border-[#F2F2F2] rounded-xl p-7 hover:shadow-lg hover:shadow-[#00000008] transition-all group">
                  <Icon size={24} className="text-[#0E0D0C] mb-5" strokeWidth={1.5} />
                  <h3 className="text-[18px] text-[#0E0D0C] mb-3" style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}>
                    {uc.title}
                  </h3>
                  <p className="text-[13px] text-[#858484] leading-[1.7] mb-5" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}>
                    {uc.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {uc.stats.map((stat) => (
                      <span key={stat} className="text-[11px] px-2.5 py-1 bg-[#F2F2F2] text-[#0E0D0C] rounded-md font-medium" style={{ fontFamily: "'Inter', sans-serif" }}>
                        {stat}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Video divider ──────────────────────────── */}
      <section className="px-8 py-4">
        <div className="max-w-[1100px] mx-auto rounded-2xl overflow-hidden relative aspect-[4/1]">
          <video autoPlay muted loop playsInline className="w-full h-full object-cover">
            <source src="/videos/v_banner2.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-l from-[#0E0D0C]/70 via-[#0E0D0C]/30 to-transparent flex items-center justify-end">
            <div className="px-12 text-right">
              <p className="text-white/50 text-[12px] tracking-[0.15em] uppercase mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>Real deployments</p>
              <p className="text-white text-[22px]" style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}>
                From zero to autonomous in under a week
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── PROVEN RESULTS ──────────────────────────── */}
      <section id="results" className="py-[120px] px-8">
        <div className="max-w-[1100px] mx-auto">
          <div className="max-w-[600px] mb-16">
            <p className="text-[13px] text-[#858484] tracking-[0.1em] uppercase mb-5" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500 }}>
              Proven results
            </p>
            <h2
              style={{ fontFamily: "'DM Serif Display', Georgia, serif", lineHeight: '1.1', letterSpacing: '-0.02em' }}
              className="text-[40px] md:text-[48px] mb-6"
            >
              <span className="text-[#0E0D0C]">Tested where</span>{' '}
              <span className="text-[#858484]">it matters</span>
            </h2>
            <p className="text-[16px] text-[#858484] leading-[1.7]" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}>
              Every module we deploy was forged in a live business — handling real money, real tenants, real deadlines. Not a prototype. Not a demo. The real thing.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-6">
            {caseStudies.map((cs) => (
              <div key={cs.company} className="border border-[#F2F2F2] rounded-xl p-7 bg-white flex flex-col">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-lg bg-[#F2F2F2] flex items-center justify-center">
                    <Bot size={18} className="text-[#858484]" />
                  </div>
                  <div>
                    <p className="text-[14px] text-[#0E0D0C] font-medium" style={{ fontFamily: "'Inter', sans-serif" }}>{cs.company}</p>
                    <p className="text-[11px] text-[#858484]" style={{ fontFamily: "'Inter', sans-serif" }}>{cs.industry}</p>
                  </div>
                </div>
                <p className="text-[14px] text-[#858484] leading-[1.7] italic flex-1 mb-5" style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}>
                  &ldquo;{cs.quote}&rdquo;
                </p>
                <div className="pt-5 border-t border-[#F2F2F2]">
                  <p className="text-[14px] text-[#0E0D0C] font-medium" style={{ fontFamily: "'Inter', sans-serif" }}>{cs.result}</p>
                  <p className="text-[11px] text-[#858484] mt-0.5" style={{ fontFamily: "'Inter', sans-serif" }}>{cs.person}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── VERTICALS ───────────────────────────────── */}
      <section className="py-[120px] px-8 bg-[#FAFAFA]">
        <div className="max-w-[1100px] mx-auto">
          <div className="text-center mb-16">
            <p className="text-[13px] text-[#858484] tracking-[0.1em] uppercase mb-5" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500 }}>
              Industry solutions
            </p>
            <h2
              style={{ fontFamily: "'DM Serif Display', Georgia, serif", lineHeight: '1.1', letterSpacing: '-0.02em' }}
              className="text-[40px] md:text-[48px]"
            >
              <span className="text-[#0E0D0C]">Pre-packaged</span>{' '}
              <span className="text-[#858484]">for your vertical</span>
            </h2>
            <p className="text-[16px] text-[#858484] leading-[1.7] max-w-[560px] mx-auto mt-6" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}>
              Each vertical comes with the right automations pre-connected, configured, and ready to deploy.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-5 mb-5">
            {[
              { name: 'Property Rental', icon: Building2, count: 20, desc: 'Rent collection, late fees, tenant screening, maintenance, monthly reports. Everything a property manager needs.', color: '#4f46e5' },
              { name: 'Buy-Renovate-Sell', icon: Wrench, count: 36, desc: 'Full pipeline: market scraping, property evaluation, renovation budgets, investor returns, contract lifecycle.', color: '#0891b2' },
              { name: 'Lending & Finance', icon: Landmark, count: 18, desc: 'Loan lifecycle, affordability checks, delinquency scoring, capital returns, investor reporting.', color: '#7c3aed' },
            ].map((v) => {
              const Icon = v.icon;
              return (
                <div key={v.name} className="bg-white rounded-2xl border border-[#F2F2F2] p-8 hover:shadow-lg hover:shadow-[#00000008] transition-all">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-6" style={{ backgroundColor: `${v.color}10` }}>
                    <Icon size={22} style={{ color: v.color }} strokeWidth={1.5} />
                  </div>
                  <h3 className="text-[18px] text-[#0E0D0C] mb-2" style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}>{v.name}</h3>
                  <p className="text-[13px] text-[#858484] leading-[1.7] mb-6" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}>{v.desc}</p>
                  <div className="flex items-center justify-between pt-5 border-t border-[#F2F2F2]">
                    <span className="text-[12px] text-[#858484] font-medium" style={{ fontFamily: "'Inter', sans-serif" }}>{v.count} automations included</span>
                    <a href="mailto:hello@tumai.dev" className="text-[12px] text-[#0E0D0C] font-medium hover:underline" style={{ fontFamily: "'Inter', sans-serif" }}>Learn more</a>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="grid grid-cols-2 gap-5">
            {[
              { name: 'Service Business', icon: Wrench, count: 15, desc: 'HVAC, plumbing, cleaning — quote with photos, invoice automatically, track payments.', color: '#059669' },
              { name: 'Accounting', icon: Calculator, count: 12, desc: 'AI transaction classification, bank reconciliation, automated ledger, periodic financial reports.', color: '#d97706' },
            ].map((v) => {
              const Icon = v.icon;
              return (
                <div key={v.name} className="bg-white rounded-2xl border border-[#F2F2F2] p-8 hover:shadow-lg hover:shadow-[#00000008] transition-all">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${v.color}10` }}>
                      <Icon size={22} style={{ color: v.color }} strokeWidth={1.5} />
                    </div>
                    <div>
                      <h3 className="text-[18px] text-[#0E0D0C]" style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}>{v.name}</h3>
                      <span className="text-[12px] text-[#858484]" style={{ fontFamily: "'Inter', sans-serif" }}>{v.count} automations</span>
                    </div>
                  </div>
                  <p className="text-[13px] text-[#858484] leading-[1.7]" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}>{v.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── THE NEW OPERATING MODEL ─────────────────── */}
      <section className="py-[120px] px-8 bg-[#0E0D0C]">
        <div className="max-w-[1100px] mx-auto">
          <div className="text-center mb-16">
            <p className="text-[13px] text-[#858484] tracking-[0.1em] uppercase mb-5" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500 }}>
              The new operating model
            </p>
            <h2
              style={{ fontFamily: "'DM Serif Display', Georgia, serif", lineHeight: '1.1', letterSpacing: '-0.02em' }}
              className="text-[40px] md:text-[48px] text-[#FCFCFC] mb-6"
            >
              One system,{' '}
              <span className="text-[#858484]">zero bottlenecks</span>
            </h2>
            <p className="text-[16px] text-[#858484] leading-[1.7] max-w-[560px] mx-auto" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}>
              Your AI team handles the repetitive work, captures data from every interaction, and surfaces the insights that drive growth.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-6">
            {[
              { title: 'Agents that take real action', desc: 'Not just alerts and dashboards. Your AI team sends invoices, follows up on payments, answers clients, and files reports.' },
              { title: 'Every conversation becomes data', desc: 'Each interaction is captured, classified, and stored — building a layer of business intelligence that compounds over time.' },
              { title: 'Insights you can act on today', desc: 'Custom dashboards show collection rates, delinquency trends, pipeline health — updated in real-time by your AI agents.' },
            ].map((item, i) => (
              <div key={item.title} className="border border-[#333] rounded-xl p-7">
                <span className="text-[13px] text-[#858484]" style={{ fontFamily: "'Inter', sans-serif" }}>0{i + 1}</span>
                <h3 className="text-[18px] text-[#FCFCFC] mt-4 mb-3" style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}>
                  {item.title}
                </h3>
                <p className="text-[14px] text-[#858484] leading-[1.7]" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── RELIABLE INFRASTRUCTURE ─────────────────── */}
      <section className="py-[120px] px-8">
        <div className="max-w-[1100px] mx-auto">
          <div className="text-center mb-16">
            <p className="text-[13px] text-[#858484] tracking-[0.1em] uppercase mb-5" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500 }}>
              Reliable infrastructure
            </p>
            <h2
              style={{ fontFamily: "'DM Serif Display', Georgia, serif", lineHeight: '1.1', letterSpacing: '-0.02em' }}
              className="text-[40px] md:text-[48px]"
            >
              <span className="text-[#0E0D0C]">Enterprise-grade</span>{' '}
              <span className="text-[#858484]">from day one</span>
            </h2>
          </div>

          <div className="grid grid-cols-3 gap-6">
            {[
              { icon: Eye, title: 'Fully transparent', desc: 'See every decision, every message, every data point. Execution logs with full audit trail.' },
              { icon: Shield, title: 'Your rules, always', desc: 'Business logic is explicit and configurable — not hidden in a neural network. You control the guardrails.' },
              { icon: TrendingUp, title: 'Grows with you', desc: 'From 10 contracts to 10,000. Cloud-agnostic infrastructure with automatic failover and zero-downtime deploys.' },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="bg-white border border-[#F2F2F2] rounded-xl p-8 text-center hover:border-[#E0E0E0] transition-colors">
                  <div className="w-14 h-14 rounded-2xl bg-[#F2F2F2] flex items-center justify-center mx-auto mb-5">
                    <Icon size={24} className="text-[#0E0D0C]" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-[20px] text-[#0E0D0C] mb-3" style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}>
                    {item.title}
                  </h3>
                  <p className="text-[14px] text-[#858484] leading-[1.7]" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}>
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── DEPLOYMENT / HOW WE WORK ────────────────── */}
      <section id="how-we-work" className="py-[120px] px-8 bg-[#FAFAFA]">
        <div className="max-w-[1100px] mx-auto">
          <div className="grid grid-cols-2 gap-16 items-start">
            <div>
              <p className="text-[13px] text-[#858484] tracking-[0.1em] uppercase mb-5" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500 }}>
                Successful deployments
              </p>
              <h2
                style={{ fontFamily: "'DM Serif Display', Georgia, serif", lineHeight: '1.1', letterSpacing: '-0.02em' }}
                className="text-[40px] md:text-[44px] mb-6"
              >
                <span className="text-[#0E0D0C]">We do the work,</span>{' '}
                <span className="text-[#858484]">you see the results</span>
              </h2>
              <p className="text-[16px] text-[#858484] leading-[1.7] mb-8" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}>
                Our team handles everything — from identifying what to automate, to deploying and monitoring your AI agents in production. You get a dedicated engineer who knows your business inside out.
              </p>
              <a
                href="mailto:hello@tumai.dev"
                className="group inline-flex items-center gap-3 px-7 py-3.5 bg-[#0E0D0C] text-[#FCFCFC] text-[15px] font-medium rounded-xl hover:bg-[#333] transition-all"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                Book a demo
                <ArrowUpRight size={16} className="group-hover:rotate-45 transition-transform duration-200" />
              </a>
            </div>

            <div className="space-y-6">
              {deploymentPillars.map((p) => (
                <div key={p.number} className="bg-white border border-[#F2F2F2] rounded-xl p-6">
                  <div className="flex items-center gap-4 mb-3">
                    <span className="text-[13px] text-[#858484] font-medium" style={{ fontFamily: "'Inter', sans-serif" }}>{p.number}</span>
                    <h3 className="text-[18px] text-[#0E0D0C]" style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}>
                      {p.title}
                    </h3>
                  </div>
                  <p className="text-[14px] text-[#858484] leading-[1.7] pl-9" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}>
                    {p.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ───────────────────────────────── */}
      <section className="py-[140px] px-8">
        <div className="max-w-[700px] mx-auto text-center">
          <h2
            style={{ fontFamily: "'DM Serif Display', Georgia, serif", lineHeight: '1.1', letterSpacing: '-0.03em' }}
            className="text-[48px] md:text-[56px] mb-8"
          >
            <span className="text-[#0E0D0C]">Ready to put your</span>{' '}
            <span className="text-[#858484]">business on autopilot?</span>
          </h2>
          <a
            href="mailto:hello@tumai.dev"
            className="group inline-flex items-center gap-3 px-8 py-4 bg-[#0E0D0C] text-[#FCFCFC] text-[16px] font-medium rounded-xl hover:bg-[#333] transition-all"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Book a demo
            <ArrowUpRight size={18} className="group-hover:rotate-45 transition-transform duration-200" />
          </a>
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────── */}
      <footer className="py-12 px-8 border-t border-[#F2F2F2]" id="about" style={{ fontFamily: "'Inter', sans-serif" }}>
        <div className="max-w-[1100px] mx-auto">
          <div className="grid grid-cols-4 gap-12 mb-12">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-7 h-7 rounded-md bg-[#0E0D0C] flex items-center justify-center">
                  <Zap size={13} className="text-white" />
                </div>
                <span style={{ fontFamily: "'DM Serif Display', Georgia, serif" }} className="text-[16px] text-[#0E0D0C]">
                  Tumai
                </span>
              </div>
              <p className="text-[13px] text-[#858484] leading-[1.6]">
                AI automation infrastructure for enterprises.
              </p>
            </div>

            {/* Product */}
            <div>
              <p className="text-[12px] text-[#858484] tracking-[0.1em] uppercase font-medium mb-4">Product</p>
              <div className="space-y-2.5">
                <a href="#use-cases" className="block text-[13px] text-[#858484] hover:text-[#0E0D0C] transition-colors">AI Workers</a>
                <a href="#how-we-work" className="block text-[13px] text-[#858484] hover:text-[#0E0D0C] transition-colors">Deployments</a>
                <a href="#results" className="block text-[13px] text-[#858484] hover:text-[#0E0D0C] transition-colors">Case Studies</a>
              </div>
            </div>

            {/* Company */}
            <div>
              <p className="text-[12px] text-[#858484] tracking-[0.1em] uppercase font-medium mb-4">Company</p>
              <div className="space-y-2.5">
                <a href="#about" className="block text-[13px] text-[#858484] hover:text-[#0E0D0C] transition-colors">About</a>
                <a href="mailto:hello@tumai.dev" className="block text-[13px] text-[#858484] hover:text-[#0E0D0C] transition-colors">Contact</a>
                <a href="mailto:careers@tumai.dev" className="block text-[13px] text-[#858484] hover:text-[#0E0D0C] transition-colors">Careers</a>
              </div>
            </div>

            {/* Contact */}
            <div>
              <p className="text-[12px] text-[#858484] tracking-[0.1em] uppercase font-medium mb-4">Get in touch</p>
              <a
                href="mailto:hello@tumai.dev"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0E0D0C] text-[#FCFCFC] text-[13px] font-medium rounded-lg hover:bg-[#333] transition-colors"
              >
                Book a demo
                <ArrowRight size={14} />
              </a>
            </div>
          </div>

          <div className="pt-8 border-t border-[#F2F2F2] flex items-center justify-between">
            <p className="text-[12px] text-[#CACACA]">2026 Tumai Inc. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <a href="#" className="text-[12px] text-[#CACACA] hover:text-[#858484] transition-colors">Terms of Service</a>
              <a href="#" className="text-[12px] text-[#CACACA] hover:text-[#858484] transition-colors">Privacy Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

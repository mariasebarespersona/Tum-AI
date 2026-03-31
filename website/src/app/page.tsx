'use client';

import { useState, useEffect, useRef } from 'react';
import {
  ArrowRight, ArrowUpRight, ChevronRight,
  TrendingUp, Shield, Eye, Zap,
  BarChart3, Bot, CreditCard, Building2, Wrench, Landmark, Calculator,
  AlertTriangle, FileText, Send,
} from 'lucide-react';

// ═══════════════════════════════════════════════════════════════
// TUMAI — Marketing Website v2
// Positioning: Managed AI automation for real estate & lending
// Audience: Property managers, rental companies, RE investors,
//           lenders, service businesses
// Tone: Confident, specific, outcome-driven
// ═══════════════════════════════════════════════════════════════

const useCases = [
  {
    title: 'Stop chasing late rent payments',
    pain: 'Your team spends hours every month calling tenants, tracking who paid, calculating late fees, and updating spreadsheets.',
    solution: 'Tumai generates payment schedules on contract activation, tracks status automatically, calculates late fees on day 6, sends WhatsApp/email reminders, and flags high-risk tenants — without anyone touching a spreadsheet.',
    result: '8 automations working together, end-to-end',
    icon: CreditCard,
  },
  {
    title: 'Evaluate properties before you visit',
    pain: 'You drive across the city to see properties that turn out to be overpriced, in bad condition, or in the wrong zone.',
    solution: 'Send photos via WhatsApp. AI inspects the property against your checklist, estimates renovation costs, and recommends a purchase price based on comparables — in minutes, not days.',
    result: 'GPT-4 Vision + your business rules',
    icon: Eye,
  },
  {
    title: 'Find deals before your competition',
    pain: 'By the time you find a good listing on Idealista or Fotocasa, someone already made an offer.',
    solution: 'Automated scrapers monitor multiple portals 24/7, filter by your criteria (price, zone, size, bedrooms), and send matching listings to your WhatsApp the moment they appear.',
    result: 'Scraper + Rules Engine + WhatsApp alerts',
    icon: BarChart3,
  },
  {
    title: 'Never miss an investor report again',
    pain: 'Investors ask for updates and you spend 2 days pulling numbers from 5 different places to build a report.',
    solution: 'Portfolio KPIs update in real-time. Investor returns calculate automatically. Monthly PDF reports generate and send themselves — with collection rates, IRR, and capital deployed.',
    result: 'Automated reports + capital tracking',
    icon: TrendingUp,
  },
  {
    title: 'Classify expenses without an accountant',
    pain: 'At month-end, you have 200 transactions to manually categorize before you can close the books.',
    solution: 'GPT-4o reads each transaction and classifies it to the correct accounting category. Bank reconciliation runs automatically with scoring by amount, date, and counterparty.',
    result: 'AI classification + auto-reconciliation',
    icon: Bot,
  },
  {
    title: 'Generate contracts and invoices on autopilot',
    pain: 'Every new contract means manually filling a Word template, converting to PDF, uploading to Drive, and emailing it to the tenant.',
    solution: 'When a contract activates, the PDF generates from your template, uploads to cloud storage with metadata, and sends to the tenant — all in one step, zero manual work.',
    result: 'Event-driven document generation',
    icon: FileText,
  },
];

const caseStudies = [
  {
    company: 'Buy-Renovate-Sell Operation',
    industry: 'Real Estate Investment',
    quote: 'Before Tumai, we had 3 people just managing payments and tenant communications. Now the AI handles it end-to-end — reminders, late fees, delinquency scoring, even property evaluations from photos.',
    result: '3 FTEs replaced by AI agents',
    person: 'Operations Director',
  },
  {
    company: 'Property Rental Portfolio',
    industry: '120+ Units Under Management',
    quote: 'Rent schedules generate on the 1st, late fees apply on the 6th, and the delinquency dashboard updates automatically. We went from 15 hours/month on payment admin to zero.',
    result: '15 hours/month saved on payment ops',
    person: 'Portfolio Manager',
  },
  {
    company: 'Real Estate Lender',
    industry: 'Private Lending',
    quote: 'The affordability calculator screens every application in seconds. Investor returns calculate and distribute automatically. Our investors get monthly reports without us lifting a finger.',
    result: 'Investor reporting fully automated',
    person: 'Head of Capital',
  },
];

const deploymentPillars = [
  {
    number: '01',
    title: 'Discovery',
    description: 'We audit your operations and identify the workflows costing you the most time and money — usually payments, tenant comms, and financial reporting.',
  },
  {
    number: '02',
    title: 'Deployment',
    description: 'Your AI agents go live within days. 37 pre-built modules mean we configure, not build from scratch. You see results in the first week.',
  },
  {
    number: '03',
    title: 'Continuous improvement',
    description: 'We monitor performance, tune the agents, and expand coverage as your portfolio grows. You never manage the tech — we do.',
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

// Contact form CTA URL (replace with Calendly/Cal.com link when ready)
const CALENDLY_URL = 'https://calendly.com/tumai/demo';

export default function HomePage() {
  const [statsVisible, setStatsVisible] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formEmail, setFormEmail] = useState('');
  const [formName, setFormName] = useState('');
  const [formCompany, setFormCompany] = useState('');
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 100);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    document.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      document.removeEventListener('scroll', onScroll);
    };
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStatsVisible(true); },
      { threshold: 0.3 }
    );
    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  const rentCollected = useCounter(2400000, 1800, statsVisible);
  const contractsManaged = useCounter(1200, 1500, statsVisible);
  const hoursSaved = useCounter(500, 1200, statsVisible);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In production: send to API/webhook
    setFormSubmitted(true);
    // Open mailto as fallback
    window.location.href = `mailto:hello@tumai.dev?subject=Demo request from ${formCompany}&body=Name: ${formName}%0AEmail: ${formEmail}%0ACompany: ${formCompany}`;
  };

  return (
    <div className="min-h-screen bg-[#FCFCFC] text-[#0E0D0C]" style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}>
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
              <Zap size={14} className="text-white" />
            </div>
            <span style={{ fontFamily: "'DM Serif Display', Georgia, serif" }} className={`text-[18px] font-medium transition-colors duration-300 ${
              scrolled ? 'text-[#0E0D0C]' : 'text-white'
            }`}>
              Tumai
            </span>
          </div>
          <div className="hidden md:flex items-center gap-10" style={{ fontFamily: "'Inter', sans-serif" }}>
            {['Solutions', 'How We Work', 'Results', 'Contact'].map(label => (
              <a key={label} href={`#${label.toLowerCase().replace(/\s+/g, '-')}`} className={`text-[13px] transition-colors ${
                scrolled ? 'text-[#858484] hover:text-[#0E0D0C]' : 'text-white/70 hover:text-white'
              }`}>{label}</a>
            ))}
          </div>
          <div className="flex items-center gap-3" style={{ fontFamily: "'Inter', sans-serif" }}>
            <a
              href="#contact"
              className={`px-5 py-2 text-[13px] font-medium rounded-lg transition-all duration-300 ${
                scrolled
                  ? 'bg-[#0E0D0C] text-white hover:bg-[#333]'
                  : 'bg-white text-[#0E0D0C] hover:bg-white/90'
              }`}
            >
              Get a demo
            </a>
          </div>
        </div>
      </nav>

      {/* ── HERO ───────────────────────────────────── */}
      <section className="relative flex" style={{ height: 'calc(100vh - 4.5rem)', marginTop: '3.5rem', marginLeft: '1rem', marginRight: '1rem', marginBottom: '1rem', overflow: 'hidden' }}>
        <video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover">
          <source src="/videos/hero_montage.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/55 z-[1]" />

        <div className="absolute inset-0 z-[2] flex flex-col items-center justify-center px-8" style={{ paddingBottom: '10%' }}>
          <div className="max-w-[62rem] text-center">
            {/* Audience badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 mb-8" style={{ fontFamily: "'Inter', sans-serif" }}>
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-white/70 text-[13px]">For real estate, rental management & lending companies</span>
            </div>

            <h1
              style={{ fontFamily: "'DM Serif Display', Georgia, serif", lineHeight: '0.95', letterSpacing: '-0.04em' }}
              className="text-white text-[48px] md:text-[72px] lg:text-[88px] mb-8"
            >
              We automated an entire real estate company.{' '}
              <span className="text-[#858484]">Yours is next.</span>
            </h1>

            <p className="text-[17px] md:text-[19px] text-white/60 leading-[1.6] max-w-[40rem] mx-auto mb-10" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}>
              We deploy AI agents that manage payments, remind tenants, evaluate properties, and generate investor reports — fully automated, running 24/7 on your data.
            </p>

            <div className="flex items-center justify-center gap-5" style={{ fontFamily: "'Inter', sans-serif" }}>
              <a
                href="#contact"
                className="group inline-flex items-center gap-3 px-7 py-3.5 bg-white text-[#0E0D0C] text-[15px] font-medium rounded-xl hover:bg-white/90 transition-all"
              >
                Get a free audit
                <ArrowUpRight size={16} className="group-hover:rotate-45 transition-transform duration-200" />
              </a>
              <a
                href="#solutions"
                className="inline-flex items-center gap-2 text-[15px] text-white/50 hover:text-white transition-colors"
              >
                See what we automate
                <ChevronRight size={16} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar — specific audience signals */}
        <div className="absolute bottom-0 left-0 right-0 z-[3] px-10 py-6 flex items-end justify-between">
          <div className="flex items-center gap-8" style={{ fontFamily: "'Inter', sans-serif" }}>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-white/40 text-[12px]">37 automations in production</span>
            </div>
            <span className="text-white/25 text-[12px]">Property Rental</span>
            <span className="text-white/25 text-[12px]">Buy-Renovate-Sell</span>
            <span className="text-white/25 text-[12px]">Lending</span>
            <span className="text-white/25 text-[12px]">Service Business</span>
          </div>
        </div>
      </section>

      {/* ── VERTICALS — Right after hero ────────────── */}
      <section id="solutions" className="py-20 px-8 bg-[#FAFAFA] border-y border-[#F2F2F2]">
        <div className="max-w-[1100px] mx-auto">
          <div className="text-center mb-12">
            <p className="text-[13px] text-[#858484] tracking-[0.1em] uppercase mb-5" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500 }}>
              Built for your industry
            </p>
            <h2
              style={{ fontFamily: "'DM Serif Display', Georgia, serif", lineHeight: '1.1', letterSpacing: '-0.02em' }}
              className="text-[36px] md:text-[44px]"
            >
              <span className="text-[#0E0D0C]">Choose your vertical,</span>{' '}
              <span className="text-[#858484]">deploy in days</span>
            </h2>
          </div>

          <div className="grid grid-cols-3 gap-5 mb-5">
            {[
              { name: 'Property Rental', icon: Building2, count: 20, desc: 'Rent collection, late fees, tenant reminders, delinquency scoring, monthly reports. Everything a property manager needs — automated.', color: '#4f46e5', audience: 'For property managers & landlords' },
              { name: 'Buy-Renovate-Sell', icon: Wrench, count: 36, desc: 'Market scraping, AI property evaluation, renovation budgets, investor returns, contract lifecycle. The full flip pipeline.', color: '#0891b2', audience: 'For RE investors & developers' },
              { name: 'Lending & Finance', icon: Landmark, count: 18, desc: 'Loan lifecycle, affordability screening, delinquency scoring, capital returns, investor reporting. From application to payoff.', color: '#7c3aed', audience: 'For lenders & financing companies' },
            ].map((v) => {
              const Icon = v.icon;
              return (
                <div key={v.name} className="bg-white rounded-2xl border border-[#F2F2F2] p-8 hover:shadow-lg hover:shadow-[#00000008] transition-all">
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${v.color}10` }}>
                      <Icon size={22} style={{ color: v.color }} strokeWidth={1.5} />
                    </div>
                    <span className="text-[11px] px-2.5 py-1 rounded-full bg-[#F2F2F2] text-[#858484]" style={{ fontFamily: "'Inter', sans-serif" }}>{v.audience}</span>
                  </div>
                  <h3 className="text-[20px] text-[#0E0D0C] mb-2" style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}>{v.name}</h3>
                  <p className="text-[13px] text-[#858484] leading-[1.7] mb-6" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}>{v.desc}</p>
                  <div className="flex items-center justify-between pt-5 border-t border-[#F2F2F2]">
                    <span className="text-[12px] text-[#858484] font-medium" style={{ fontFamily: "'Inter', sans-serif" }}>{v.count} automations included</span>
                    <a href="#contact" className="text-[12px] text-[#0E0D0C] font-medium hover:underline" style={{ fontFamily: "'Inter', sans-serif" }}>Get started</a>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="grid grid-cols-2 gap-5">
            {[
              { name: 'Service Business', icon: Wrench, count: 15, desc: 'HVAC, plumbing, cleaning — AI quotes from photos, automatic invoicing, payment tracking, tenant comms.', color: '#059669', audience: 'For service companies' },
              { name: 'Accounting', icon: Calculator, count: 12, desc: 'AI transaction classification, bank reconciliation, automated ledger entries, periodic financial reports.', color: '#d97706', audience: 'For accounting firms' },
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
                      <span className="text-[12px] text-[#858484]" style={{ fontFamily: "'Inter', sans-serif" }}>{v.count} automations &middot; {v.audience}</span>
                    </div>
                  </div>
                  <p className="text-[13px] text-[#858484] leading-[1.7]" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}>{v.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── STATS BAR — Client-value metrics ────────── */}
      <section ref={statsRef} className="py-16 border-b border-[#F2F2F2]">
        <div className="max-w-[900px] mx-auto px-8 grid grid-cols-3 gap-8">
          {[
            { value: `$${(rentCollected / 1000000).toFixed(1)}M`, label: 'Rent collected automatically' },
            { value: `${contractsManaged.toLocaleString()}+`, label: 'Contracts managed by AI' },
            { value: `${hoursSaved}+`, label: 'Hours saved per month' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-[48px] font-light text-[#0E0D0C] tracking-tight" style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}>
                {stat.value}
              </p>
              <p className="text-[13px] text-[#858484] mt-2" style={{ fontFamily: "'Inter', sans-serif" }}>{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── USE CASES — Pain-driven ────────────────── */}
      <section id="use-cases" className="py-[120px] px-8">
        <div className="max-w-[1100px] mx-auto">
          <div className="text-center mb-16">
            <p className="text-[13px] text-[#858484] tracking-[0.1em] uppercase mb-5" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500 }}>
              What we automate
            </p>
            <h2
              style={{ fontFamily: "'DM Serif Display', Georgia, serif", lineHeight: '1.1', letterSpacing: '-0.02em' }}
              className="text-[40px] md:text-[48px] mb-4"
            >
              <span className="text-[#0E0D0C]">Problems you recognize,</span>{' '}
              <span className="text-[#858484]">solved by AI</span>
            </h2>
            <p className="text-[16px] text-[#858484] leading-[1.7] max-w-[560px] mx-auto" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}>
              Each solution is built from production-tested modules. No prototypes — these are running in real businesses today.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
            {useCases.map((uc) => {
              const Icon = uc.icon;
              return (
                <div key={uc.title} className="bg-white border border-[#F2F2F2] rounded-xl p-7 hover:shadow-lg hover:shadow-[#00000008] transition-all group">
                  <Icon size={24} className="text-[#0E0D0C] mb-5" strokeWidth={1.5} />
                  <h3 className="text-[17px] text-[#0E0D0C] mb-3 leading-tight" style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}>
                    {uc.title}
                  </h3>
                  <p className="text-[12px] text-red-400/80 leading-[1.6] mb-3 flex items-start gap-1.5" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 400 }}>
                    <AlertTriangle size={12} className="flex-shrink-0 mt-0.5" />
                    {uc.pain}
                  </p>
                  <p className="text-[13px] text-[#858484] leading-[1.7] mb-4" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}>
                    {uc.solution}
                  </p>
                  <div className="pt-4 border-t border-[#F2F2F2]">
                    <span className="text-[11px] px-2.5 py-1 bg-[#F2F2F2] text-[#0E0D0C] rounded-md font-medium" style={{ fontFamily: "'Inter', sans-serif" }}>
                      {uc.result}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Video divider ──────────────────────────── */}
      <section className="px-8 py-4">
        <div className="max-w-[1100px] mx-auto rounded-2xl overflow-hidden relative aspect-[3/1]">
          <video autoPlay muted loop playsInline className="w-full h-full object-cover">
            <source src="/videos/v_banner1.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-r from-[#0E0D0C]/70 via-[#0E0D0C]/30 to-transparent flex items-center">
            <div className="px-12">
              <p className="text-white/50 text-[12px] tracking-[0.15em] uppercase mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>Live infrastructure</p>
              <p className="text-white text-[24px]" style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}>
                37 modules. 5 verticals. Running 24/7.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ───────────────────────────── */}
      <section className="py-[120px] px-8 bg-[#FAFAFA]">
        <div className="max-w-[1100px] mx-auto">
          <div className="max-w-[600px] mb-16">
            <p className="text-[13px] text-[#858484] tracking-[0.1em] uppercase mb-5" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500 }}>
              How it works
            </p>
            <h2
              style={{ fontFamily: "'DM Serif Display', Georgia, serif", lineHeight: '1.1', letterSpacing: '-0.02em' }}
              className="text-[40px] md:text-[48px] mb-6"
            >
              <span className="text-[#0E0D0C]">AI agents trained</span>{' '}
              <span className="text-[#858484]">on your business rules</span>
            </h2>
            <p className="text-[16px] text-[#858484] leading-[1.7]" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}>
              Not generic chatbots. These agents know your late fee policy, your payment windows, your tenant screening criteria, and your reporting schedule.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-6">
            {[
              {
                num: '01',
                title: 'Sees and understands',
                desc: 'GPT-4 Vision evaluates properties from photos. Whisper transcribes voice notes. AI reads bank statements and classifies transactions.',
              },
              {
                num: '02',
                title: 'Follows your rules exactly',
                desc: 'Grace period of 5 days? Late fee of $5/day? Max DTI ratio of 35%? Your business logic, encoded once, executed perfectly every time.',
              },
              {
                num: '03',
                title: 'Takes real action',
                desc: 'Not just dashboards and alerts. Sends WhatsApp reminders, generates PDFs, calculates fees, updates ledgers, and notifies your team.',
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
              <span className="text-[#0E0D0C]">Built in production,</span>{' '}
              <span className="text-[#858484]">not a lab</span>
            </h2>
            <p className="text-[16px] text-[#858484] leading-[1.7]" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}>
              Every automation was forged in a live business — handling real money, real tenants, real deadlines. Then generalized so any company in the same vertical can deploy it in days.
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

      {/* ── Video divider 2 ────────────────────────── */}
      <section className="px-8 py-4">
        <div className="max-w-[1100px] mx-auto rounded-2xl overflow-hidden relative aspect-[4/1]">
          <video autoPlay muted loop playsInline className="w-full h-full object-cover">
            <source src="/videos/v_banner2.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-l from-[#0E0D0C]/70 via-[#0E0D0C]/30 to-transparent flex items-center justify-end">
            <div className="px-12 text-right">
              <p className="text-white/50 text-[12px] tracking-[0.15em] uppercase mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>Managed service</p>
              <p className="text-white text-[22px]" style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}>
                We deploy it. We monitor it. You grow.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW WE WORK — Managed service positioning ── */}
      <section id="how-we-work" className="py-[120px] px-8 bg-[#0E0D0C]">
        <div className="max-w-[1100px] mx-auto">
          <div className="grid grid-cols-2 gap-16 items-start">
            <div>
              <p className="text-[13px] text-[#858484] tracking-[0.1em] uppercase mb-5" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500 }}>
                A managed service, not a DIY tool
              </p>
              <h2
                style={{ fontFamily: "'DM Serif Display', Georgia, serif", lineHeight: '1.1', letterSpacing: '-0.02em' }}
                className="text-[40px] md:text-[44px] mb-6 text-[#FCFCFC]"
              >
                We do the work,{' '}
                <span className="text-[#858484]">you see the results</span>
              </h2>
              <p className="text-[16px] text-[#858484] leading-[1.7] mb-8" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}>
                This is not another SaaS tool you need to learn. Our team handles everything — from identifying what to automate, to deploying and monitoring your AI agents in production. You get a dedicated engineer who knows your business.
              </p>
              <a
                href="#contact"
                className="group inline-flex items-center gap-3 px-7 py-3.5 bg-white text-[#0E0D0C] text-[15px] font-medium rounded-xl hover:bg-white/90 transition-all"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                Get a free operations audit
                <ArrowUpRight size={16} className="group-hover:rotate-45 transition-transform duration-200" />
              </a>
            </div>

            <div className="space-y-6">
              {deploymentPillars.map((p) => (
                <div key={p.number} className="border border-[#333] rounded-xl p-6">
                  <div className="flex items-center gap-4 mb-3">
                    <span className="text-[13px] text-[#858484] font-medium" style={{ fontFamily: "'Inter', sans-serif" }}>{p.number}</span>
                    <h3 className="text-[18px] text-[#FCFCFC]" style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}>
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

      {/* ── TRUST SIGNALS ──────────────────────────── */}
      <section className="py-[100px] px-8">
        <div className="max-w-[1100px] mx-auto">
          <div className="text-center mb-16">
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
              { icon: Eye, title: 'Fully transparent', desc: 'Every decision your AI agents make is logged. Full audit trail — see what happened, when, and why.' },
              { icon: Shield, title: 'Your rules, always', desc: 'Business logic is explicit and configurable. Late fee policies, payment windows, qualification thresholds — you control the guardrails.' },
              { icon: TrendingUp, title: 'Grows with you', desc: 'From 10 contracts to 10,000. The same infrastructure scales without rework. Add new automations as your business evolves.' },
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

      {/* ── CONTACT FORM — Real CTA ────────────────── */}
      <section id="contact" className="py-[120px] px-8 bg-[#FAFAFA]">
        <div className="max-w-[600px] mx-auto text-center">
          <h2
            style={{ fontFamily: "'DM Serif Display', Georgia, serif", lineHeight: '1.1', letterSpacing: '-0.03em' }}
            className="text-[44px] md:text-[52px] mb-4"
          >
            <span className="text-[#0E0D0C]">Get a free</span>{' '}
            <span className="text-[#858484]">operations audit</span>
          </h2>
          <p className="text-[16px] text-[#858484] leading-[1.7] mb-10 max-w-[460px] mx-auto" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}>
            Tell us about your business. We&apos;ll identify the workflows costing you the most time and show you exactly what we can automate — for free.
          </p>

          {formSubmitted ? (
            <div className="bg-white border border-emerald-200 rounded-2xl p-10 text-center">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center mx-auto mb-5">
                <Send size={24} className="text-emerald-500" />
              </div>
              <h3 className="text-[20px] text-[#0E0D0C] mb-2" style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}>
                We&apos;ll be in touch
              </h3>
              <p className="text-[14px] text-[#858484]" style={{ fontFamily: "'Inter', sans-serif" }}>
                Expect a reply within 24 hours with your custom automation audit.
              </p>
            </div>
          ) : (
            <form onSubmit={handleFormSubmit} className="bg-white border border-[#F2F2F2] rounded-2xl p-8 text-left space-y-4" style={{ fontFamily: "'Inter', sans-serif" }}>
              <div>
                <label className="block text-[12px] text-[#858484] mb-1.5 font-medium">Your name</label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="Maria Garcia"
                  required
                  className="w-full px-4 py-3 text-[14px] bg-[#FAFAFA] border border-[#F2F2F2] rounded-lg text-[#0E0D0C] placeholder-[#CACACA] focus:outline-none focus:border-[#0E0D0C] focus:ring-1 focus:ring-[#0E0D0C]/10 transition-colors"
                />
              </div>
              <div>
                <label className="block text-[12px] text-[#858484] mb-1.5 font-medium">Work email</label>
                <input
                  type="email"
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  placeholder="maria@company.com"
                  required
                  className="w-full px-4 py-3 text-[14px] bg-[#FAFAFA] border border-[#F2F2F2] rounded-lg text-[#0E0D0C] placeholder-[#CACACA] focus:outline-none focus:border-[#0E0D0C] focus:ring-1 focus:ring-[#0E0D0C]/10 transition-colors"
                />
              </div>
              <div>
                <label className="block text-[12px] text-[#858484] mb-1.5 font-medium">Company &amp; what you do</label>
                <input
                  type="text"
                  value={formCompany}
                  onChange={(e) => setFormCompany(e.target.value)}
                  placeholder="e.g. Rental portfolio, 80 units in Madrid"
                  required
                  className="w-full px-4 py-3 text-[14px] bg-[#FAFAFA] border border-[#F2F2F2] rounded-lg text-[#0E0D0C] placeholder-[#CACACA] focus:outline-none focus:border-[#0E0D0C] focus:ring-1 focus:ring-[#0E0D0C]/10 transition-colors"
                />
              </div>
              <button
                type="submit"
                className="w-full py-3.5 bg-[#0E0D0C] text-white text-[15px] font-medium rounded-lg hover:bg-[#333] transition-colors flex items-center justify-center gap-2"
              >
                Get my free audit
                <ArrowRight size={16} />
              </button>
              <p className="text-[11px] text-[#CACACA] text-center pt-1">
                No commitment. We&apos;ll reply within 24 hours.
              </p>
            </form>
          )}
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────── */}
      <footer className="py-12 px-8 border-t border-[#F2F2F2]" id="about" style={{ fontFamily: "'Inter', sans-serif" }}>
        <div className="max-w-[1100px] mx-auto">
          <div className="grid grid-cols-4 gap-12 mb-12">
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
                AI automation for real estate, lending, and service businesses.
              </p>
            </div>

            <div>
              <p className="text-[12px] text-[#858484] tracking-[0.1em] uppercase font-medium mb-4">Solutions</p>
              <div className="space-y-2.5">
                <a href="#solutions" className="block text-[13px] text-[#858484] hover:text-[#0E0D0C] transition-colors">Property Rental</a>
                <a href="#solutions" className="block text-[13px] text-[#858484] hover:text-[#0E0D0C] transition-colors">Buy-Renovate-Sell</a>
                <a href="#solutions" className="block text-[13px] text-[#858484] hover:text-[#0E0D0C] transition-colors">Lending & Finance</a>
              </div>
            </div>

            <div>
              <p className="text-[12px] text-[#858484] tracking-[0.1em] uppercase font-medium mb-4">Company</p>
              <div className="space-y-2.5">
                <a href="#how-we-work" className="block text-[13px] text-[#858484] hover:text-[#0E0D0C] transition-colors">How We Work</a>
                <a href="#results" className="block text-[13px] text-[#858484] hover:text-[#0E0D0C] transition-colors">Results</a>
                <a href="mailto:hello@tumai.dev" className="block text-[13px] text-[#858484] hover:text-[#0E0D0C] transition-colors">Contact</a>
              </div>
            </div>

            <div>
              <p className="text-[12px] text-[#858484] tracking-[0.1em] uppercase font-medium mb-4">Get started</p>
              <a
                href="#contact"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0E0D0C] text-[#FCFCFC] text-[13px] font-medium rounded-lg hover:bg-[#333] transition-colors"
              >
                Free operations audit
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

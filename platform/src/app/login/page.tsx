'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Zap } from 'lucide-react';
import { initStore, login, seedDemoData } from '@/lib/store';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !name) return;
    setLoading(true);
    initStore();
    login(email, name);
    seedDemoData();
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#161618] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-xl bg-indigo-500 flex items-center justify-center mx-auto mb-4">
            <Zap size={28} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">Welcome to Tumai</h1>
          <p className="text-[14px] text-[#8b8b8f] mt-2">AI Automation Platform</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[12px] text-[#8b8b8f] mb-1.5 font-medium">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Jane Smith"
              className="w-full px-4 py-2.5 text-[14px] bg-[#222225] border border-[#2e2e33] rounded-lg text-white placeholder-[#6b6b70] focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition-colors"
              required
            />
          </div>
          <div>
            <label className="block text-[12px] text-[#8b8b8f] mb-1.5 font-medium">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="jane@company.com"
              className="w-full px-4 py-2.5 text-[14px] bg-[#222225] border border-[#2e2e33] rounded-lg text-white placeholder-[#6b6b70] focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition-colors"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white text-[14px] font-medium rounded-lg transition-colors disabled:opacity-50"
          >
            {loading ? 'Setting up...' : 'Get Started'}
          </button>
        </form>

        <p className="text-center text-[11px] text-[#5b5b60] mt-6">
          By continuing, you agree to Tumai&apos;s Terms of Service
        </p>
      </div>
    </div>
  );
}

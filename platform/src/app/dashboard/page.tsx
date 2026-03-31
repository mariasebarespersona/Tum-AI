'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Activity, CheckCircle, XCircle, Clock, TrendingUp, Zap,
  Play, ArrowRight, BarChart3,
} from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import {
  initStore, getDashboardStats, getExecutions, getInstalledAutomations,
  createExecution,
} from '@/lib/store';
import { automations } from '@/data/automations';
import type { DashboardStats, Execution, InstalledAutomation } from '@/types/platform';

const automationById = new Map(automations.map(a => [a.id, a]));

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [executions, setExecutions] = useState<Execution[]>([]);
  const [installed, setInstalled] = useState<InstalledAutomation[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    initStore();
    setStats(getDashboardStats());
    setExecutions(getExecutions().slice(0, 8));
    setInstalled(getInstalledAutomations());
  }, [refreshKey]);

  const handleRun = (automationId: string) => {
    const auto = automationById.get(automationId);
    if (!auto) return;
    createExecution(automationId, auto.name, 'manual');
    setTimeout(() => setRefreshKey(k => k + 1), 100);
    setTimeout(() => setRefreshKey(k => k + 1), 5000);
  };

  if (!stats) return null;

  const kpis = [
    { label: 'Installed', value: stats.totalAutomations, icon: Zap, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
    { label: 'Active', value: stats.activeAutomations, icon: Activity, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { label: 'Executions', value: stats.totalExecutions, icon: BarChart3, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { label: 'Success Rate', value: `${stats.successRate}%`, icon: TrendingUp, color: 'text-amber-400', bg: 'bg-amber-500/10' },
  ];

  return (
    <DashboardLayout>
      <div className="p-8 max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-[22px] font-semibold text-white">Dashboard</h1>
          <p className="text-[14px] text-[#8b8b8f] mt-1">Overview of your automation workspace</p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {kpis.map((kpi) => {
            const Icon = kpi.icon;
            return (
              <div key={kpi.label} className="bg-[#1a1a1d] border border-[#2e2e33] rounded-xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[12px] text-[#8b8b8f] font-medium">{kpi.label}</span>
                  <div className={`w-8 h-8 rounded-lg ${kpi.bg} flex items-center justify-center`}>
                    <Icon size={16} className={kpi.color} />
                  </div>
                </div>
                <p className="text-[28px] font-bold text-white">{kpi.value}</p>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-3 gap-6">
          {/* Recent Executions */}
          <div className="col-span-2 bg-[#1a1a1d] border border-[#2e2e33] rounded-xl">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#2e2e33]">
              <h2 className="text-[14px] font-semibold text-white">Recent Executions</h2>
              <Link href="/executions" className="text-[12px] text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
                View all <ArrowRight size={12} />
              </Link>
            </div>
            <div className="divide-y divide-[#2e2e33]">
              {executions.length === 0 ? (
                <div className="px-5 py-8 text-center text-[13px] text-[#6b6b70]">
                  No executions yet. Run an automation to see results here.
                </div>
              ) : (
                executions.map((exec) => (
                  <div key={exec.id} className="px-5 py-3 flex items-center gap-4">
                    {exec.status === 'completed' && <CheckCircle size={16} className="text-emerald-400 flex-shrink-0" />}
                    {exec.status === 'failed' && <XCircle size={16} className="text-red-400 flex-shrink-0" />}
                    {exec.status === 'running' && <Activity size={16} className="text-blue-400 animate-pulse flex-shrink-0" />}
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] text-white truncate">{exec.automationName}</p>
                      <p className="text-[11px] text-[#6b6b70]">
                        {exec.trigger} &middot; {new Date(exec.startedAt).toLocaleTimeString()}
                      </p>
                    </div>
                    {exec.duration && (
                      <span className="text-[11px] text-[#6b6b70] flex items-center gap-1">
                        <Clock size={10} /> {exec.duration}ms
                      </span>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Installed Automations */}
          <div className="bg-[#1a1a1d] border border-[#2e2e33] rounded-xl">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#2e2e33]">
              <h2 className="text-[14px] font-semibold text-white">Installed</h2>
              <Link href="/marketplace" className="text-[12px] text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
                Add more <ArrowRight size={12} />
              </Link>
            </div>
            <div className="divide-y divide-[#2e2e33]">
              {installed.length === 0 ? (
                <div className="px-5 py-8 text-center text-[13px] text-[#6b6b70]">
                  No automations installed yet.
                </div>
              ) : (
                installed.map((inst) => {
                  const auto = automationById.get(inst.automationId);
                  if (!auto) return null;
                  return (
                    <div key={inst.automationId} className="px-5 py-3 flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${inst.active ? 'bg-emerald-400' : 'bg-[#3e3e44]'}`} />
                      <span className="text-[13px] text-white flex-1 truncate">{auto.shortName}</span>
                      <button
                        onClick={() => handleRun(inst.automationId)}
                        className="p-1 rounded hover:bg-[#2a2a2e] transition-colors"
                        title="Run now"
                      >
                        <Play size={12} className="text-[#6b6b70] hover:text-indigo-400" />
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

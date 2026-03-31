'use client';

import { useEffect, useState } from 'react';
import {
  CheckCircle, XCircle, Activity, Clock, ChevronDown, ChevronRight,
  Play, RefreshCw, Filter,
} from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import {
  initStore, getExecutions, getInstalledAutomations, createExecution,
} from '@/lib/store';
import { automations } from '@/data/automations';
import type { Execution } from '@/types/platform';

const automationById = new Map(automations.map(a => [a.id, a]));

export default function ExecutionsPage() {
  const [executions, setExecutions] = useState<Execution[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    initStore();
    setExecutions(getExecutions());
  }, [refreshKey]);

  const filtered = executions.filter(e =>
    !statusFilter || e.status === statusFilter
  );

  const handleRunNew = () => {
    const installed = getInstalledAutomations();
    if (installed.length === 0) return;
    const random = installed[Math.floor(Math.random() * installed.length)];
    const auto = automationById.get(random.automationId);
    if (!auto) return;
    createExecution(random.automationId, auto.name, 'manual');
    setTimeout(() => setRefreshKey(k => k + 1), 100);
    setTimeout(() => setRefreshKey(k => k + 1), 5000);
  };

  const statusCounts = {
    all: executions.length,
    completed: executions.filter(e => e.status === 'completed').length,
    failed: executions.filter(e => e.status === 'failed').length,
    running: executions.filter(e => e.status === 'running').length,
  };

  return (
    <DashboardLayout>
      <div className="p-8 max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-[22px] font-semibold text-white">Executions</h1>
            <p className="text-[14px] text-[#8b8b8f] mt-1">Monitor automation runs and view logs</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setRefreshKey(k => k + 1)}
              className="p-2 rounded-lg border border-[#2e2e33] text-[#6b6b70] hover:text-white hover:border-[#3e3e44] transition-colors"
            >
              <RefreshCw size={16} />
            </button>
            <button
              onClick={handleRunNew}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white text-[13px] font-medium rounded-lg transition-colors"
            >
              <Play size={14} />
              Run Automation
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 mb-6">
          <Filter size={14} className="text-[#6b6b70]" />
          {(['all', 'completed', 'failed', 'running'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status === 'all' ? null : status)}
              className={`px-3 py-1.5 rounded-md text-[12px] font-medium transition-colors flex items-center gap-1.5 ${
                (status === 'all' && !statusFilter) || statusFilter === status
                  ? 'bg-[#2a2a2e] text-white'
                  : 'text-[#6b6b70] hover:text-white'
              }`}
            >
              {status === 'completed' && <CheckCircle size={12} className="text-emerald-400" />}
              {status === 'failed' && <XCircle size={12} className="text-red-400" />}
              {status === 'running' && <Activity size={12} className="text-blue-400" />}
              {status.charAt(0).toUpperCase() + status.slice(1)}
              <span className="text-[#5b5b60] ml-0.5">
                {statusCounts[status as keyof typeof statusCounts]}
              </span>
            </button>
          ))}
        </div>

        {/* Execution List */}
        <div className="bg-[#1a1a1d] border border-[#2e2e33] rounded-xl overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-[auto_1fr_100px_100px_100px_80px] gap-4 px-5 py-3 border-b border-[#2e2e33] text-[11px] text-[#6b6b70] uppercase tracking-wider font-semibold">
            <span className="w-4" />
            <span>Automation</span>
            <span>Status</span>
            <span>Trigger</span>
            <span>Duration</span>
            <span>Time</span>
          </div>

          {/* Rows */}
          {filtered.length === 0 ? (
            <div className="px-5 py-12 text-center text-[13px] text-[#6b6b70]">
              No executions found.
            </div>
          ) : (
            filtered.map((exec) => (
              <div key={exec.id}>
                <button
                  onClick={() => setExpandedId(expandedId === exec.id ? null : exec.id)}
                  className="w-full grid grid-cols-[auto_1fr_100px_100px_100px_80px] gap-4 px-5 py-3 border-b border-[#2e2e33] hover:bg-[#222225] transition-colors text-left items-center"
                >
                  <span className="w-4 text-[#6b6b70]">
                    {expandedId === exec.id ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                  </span>
                  <span className="text-[13px] text-white truncate">{exec.automationName}</span>
                  <span className="flex items-center gap-1.5">
                    {exec.status === 'completed' && <CheckCircle size={12} className="text-emerald-400" />}
                    {exec.status === 'failed' && <XCircle size={12} className="text-red-400" />}
                    {exec.status === 'running' && <Activity size={12} className="text-blue-400 animate-pulse" />}
                    <span className={`text-[12px] ${
                      exec.status === 'completed' ? 'text-emerald-400' :
                      exec.status === 'failed' ? 'text-red-400' :
                      'text-blue-400'
                    }`}>
                      {exec.status}
                    </span>
                  </span>
                  <span className="text-[12px] text-[#8b8b8f] capitalize">{exec.trigger}</span>
                  <span className="text-[12px] text-[#8b8b8f] flex items-center gap-1">
                    {exec.duration ? (
                      <><Clock size={10} /> {exec.duration}ms</>
                    ) : '—'}
                  </span>
                  <span className="text-[11px] text-[#6b6b70]">
                    {new Date(exec.startedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </button>

                {/* Expanded Logs */}
                {expandedId === exec.id && (
                  <div className="bg-[#161618] border-b border-[#2e2e33] px-5 py-4">
                    <h4 className="text-[11px] uppercase tracking-wider text-[#6b6b70] font-semibold mb-3">Execution Logs</h4>
                    <div className="space-y-1 font-mono text-[12px]">
                      {exec.logs.map((log, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <span className="text-[#5b5b60] flex-shrink-0 w-20">
                            {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                          </span>
                          <span className={`flex-shrink-0 w-12 ${
                            log.level === 'error' ? 'text-red-400' :
                            log.level === 'warn' ? 'text-amber-400' :
                            'text-[#6b6b70]'
                          }`}>
                            [{log.level}]
                          </span>
                          <span className={
                            log.level === 'error' ? 'text-red-300' : 'text-[#a0a0a5]'
                          }>
                            {log.message}
                          </span>
                        </div>
                      ))}
                    </div>
                    {exec.error && (
                      <div className="mt-3 p-3 bg-red-500/5 border border-red-500/20 rounded-lg">
                        <p className="text-[12px] text-red-400 font-mono">{exec.error}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

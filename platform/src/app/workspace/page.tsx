'use client';

import { useEffect, useState } from 'react';
import {
  Settings, Key, Users, Copy, Check, Shield, CreditCard,
  Eye, EyeOff,
} from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import { initStore, getWorkspace } from '@/lib/store';
import type { Workspace } from '@/types/platform';

export default function WorkspacePage() {
  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showKey, setShowKey] = useState<string | null>(null);

  useEffect(() => {
    initStore();
    setWorkspace(getWorkspace());
  }, []);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (!workspace) return null;

  const planColors: Record<string, string> = {
    free: 'text-[#6b6b70] bg-[#222225]',
    starter: 'text-blue-400 bg-blue-500/10',
    pro: 'text-indigo-400 bg-indigo-500/10',
    enterprise: 'text-amber-400 bg-amber-500/10',
  };

  return (
    <DashboardLayout>
      <div className="p-8 max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-[22px] font-semibold text-white">Workspace Settings</h1>
          <p className="text-[14px] text-[#8b8b8f] mt-1">Manage your workspace configuration</p>
        </div>

        <div className="space-y-6">
          {/* General */}
          <section className="bg-[#1a1a1d] border border-[#2e2e33] rounded-xl p-6">
            <div className="flex items-center gap-2 mb-5">
              <Settings size={16} className="text-[#6b6b70]" />
              <h2 className="text-[15px] font-semibold text-white">General</h2>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[12px] text-[#8b8b8f] mb-1.5">Workspace Name</label>
                <input
                  type="text"
                  value={workspace.name}
                  readOnly
                  className="w-full px-3 py-2 text-[13px] bg-[#222225] border border-[#2e2e33] rounded-lg text-white"
                />
              </div>
              <div>
                <label className="block text-[12px] text-[#8b8b8f] mb-1.5">Plan</label>
                <div className="flex items-center gap-2">
                  <span className={`text-[13px] font-semibold px-3 py-2 rounded-lg capitalize ${planColors[workspace.plan]}`}>
                    <CreditCard size={14} className="inline mr-1.5" />
                    {workspace.plan}
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* API Keys */}
          <section className="bg-[#1a1a1d] border border-[#2e2e33] rounded-xl p-6">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <Key size={16} className="text-[#6b6b70]" />
                <h2 className="text-[15px] font-semibold text-white">API Keys</h2>
              </div>
              <button className="text-[12px] text-indigo-400 hover:text-indigo-300 transition-colors">
                + Generate New Key
              </button>
            </div>
            <div className="space-y-3">
              {workspace.apiKeys.map((key) => (
                <div key={key.id} className="bg-[#222225] rounded-lg px-4 py-3 flex items-center gap-3">
                  <Shield size={14} className="text-[#6b6b70] flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] text-white">{key.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <code className="text-[12px] font-mono text-[#8b8b8f]">
                        {showKey === key.id ? key.prefix + '••••••••••••••••••••' : key.prefix + '••••••••'}
                      </code>
                      <button
                        onClick={() => setShowKey(showKey === key.id ? null : key.id)}
                        className="p-0.5 text-[#6b6b70] hover:text-white transition-colors"
                      >
                        {showKey === key.id ? <EyeOff size={12} /> : <Eye size={12} />}
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={() => handleCopy(key.prefix, key.id)}
                    className="p-1.5 rounded-md hover:bg-[#2a2a2e] transition-colors"
                  >
                    {copiedId === key.id ? (
                      <Check size={14} className="text-emerald-400" />
                    ) : (
                      <Copy size={14} className="text-[#6b6b70]" />
                    )}
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* Members */}
          <section className="bg-[#1a1a1d] border border-[#2e2e33] rounded-xl p-6">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <Users size={16} className="text-[#6b6b70]" />
                <h2 className="text-[15px] font-semibold text-white">Members</h2>
              </div>
              <button className="text-[12px] text-indigo-400 hover:text-indigo-300 transition-colors">
                + Invite Member
              </button>
            </div>
            <div className="space-y-2">
              {workspace.members.map((member) => (
                <div key={member.id} className="flex items-center gap-3 px-4 py-3 bg-[#222225] rounded-lg">
                  <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-[12px] font-semibold text-indigo-400">
                    {member.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <p className="text-[13px] text-white">{member.name}</p>
                    <p className="text-[11px] text-[#6b6b70]">{member.email}</p>
                  </div>
                  <span className="text-[11px] px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 font-medium capitalize">
                    {member.role}
                  </span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </DashboardLayout>
  );
}

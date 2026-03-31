'use client';

import { useEffect, useState } from 'react';
import {
  Plug, Plus, Trash2, Copy, Check, Globe, Zap,
  ToggleLeft, ToggleRight, Key, Clock,
} from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import {
  initStore, getWebhooks, createWebhook, toggleWebhook, deleteWebhook,
  getInstalledAutomations,
} from '@/lib/store';
import { automations } from '@/data/automations';
import type { Webhook } from '@/types/platform';

const automationById = new Map(automations.map(a => [a.id, a]));

export default function IntegrationsPage() {
  const [webhooks, setWebhooks] = useState<Webhook[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState('');
  const [newAutomationId, setNewAutomationId] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    initStore();
    setWebhooks(getWebhooks());
  }, [refreshKey]);

  const installed = getInstalledAutomations();

  const handleCreate = () => {
    if (!newName || !newAutomationId) return;
    createWebhook(newAutomationId, newName, ['execution.completed', 'execution.failed']);
    setNewName('');
    setNewAutomationId('');
    setShowCreate(false);
    setRefreshKey(k => k + 1);
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleToggle = (id: string) => {
    toggleWebhook(id);
    setRefreshKey(k => k + 1);
  };

  const handleDelete = (id: string) => {
    deleteWebhook(id);
    setRefreshKey(k => k + 1);
  };

  return (
    <DashboardLayout>
      <div className="p-8 max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-[22px] font-semibold text-white">Integrations</h1>
            <p className="text-[14px] text-[#8b8b8f] mt-1">Manage webhooks and external connections</p>
          </div>
          <button
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white text-[13px] font-medium rounded-lg transition-colors"
          >
            <Plus size={14} />
            New Webhook
          </button>
        </div>

        {/* Create Form */}
        {showCreate && (
          <div className="bg-[#1a1a1d] border border-[#2e2e33] rounded-xl p-5 mb-6">
            <h3 className="text-[14px] font-semibold text-white mb-4">Create Webhook</h3>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-[12px] text-[#8b8b8f] mb-1.5">Name</label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g., Slack notification"
                  className="w-full px-3 py-2 text-[13px] bg-[#222225] border border-[#2e2e33] rounded-lg text-white placeholder-[#6b6b70] focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-[12px] text-[#8b8b8f] mb-1.5">Automation</label>
                <select
                  value={newAutomationId}
                  onChange={(e) => setNewAutomationId(e.target.value)}
                  className="w-full px-3 py-2 text-[13px] bg-[#222225] border border-[#2e2e33] rounded-lg text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="">Select automation...</option>
                  {installed.map((inst) => {
                    const auto = automationById.get(inst.automationId);
                    return auto ? (
                      <option key={auto.id} value={auto.id}>{auto.name}</option>
                    ) : null;
                  })}
                </select>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCreate}
                disabled={!newName || !newAutomationId}
                className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white text-[13px] font-medium rounded-lg transition-colors disabled:opacity-40"
              >
                Create
              </button>
              <button
                onClick={() => setShowCreate(false)}
                className="px-4 py-2 text-[13px] text-[#8b8b8f] hover:text-white transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Webhook List */}
        <div className="space-y-4">
          {webhooks.length === 0 && !showCreate ? (
            <div className="bg-[#1a1a1d] border border-[#2e2e33] rounded-xl p-12 text-center">
              <Plug size={32} className="mx-auto text-[#3e3e44] mb-3" />
              <p className="text-[15px] text-[#6b6b70] mb-1">No webhooks configured</p>
              <p className="text-[13px] text-[#5b5b60]">Create a webhook to receive automation events</p>
            </div>
          ) : (
            webhooks.map((webhook) => {
              const auto = automationById.get(webhook.automationId);
              return (
                <div key={webhook.id} className="bg-[#1a1a1d] border border-[#2e2e33] rounded-xl p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                        webhook.active ? 'bg-emerald-500/10' : 'bg-[#222225]'
                      }`}>
                        <Globe size={18} className={webhook.active ? 'text-emerald-400' : 'text-[#6b6b70]'} />
                      </div>
                      <div>
                        <h3 className="text-[14px] font-medium text-white">{webhook.name}</h3>
                        <p className="text-[11px] text-[#6b6b70] flex items-center gap-1.5 mt-0.5">
                          <Zap size={10} />
                          {auto?.name ?? webhook.automationId}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleToggle(webhook.id)}
                        className="p-1.5 rounded-md hover:bg-[#222225] transition-colors"
                      >
                        {webhook.active ? (
                          <ToggleRight size={20} className="text-emerald-400" />
                        ) : (
                          <ToggleLeft size={20} className="text-[#6b6b70]" />
                        )}
                      </button>
                      <button
                        onClick={() => handleDelete(webhook.id)}
                        className="p-1.5 rounded-md hover:bg-[#222225] text-[#6b6b70] hover:text-red-400 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  {/* URL */}
                  <div className="bg-[#222225] rounded-lg px-3 py-2.5 flex items-center gap-2 mb-3">
                    <Globe size={12} className="text-[#6b6b70] flex-shrink-0" />
                    <code className="text-[12px] text-[#a0a0a5] font-mono flex-1 truncate">{webhook.url}</code>
                    <button
                      onClick={() => handleCopy(webhook.url, `url-${webhook.id}`)}
                      className="p-1 rounded hover:bg-[#2a2a2e] transition-colors"
                    >
                      {copiedId === `url-${webhook.id}` ? (
                        <Check size={12} className="text-emerald-400" />
                      ) : (
                        <Copy size={12} className="text-[#6b6b70]" />
                      )}
                    </button>
                  </div>

                  {/* Secret */}
                  <div className="bg-[#222225] rounded-lg px-3 py-2.5 flex items-center gap-2 mb-3">
                    <Key size={12} className="text-[#6b6b70] flex-shrink-0" />
                    <code className="text-[12px] text-[#6b6b70] font-mono flex-1 truncate">{webhook.secret.slice(0, 20)}...</code>
                    <button
                      onClick={() => handleCopy(webhook.secret, `secret-${webhook.id}`)}
                      className="p-1 rounded hover:bg-[#2a2a2e] transition-colors"
                    >
                      {copiedId === `secret-${webhook.id}` ? (
                        <Check size={12} className="text-emerald-400" />
                      ) : (
                        <Copy size={12} className="text-[#6b6b70]" />
                      )}
                    </button>
                  </div>

                  {/* Events + Last triggered */}
                  <div className="flex items-center justify-between text-[11px] text-[#6b6b70]">
                    <div className="flex items-center gap-2">
                      {webhook.events.map(ev => (
                        <span key={ev} className="px-2 py-0.5 rounded bg-[#222225] border border-[#2e2e33]">{ev}</span>
                      ))}
                    </div>
                    <span className="flex items-center gap-1">
                      <Clock size={10} />
                      {webhook.lastTriggeredAt
                        ? new Date(webhook.lastTriggeredAt).toLocaleDateString()
                        : 'Never triggered'}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

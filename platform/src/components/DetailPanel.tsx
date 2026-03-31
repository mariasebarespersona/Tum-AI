'use client';

import { useState } from 'react';
import { X, ExternalLink, Lock, Hash, Layers, Settings, Plug, Sparkles } from 'lucide-react';
import { getIcon, type LucideIcon } from '@/lib/icons';
import { categoryMeta, automations, type Automation, type Category } from '@/data/automations';

const automationById = new Map(automations.map((a) => [a.id, a]));

const statusLabel: Record<Automation['status'], { text: string; color: string; bg: string }> = {
  production: { text: 'Production', color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
  draft: { text: 'Draft', color: 'text-amber-400', bg: 'bg-amber-400/10' },
  planned: { text: 'Planned', color: 'text-[#6b6b70]', bg: 'bg-[#2a2a2e]' },
};

const typeIcons: Record<string, LucideIcon> = {
  secret: Lock,
  number: Hash,
};

type Tab = 'overview' | 'config' | 'connections';

interface Props {
  automation: Automation;
  onClose: () => void;
}

export default function DetailPanel({ automation, onClose }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const Icon = getIcon(automation.icon);
  const cat = categoryMeta[automation.category as Category];
  const status = statusLabel[automation.status];

  const requiredVars = automation.variables.filter((v) => v.required);
  const optionalVars = automation.variables.filter((v) => !v.required);

  // Find automations that depend on this one
  const dependents = automations.filter((a) =>
    a.dependencies.includes(automation.id)
  );

  const tabs: { id: Tab; label: string; icon: LucideIcon }[] = [
    { id: 'overview', label: 'Overview', icon: Sparkles },
    { id: 'config', label: 'Configuration', icon: Settings },
    { id: 'connections', label: 'Connections', icon: Plug },
  ];

  return (
    <div className="fixed right-0 top-0 h-full w-[460px] bg-[#1a1a1d] border-l border-[#2e2e33] z-50 overflow-y-auto animate-slide-in">
      {/* Header */}
      <div className="sticky top-0 bg-[#1a1a1d] border-b border-[#2e2e33] z-10">
        <div className="px-6 py-5">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div
                className="w-11 h-11 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: `${cat.color}12` }}
              >
                <Icon size={22} style={{ color: cat.color }} />
              </div>
              <div>
                <h2 className="text-[16px] font-semibold text-white leading-tight">{automation.name}</h2>
                <div className="flex items-center gap-2 mt-1.5">
                  <span
                    className="text-[11px] font-medium px-2 py-0.5 rounded"
                    style={{
                      color: cat.color,
                      backgroundColor: `${cat.color}12`,
                    }}
                  >
                    {cat.label}
                  </span>
                  <span className={`text-[11px] font-medium px-2 py-0.5 rounded flex items-center gap-1.5 ${status.color} ${status.bg}`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${
                      automation.status === 'production' ? 'bg-emerald-400' :
                      automation.status === 'draft' ? 'bg-amber-400' : 'bg-[#6b6b70]'
                    }`} />
                    {status.text}
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-[#2a2a2e] rounded-md transition-colors"
            >
              <X size={16} className="text-[#6b6b70] hover:text-[#a0a0a5]" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="px-6 flex gap-1">
          {tabs.map((tab) => {
            const TabIcon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-2 text-[12px] font-medium rounded-t-md transition-colors border-b-2 ${
                  activeTab === tab.id
                    ? 'text-white border-indigo-500 bg-[#222225]'
                    : 'text-[#6b6b70] border-transparent hover:text-[#a0a0a5]'
                }`}
              >
                <TabIcon size={12} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="px-6 py-5 space-y-6">
        {activeTab === 'overview' && (
          <>
            {/* Description */}
            <section>
              <SectionHeader>Description</SectionHeader>
              <p className="text-[13px] text-[#a0a0a5] leading-relaxed">{automation.description}</p>
            </section>

            {/* Use Cases */}
            <section>
              <SectionHeader>Use Cases</SectionHeader>
              <div className="flex flex-wrap gap-2">
                {automation.useCases.map((uc) => (
                  <span key={uc} className="text-[12px] px-2.5 py-1 rounded-md bg-[#222225] text-[#a0a0a5] border border-[#2e2e33]">
                    {uc}
                  </span>
                ))}
              </div>
            </section>

            {/* Verticals */}
            {automation.verticals.length > 0 && (
              <section>
                <SectionHeader icon={Layers}>Verticals</SectionHeader>
                <div className="flex flex-wrap gap-2">
                  {automation.verticals.map((v) => (
                    <span key={v} className="text-[11px] px-2 py-1 rounded-md bg-indigo-500/10 text-indigo-300 font-medium capitalize">
                      {v.replace(/-/g, ' ')}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {/* Quick Config Summary */}
            <section>
              <SectionHeader>Quick Summary</SectionHeader>
              <div className="grid grid-cols-3 gap-2">
                <div className="rounded-lg bg-[#222225] border border-[#2e2e33] p-3 text-center">
                  <p className="text-[18px] font-semibold text-white">{automation.variables.length}</p>
                  <p className="text-[10px] text-[#6b6b70] mt-0.5">Variables</p>
                </div>
                <div className="rounded-lg bg-[#222225] border border-[#2e2e33] p-3 text-center">
                  <p className="text-[18px] font-semibold text-white">{automation.dependencies.length}</p>
                  <p className="text-[10px] text-[#6b6b70] mt-0.5">Dependencies</p>
                </div>
                <div className="rounded-lg bg-[#222225] border border-[#2e2e33] p-3 text-center">
                  <p className="text-[18px] font-semibold text-white">{automation.verticals.length}</p>
                  <p className="text-[10px] text-[#6b6b70] mt-0.5">Verticals</p>
                </div>
              </div>
            </section>
          </>
        )}

        {activeTab === 'config' && (
          <>
            {/* Required Variables */}
            {requiredVars.length > 0 && (
              <section>
                <SectionHeader>
                  Required
                  <span className="text-rose-400 font-normal ml-1">({requiredVars.length})</span>
                </SectionHeader>
                <div className="space-y-2">
                  {requiredVars.map((v) => (
                    <VariableCard key={v.name} variable={v} />
                  ))}
                </div>
              </section>
            )}

            {/* Optional Variables */}
            {optionalVars.length > 0 && (
              <section>
                <SectionHeader>
                  Optional
                  <span className="text-[#5b5b60] font-normal ml-1">({optionalVars.length})</span>
                </SectionHeader>
                <div className="space-y-2">
                  {optionalVars.map((v) => (
                    <VariableCard key={v.name} variable={v} />
                  ))}
                </div>
              </section>
            )}

            {automation.variables.length === 0 && (
              <div className="text-center py-8">
                <Settings size={24} className="mx-auto text-[#3e3e44] mb-2" />
                <p className="text-[13px] text-[#6b6b70]">No configuration required</p>
              </div>
            )}
          </>
        )}

        {activeTab === 'connections' && (
          <>
            {/* Dependencies (what this automation needs) */}
            {automation.dependencies.length > 0 && (
              <section>
                <SectionHeader>Depends On</SectionHeader>
                <div className="space-y-1.5">
                  {automation.dependencies.map((dep) => {
                    const depAutomation = automationById.get(dep);
                    const DepIcon = depAutomation ? getIcon(depAutomation.icon) : getIcon('');
                    return (
                      <div key={dep} className="flex items-center gap-3 rounded-lg bg-[#222225] border border-[#2e2e33] px-3 py-2.5">
                        <DepIcon size={14} className="text-[#6b6b70] flex-shrink-0" />
                        <code className="text-[12px] font-mono text-indigo-400">{dep}</code>
                        {depAutomation && (
                          <span className="text-[11px] text-[#5b5b60] ml-auto">{depAutomation.shortName}</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* Dependents (what depends on this automation) */}
            {dependents.length > 0 && (
              <section>
                <SectionHeader>Used By</SectionHeader>
                <div className="space-y-1.5">
                  {dependents.map((dep) => {
                    const DepIcon = getIcon(dep.icon);
                    const depCat = categoryMeta[dep.category as Category];
                    return (
                      <div key={dep.id} className="flex items-center gap-3 rounded-lg bg-[#222225] border border-[#2e2e33] px-3 py-2.5">
                        <DepIcon size={14} style={{ color: depCat.color }} className="flex-shrink-0" />
                        <code className="text-[12px] font-mono text-indigo-400">{dep.id}</code>
                        <span className="text-[11px] text-[#5b5b60] ml-auto">{dep.shortName}</span>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {automation.dependencies.length === 0 && dependents.length === 0 && (
              <div className="text-center py-8">
                <Plug size={24} className="mx-auto text-[#3e3e44] mb-2" />
                <p className="text-[13px] text-[#6b6b70]">No connections</p>
              </div>
            )}

            {/* Origin */}
            <section>
              <SectionHeader>Origin</SectionHeader>
              <div className="flex items-center gap-3 rounded-lg bg-[#222225] border border-[#2e2e33] px-3 py-2.5">
                <ExternalLink size={14} className="text-[#6b6b70] flex-shrink-0" />
                <code className="text-[12px] text-[#8b8b8f] font-mono">{automation.origin}</code>
              </div>
            </section>
          </>
        )}
      </div>

      <div className="h-6" />
    </div>
  );
}

function VariableCard({ variable: v }: { variable: Automation['variables'][0] }) {
  const TypeIcon = typeIcons[v.type];
  return (
    <div className="rounded-lg bg-[#222225] border border-[#2e2e33] p-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {TypeIcon && <TypeIcon size={12} className="text-[#6b6b70]" />}
          <code className="text-[12px] font-mono text-indigo-400">{v.name}</code>
        </div>
        <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#2a2a2e] text-[#6b6b70] font-mono">{v.type}</span>
      </div>
      <p className="text-[11px] text-[#6b6b70] mt-1.5 leading-relaxed">{v.description}</p>
      {v.example && (
        <p className="text-[11px] text-[#5b5b60] mt-1">
          e.g. <code className="text-[#8b8b8f] bg-[#2a2a2e] px-1 py-0.5 rounded">{v.example}</code>
        </p>
      )}
      {v.default && (
        <p className="text-[11px] text-[#5b5b60] mt-1">
          default: <code className="text-[#8b8b8f] bg-[#2a2a2e] px-1 py-0.5 rounded">{v.default}</code>
        </p>
      )}
    </div>
  );
}

function SectionHeader({ children, icon: IconComp }: { children: React.ReactNode; icon?: LucideIcon }) {
  return (
    <h3 className="text-[11px] uppercase tracking-wider text-[#6b6b70] font-semibold mb-3 flex items-center gap-2">
      {IconComp && <IconComp size={12} />}
      {children}
    </h3>
  );
}

'use client';

import { useState } from 'react';
import { Search, ChevronDown, ChevronRight, Zap, ExternalLink } from 'lucide-react';
import { getIcon } from '@/lib/icons';
import { automations, categoryMeta, type Category } from '@/data/automations';

const productionCount = automations.filter((a) => a.status === 'production').length;
const plannedCount = automations.filter((a) => a.status === 'planned').length;

interface Props {
  onSelectAutomation: (id: string) => void;
  selectedId: string | null;
}

export default function Sidebar({ onSelectAutomation, selectedId }: Props) {
  const [search, setSearch] = useState('');
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  const filtered = automations.filter((a) => {
    const matchesSearch =
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.description.toLowerCase().includes(search.toLowerCase()) ||
      a.id.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = !statusFilter || a.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const grouped = (Object.keys(categoryMeta) as Category[]).map((cat) => ({
    category: cat,
    meta: categoryMeta[cat],
    items: filtered.filter((a) => a.category === cat),
  })).filter((g) => g.items.length > 0);

  const toggleCategory = (cat: string) => {
    setCollapsed((prev) => ({ ...prev, [cat]: !prev[cat] }));
  };

  return (
    <div className="w-[280px] h-full bg-[#1a1a1d] border-r border-[#2e2e33] flex flex-col relative z-10">
      {/* Header */}
      <div className="px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center">
            <Zap size={16} className="text-white" />
          </div>
          <div>
            <h1 className="text-[15px] font-semibold text-white tracking-tight">Tumai</h1>
            <p className="text-[11px] text-[#8b8b8f]">AI Automation Platform</p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="px-4 pb-3">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6b6b70]" />
          <input
            type="text"
            placeholder="Search automations..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-[13px] bg-[#222225] border border-[#2e2e33] rounded-lg text-[#ededef] placeholder-[#6b6b70] focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 transition-colors"
          />
        </div>
      </div>

      {/* Quick stats — clickable filters */}
      <div className="px-4 pb-3 flex gap-2">
        <button
          onClick={() => setStatusFilter(null)}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[12px] transition-colors ${
            !statusFilter ? 'bg-[#2a2a2e] text-white' : 'text-[#6b6b70] hover:text-[#a0a0a5]'
          }`}
        >
          <span className="font-semibold">{automations.length}</span>
          <span>all</span>
        </button>
        <button
          onClick={() => setStatusFilter(statusFilter === 'production' ? null : 'production')}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[12px] transition-colors ${
            statusFilter === 'production' ? 'bg-emerald-500/15 text-emerald-400' : 'text-[#6b6b70] hover:text-emerald-400'
          }`}
        >
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span className="font-semibold">{productionCount}</span>
          <span>live</span>
        </button>
        {plannedCount > 0 && (
          <button
            onClick={() => setStatusFilter(statusFilter === 'planned' ? null : 'planned')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[12px] transition-colors ${
              statusFilter === 'planned' ? 'bg-[#2a2a2e] text-[#a0a0a5]' : 'text-[#6b6b70] hover:text-[#a0a0a5]'
            }`}
          >
            <span className="font-semibold">{plannedCount}</span>
            <span>planned</span>
          </button>
        )}
      </div>

      {/* Divider */}
      <div className="mx-4 mb-2 h-px bg-[#2e2e33]" />

      {/* Catalog */}
      <div className="flex-1 overflow-y-auto px-3 pb-4">
        {grouped.map(({ category, meta, items }) => (
          <div key={category} className="mb-1">
            <button
              onClick={() => toggleCategory(category)}
              className="w-full flex items-center gap-2 px-2 py-2 rounded-md hover:bg-[#222225] transition-colors group"
            >
              <div className="text-[#6b6b70] group-hover:text-[#8b8b8f] transition-colors">
                {collapsed[category] ? <ChevronRight size={12} /> : <ChevronDown size={12} />}
              </div>
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: meta.color }}
              />
              <span className="text-[11px] font-medium text-[#8b8b8f] uppercase tracking-wider">
                {meta.label}
              </span>
              <span className="text-[11px] text-[#5b5b60] ml-auto tabular-nums">{items.length}</span>
            </button>

            {!collapsed[category] && (
              <div className="ml-2 mt-0.5 space-y-px">
                {items.map((item) => {
                  const Icon = getIcon(item.icon);
                  const isSelected = selectedId === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => onSelectAutomation(item.id)}
                      className={`
                        w-full flex items-center gap-2.5 px-3 py-[7px] rounded-md text-left
                        transition-colors
                        ${isSelected
                          ? 'bg-indigo-500/10 text-white'
                          : 'text-[#a0a0a5] hover:bg-[#222225] hover:text-[#d0d0d3]'
                        }
                      `}
                    >
                      <Icon
                        size={14}
                        style={{ color: isSelected ? meta.color : '#6b6b70' }}
                        className="flex-shrink-0 transition-colors"
                      />
                      <span className="flex-1 min-w-0 text-[13px] truncate">
                        {item.name}
                      </span>
                      {item.status === 'production' && (
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400/70" />
                      )}
                      {item.status === 'planned' && (
                        <div className="w-1.5 h-1.5 rounded-full bg-[#6b6b70]" />
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-[#2e2e33]">
        <div className="flex items-center justify-between">
          <p className="text-[11px] text-[#5b5b60]">v0.2.0</p>
          <a
            href="https://tumai.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-[11px] text-[#6b6b70] hover:text-indigo-400 transition-colors"
          >
            <ExternalLink size={10} />
            tumai.dev
          </a>
        </div>
      </div>
    </div>
  );
}

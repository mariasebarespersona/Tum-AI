'use client';

import { useEffect, useState, useCallback } from 'react';
import { Search, Download, Check, Filter, X } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import { getIcon } from '@/lib/icons';
import { automations, categoryMeta, type Category } from '@/data/automations';
import { initStore, installAutomation, uninstallAutomation, isInstalled } from '@/lib/store';

export default function MarketplacePage() {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<Category | 'all'>('all');
  const [installedIds, setInstalledIds] = useState<Set<string>>(new Set());
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    initStore();
    const ids = new Set(automations.filter(a => isInstalled(a.id)).map(a => a.id));
    setInstalledIds(ids);
  }, [refreshKey]);

  const filtered = automations.filter((a) => {
    const matchesSearch =
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.description.toLowerCase().includes(search.toLowerCase()) ||
      a.id.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || a.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleInstall = useCallback((id: string) => {
    if (installedIds.has(id)) {
      uninstallAutomation(id);
    } else {
      installAutomation(id);
    }
    setRefreshKey(k => k + 1);
  }, [installedIds]);

  const categories = Object.entries(categoryMeta) as [Category, { label: string; color: string }][];

  return (
    <DashboardLayout>
      <div className="p-8 max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-[22px] font-semibold text-white">Marketplace</h1>
          <p className="text-[14px] text-[#8b8b8f] mt-1">
            Browse and install production-ready automations
          </p>
        </div>

        {/* Search + Filters */}
        <div className="flex items-center gap-3 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6b6b70]" />
            <input
              type="text"
              placeholder="Search automations..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-[14px] bg-[#1a1a1d] border border-[#2e2e33] rounded-lg text-white placeholder-[#6b6b70] focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 transition-colors"
            />
          </div>
          <div className="flex items-center gap-1.5">
            <Filter size={14} className="text-[#6b6b70] mr-1" />
            <button
              onClick={() => setCategoryFilter('all')}
              className={`px-3 py-1.5 rounded-md text-[12px] font-medium transition-colors ${
                categoryFilter === 'all' ? 'bg-indigo-500/15 text-indigo-400' : 'text-[#6b6b70] hover:text-white'
              }`}
            >
              All
            </button>
            {categories.map(([cat, meta]) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(categoryFilter === cat ? 'all' : cat)}
                className={`px-3 py-1.5 rounded-md text-[12px] font-medium transition-colors ${
                  categoryFilter === cat
                    ? 'text-white'
                    : 'text-[#6b6b70] hover:text-white'
                }`}
                style={categoryFilter === cat ? { backgroundColor: `${meta.color}20`, color: meta.color } : undefined}
              >
                {meta.label}
              </button>
            ))}
          </div>
        </div>

        {/* Results count */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-[13px] text-[#6b6b70]">
            {filtered.length} automation{filtered.length !== 1 ? 's' : ''}
            {categoryFilter !== 'all' && (
              <button onClick={() => setCategoryFilter('all')} className="ml-2 text-indigo-400 hover:text-indigo-300">
                <X size={12} className="inline" /> Clear filter
              </button>
            )}
          </p>
          <p className="text-[13px] text-[#6b6b70]">{installedIds.size} installed</p>
        </div>

        {/* Automation Grid */}
        <div className="grid grid-cols-3 gap-4">
          {filtered.map((auto) => {
            const Icon = getIcon(auto.icon);
            const cat = categoryMeta[auto.category];
            const installed = installedIds.has(auto.id);

            return (
              <div
                key={auto.id}
                className={`bg-[#1a1a1d] border rounded-xl p-5 transition-all hover:border-[#3e3e44] ${
                  installed ? 'border-indigo-500/30' : 'border-[#2e2e33]'
                }`}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `${cat.color}12` }}
                    >
                      <Icon size={20} style={{ color: cat.color }} />
                    </div>
                    <div>
                      <h3 className="text-[14px] font-medium text-white">{auto.name}</h3>
                      <span
                        className="text-[10px] font-medium px-1.5 py-0.5 rounded"
                        style={{ color: cat.color, backgroundColor: `${cat.color}12` }}
                      >
                        {cat.label}
                      </span>
                    </div>
                  </div>
                  {auto.status === 'production' && (
                    <div className="w-2 h-2 rounded-full bg-emerald-400 mt-1" />
                  )}
                </div>

                {/* Description */}
                <p className="text-[12px] text-[#8b8b8f] leading-relaxed mb-4 line-clamp-2">
                  {auto.description}
                </p>

                {/* Meta */}
                <div className="flex items-center gap-3 mb-4 text-[11px] text-[#6b6b70]">
                  <span>{auto.variables.length} variables</span>
                  <span>&middot;</span>
                  <span>{auto.dependencies.length} deps</span>
                  <span>&middot;</span>
                  <span>{auto.verticals.length} verticals</span>
                </div>

                {/* Use cases */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {auto.useCases.slice(0, 3).map((uc) => (
                    <span key={uc} className="text-[10px] px-2 py-0.5 rounded bg-[#222225] text-[#8b8b8f] border border-[#2e2e33]">
                      {uc}
                    </span>
                  ))}
                  {auto.useCases.length > 3 && (
                    <span className="text-[10px] px-2 py-0.5 text-[#5b5b60]">
                      +{auto.useCases.length - 3} more
                    </span>
                  )}
                </div>

                {/* Install/Uninstall Button */}
                <button
                  onClick={() => handleInstall(auto.id)}
                  className={`w-full py-2 rounded-lg text-[13px] font-medium transition-colors flex items-center justify-center gap-2 ${
                    installed
                      ? 'bg-emerald-500/10 text-emerald-400 hover:bg-red-500/10 hover:text-red-400'
                      : 'bg-indigo-500 text-white hover:bg-indigo-600'
                  }`}
                >
                  {installed ? (
                    <>
                      <Check size={14} />
                      Installed
                    </>
                  ) : (
                    <>
                      <Download size={14} />
                      Install
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
}

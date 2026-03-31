'use client';

import { useState, useCallback } from 'react';
import Sidebar from '@/components/Sidebar';
import FlowCanvas from '@/components/FlowCanvas';
import DetailPanel from '@/components/DetailPanel';
import { automations } from '@/data/automations';

const automationById = new Map(automations.map((a) => [a.id, a]));

export default function Home() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selectedAutomation = selectedId ? (automationById.get(selectedId) ?? null) : null;

  const handleNodeSelect = useCallback((id: string | null) => {
    setSelectedId(id);
  }, []);

  const handleSidebarSelect = useCallback((id: string) => {
    setSelectedId((prev) => (prev === id ? null : id));
  }, []);

  const handleClose = useCallback(() => {
    setSelectedId(null);
  }, []);

  return (
    <div className="h-screen w-screen flex overflow-hidden relative">
      <Sidebar
        onSelectAutomation={handleSidebarSelect}
        selectedId={selectedId}
      />
      <FlowCanvas
        onNodeSelect={handleNodeSelect}
        selectedNodeId={selectedId}
      />

      {selectedAutomation && (
        <>
          <div
            className="fixed inset-0 bg-black/30 z-40 animate-fade-in"
            onClick={handleClose}
          />
          <DetailPanel
            automation={selectedAutomation}
            onClose={handleClose}
          />
        </>
      )}
    </div>
  );
}

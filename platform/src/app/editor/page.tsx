'use client';

import { useCallback, useState, useEffect, useMemo } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  BackgroundVariant,
  type Node,
  type Edge,
  type Connection,
  type NodeTypes,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Plus, Save, Trash2, FolderOpen, FilePlus, ChevronDown } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import AutomationNode from '@/components/AutomationNode';
import FlowConfigurator from '@/components/FlowConfigurator';
import { getIcon } from '@/lib/icons';
import { automations, categoryMeta, type Category } from '@/data/automations';
import {
  initStore,
  getFlows, createFlow, updateFlow, deleteFlow,
} from '@/lib/store';
import type { Flow } from '@/types/platform';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const nodeTypes: NodeTypes = { automation: AutomationNode as any };

export default function EditorPage() {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [showPalette, setShowPalette] = useState(false);
  const [showConfigurator, setShowConfigurator] = useState(false);
  const [showFlowList, setShowFlowList] = useState(false);
  const [flowName, setFlowName] = useState('Untitled Flow');
  const [currentFlowId, setCurrentFlowId] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [savedFlows, setSavedFlows] = useState<Flow[]>([]);

  useEffect(() => {
    initStore();
    setSavedFlows(getFlows());
  }, []);

  // Auto-open configurator when nodes + edges exist
  useEffect(() => {
    if (nodes.length >= 2 && edges.length >= 1 && !showConfigurator) {
      setShowConfigurator(true);
    }
  }, [nodes.length, edges.length, showConfigurator]);

  const onConnect = useCallback(
    (params: Connection) => {
      setEdges((eds: Edge[]) => addEdge({
        ...params,
        animated: true,
        style: { stroke: '#4b4b52', strokeWidth: 1.5 },
      }, eds));
      setSaved(false);
    },
    [setEdges],
  );

  const addNode = useCallback((automationId: string) => {
    const auto = automations.find(a => a.id === automationId);
    if (!auto) return;
    const id = `${automationId}-${Date.now()}`;
    const newNode: Node = {
      id,
      type: 'automation',
      position: { x: 200 + Math.random() * 400, y: 100 + Math.random() * 300 },
      data: { ...auto, selected: false },
    };
    setNodes((nds: Node[]) => [...nds, newNode]);
    setShowPalette(false);
    setSaved(false);
  }, [setNodes]);

  // ── Save flow to store ──────────────────────────────────
  const handleSave = useCallback(() => {
    const flowNodes = nodes.map(n => ({
      id: n.id,
      automationId: (n.data as Record<string, unknown>).id as string || '',
      position: n.position,
      config: ((n.data as Record<string, unknown>)._config as Record<string, string>) || {},
    }));

    const flowEdges = edges.map(e => ({
      id: e.id,
      source: e.source,
      target: e.target,
      label: typeof e.label === 'string' ? e.label : undefined,
    }));

    if (currentFlowId) {
      // Update existing
      updateFlow(currentFlowId, { name: flowName, nodes: flowNodes, edges: flowEdges });
    } else {
      // Create new
      const flow = createFlow(flowName, '');
      updateFlow(flow.id, { nodes: flowNodes, edges: flowEdges });
      setCurrentFlowId(flow.id);
    }

    setSaved(true);
    setSavedFlows(getFlows());
    setTimeout(() => setSaved(false), 2000);
  }, [nodes, edges, flowName, currentFlowId]);

  // ── Load a saved flow ───────────────────────────────────
  const handleLoadFlow = useCallback((flow: Flow) => {
    setCurrentFlowId(flow.id);
    setFlowName(flow.name);
    setShowFlowList(false);
    setShowConfigurator(false);

    // Reconstruct nodes from saved flow
    const loadedNodes: Node[] = flow.nodes.map(fn => {
      const auto = automations.find(a => a.id === fn.automationId);
      return {
        id: fn.id,
        type: 'automation',
        position: fn.position,
        data: { ...(auto || {}), selected: false, _config: fn.config },
      };
    });

    const loadedEdges: Edge[] = flow.edges.map(fe => ({
      id: fe.id,
      source: fe.source,
      target: fe.target,
      label: fe.label,
      animated: true,
      style: { stroke: '#4b4b52', strokeWidth: 1.5 },
    }));

    setNodes(loadedNodes);
    setEdges(loadedEdges);
    setSaved(true);
  }, [setNodes, setEdges]);

  // ── New flow ────────────────────────────────────────────
  const handleNewFlow = useCallback(() => {
    setCurrentFlowId(null);
    setFlowName('Untitled Flow');
    setNodes([]);
    setEdges([]);
    setShowConfigurator(false);
    setShowFlowList(false);
    setSaved(false);
  }, [setNodes, setEdges]);

  // ── Delete flow ─────────────────────────────────────────
  const handleDeleteFlow = useCallback((flowId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteFlow(flowId);
    setSavedFlows(getFlows());
    if (currentFlowId === flowId) {
      handleNewFlow();
    }
  }, [currentFlowId, handleNewFlow]);

  const handleClear = () => {
    setNodes([]);
    setEdges([]);
    setShowConfigurator(false);
    setSaved(false);
  };

  const handleConfigUpdate = useCallback((nodeId: string, config: Record<string, string>) => {
    setNodes((nds: Node[]) => nds.map(n =>
      n.id === nodeId ? { ...n, data: { ...n.data, _config: config } } : n
    ));
    setSaved(false);
  }, [setNodes]);

  const installed = useMemo(() => {
    return automations;
  }, []);

  const grouped = useMemo(() => {
    const cats = Object.keys(categoryMeta) as Category[];
    return cats.map(cat => ({
      category: cat,
      meta: categoryMeta[cat],
      items: installed.filter(a => a.category === cat),
    })).filter(g => g.items.length > 0);
  }, [installed]);

  const configuratorNodes = useMemo(() =>
    nodes.filter(n => n.type === 'automation').map(n => ({
      id: n.id,
      data: n.data as Record<string, unknown>,
    })),
    [nodes]
  );

  const configuratorEdges = useMemo(() =>
    edges.map(e => ({ source: e.source, target: e.target })),
    [edges]
  );

  return (
    <DashboardLayout>
      <div className="h-full flex flex-col">
        {/* Toolbar */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-[#2e2e33] bg-[#1a1a1d]">
          <div className="flex items-center gap-3">
            {/* Flow selector */}
            <div className="relative">
              <button
                onClick={() => setShowFlowList(!showFlowList)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-[#2e2e33] hover:border-[#3e3e44] text-[#8b8b8f] hover:text-white transition-colors"
              >
                <FolderOpen size={14} />
                <ChevronDown size={12} />
              </button>

              {showFlowList && (
                <div className="absolute top-full left-0 mt-1 w-[260px] bg-[#1a1a1d] border border-[#2e2e33] rounded-xl shadow-2xl z-30 overflow-hidden">
                  <div className="px-3 py-2 border-b border-[#2e2e33]">
                    <p className="text-[11px] text-[#6b6b70] uppercase tracking-wider font-semibold">Saved Flows</p>
                  </div>

                  <button
                    onClick={handleNewFlow}
                    className="w-full flex items-center gap-2.5 px-3 py-2.5 text-[13px] text-indigo-400 hover:bg-[#222225] transition-colors border-b border-[#2e2e33]"
                  >
                    <FilePlus size={14} />
                    New Flow
                  </button>

                  {savedFlows.length === 0 ? (
                    <div className="px-3 py-4 text-center text-[12px] text-[#6b6b70]">
                      No saved flows yet
                    </div>
                  ) : (
                    <div className="max-h-[300px] overflow-y-auto">
                      {savedFlows.map(flow => (
                        <button
                          key={flow.id}
                          onClick={() => handleLoadFlow(flow)}
                          className={`w-full flex items-center justify-between px-3 py-2.5 text-left hover:bg-[#222225] transition-colors ${
                            currentFlowId === flow.id ? 'bg-indigo-500/10' : ''
                          }`}
                        >
                          <div className="min-w-0 flex-1">
                            <p className={`text-[13px] truncate ${
                              currentFlowId === flow.id ? 'text-white font-medium' : 'text-[#a0a0a5]'
                            }`}>
                              {flow.name}
                            </p>
                            <p className="text-[10px] text-[#5b5b60]">
                              {flow.nodes.length} nodes &middot; {new Date(flow.updatedAt).toLocaleDateString()}
                            </p>
                          </div>
                          <button
                            onClick={(e) => handleDeleteFlow(flow.id, e)}
                            className="p-1 rounded hover:bg-[#2a2a2e] text-[#5b5b60] hover:text-red-400 transition-colors ml-2"
                          >
                            <Trash2 size={12} />
                          </button>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            <input
              type="text"
              value={flowName}
              onChange={(e) => { setFlowName(e.target.value); setSaved(false); }}
              className="text-[15px] font-semibold text-white bg-transparent border-none focus:outline-none focus:ring-0 w-48"
            />
            <span className="text-[11px] text-[#6b6b70]">{nodes.length} nodes &middot; {edges.length} connections</span>
            {currentFlowId && saved && (
              <span className="text-[10px] text-emerald-400/60">saved</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowPalette(!showPalette)}
              className="flex items-center gap-2 px-3 py-1.5 bg-indigo-500 hover:bg-indigo-600 text-white text-[12px] font-medium rounded-lg transition-colors"
            >
              <Plus size={14} />
              Add Node
            </button>
            <button
              onClick={handleSave}
              className={`flex items-center gap-2 px-3 py-1.5 border text-[12px] font-medium rounded-lg transition-colors ${
                saved
                  ? 'border-emerald-500/30 text-emerald-400 bg-emerald-500/5'
                  : 'border-[#2e2e33] text-[#a0a0a5] hover:border-[#3e3e44] hover:text-white'
              }`}
            >
              <Save size={14} />
              {saved ? 'Saved!' : 'Save'}
            </button>
            <button
              onClick={handleClear}
              className="p-1.5 rounded-lg border border-[#2e2e33] text-[#6b6b70] hover:text-red-400 hover:border-red-500/30 transition-colors"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>

        <div className="flex-1 relative">
          {/* Node Palette */}
          {showPalette && (
            <div className="absolute left-4 top-4 z-20 w-[260px] bg-[#1a1a1d] border border-[#2e2e33] rounded-xl shadow-2xl max-h-[70vh] overflow-y-auto">
              <div className="sticky top-0 bg-[#1a1a1d] px-4 py-3 border-b border-[#2e2e33]">
                <h3 className="text-[13px] font-semibold text-white">Add Automation</h3>
                <p className="text-[11px] text-[#6b6b70] mt-0.5">Click to add to canvas</p>
              </div>
              <div className="p-2">
                {grouped.map(({ category, meta, items }) => (
                  <div key={category} className="mb-2">
                    <p className="text-[10px] uppercase tracking-wider text-[#6b6b70] font-semibold px-2 py-1">
                      {meta.label}
                    </p>
                    {items.map(item => {
                      const Icon = getIcon(item.icon);
                      return (
                        <button
                          key={item.id}
                          onClick={() => addNode(item.id)}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-left text-[12px] text-[#a0a0a5] hover:bg-[#222225] hover:text-white transition-colors"
                        >
                          <Icon size={14} style={{ color: meta.color }} />
                          {item.shortName}
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Canvas */}
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            fitView
            fitViewOptions={{ padding: 0.3 }}
            minZoom={0.2}
            maxZoom={2.5}
            defaultEdgeOptions={{
              animated: true,
              style: { stroke: '#4b4b52', strokeWidth: 1.5 },
            }}
          >
            <Background variant={BackgroundVariant.Dots} gap={24} size={1} color="#222225" />
            <Controls showInteractive={false} />
            <MiniMap
              nodeColor={(node) => {
                if (node.type !== 'automation') return 'transparent';
                const cat = (node.data as Record<string, unknown>).category as Category;
                return categoryMeta[cat]?.color ?? '#6b6b70';
              }}
              maskColor="rgba(0, 0, 0, 0.7)"
              style={{ borderRadius: 8 }}
            />
          </ReactFlow>

          {/* Empty state */}
          {nodes.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center">
                <p className="text-[16px] text-[#6b6b70] mb-2">Empty canvas</p>
                <p className="text-[13px] text-[#5b5b60]">
                  Click &quot;Add Node&quot; to start building your automation flow
                </p>
              </div>
            </div>
          )}

          {/* Flow Configurator Chat */}
          {nodes.length > 0 && (
            <FlowConfigurator
              flowNodes={configuratorNodes}
              flowEdges={configuratorEdges}
              onConfigUpdate={handleConfigUpdate}
              isOpen={showConfigurator}
              onToggle={() => setShowConfigurator(!showConfigurator)}
            />
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

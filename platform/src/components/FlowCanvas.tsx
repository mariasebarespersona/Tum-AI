'use client';

import { useCallback, useMemo } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  BackgroundVariant,
  type Node,
  type Edge,
  type NodeTypes,
  type OnSelectionChangeParams,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import AutomationNode from './AutomationNode';
import { automations, automationFlow, categoryMeta, type Category } from '@/data/automations';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const nodeTypes: NodeTypes = { automation: AutomationNode as any };

function generateLayout(): { nodes: Node[]; edges: Edge[] } {
  const categoryOrder: Category[] = ['payments', 'accounting', 'ai', 'communication', 'data', 'documents', 'analytics', 'infrastructure'];

  const colWidth = 270;
  const rowHeight = 110;
  const categoryGap = 80;
  const startX = 120;
  const startY = 100;

  const nodes: Node[] = [];
  let currentY = startY;

  categoryOrder.forEach((cat) => {
    const items = automations.filter((a) => a.category === cat);
    if (items.length === 0) return;

    nodes.push({
      id: `label-${cat}`,
      type: 'default',
      position: { x: startX - 20, y: currentY - 40 },
      data: { label: `${categoryMeta[cat].label.toUpperCase()}  ·  ${items.length}` },
      style: {
        background: 'transparent',
        border: 'none',
        color: '#6b6b70',
        fontSize: '10px',
        fontWeight: '600',
        letterSpacing: '0.1em',
        padding: '0',
        width: 'auto',
      },
      selectable: false,
      draggable: false,
    });

    const cols = 3;
    items.forEach((item, i) => {
      const col = i % cols;
      const row = Math.floor(i / cols);
      nodes.push({
        id: item.id,
        type: 'automation',
        position: {
          x: startX + col * colWidth,
          y: currentY + row * rowHeight,
        },
        data: { ...item },
      });
    });

    const rows = Math.ceil(items.length / 3);
    currentY += rows * rowHeight + categoryGap;
  });

  const edges: Edge[] = automationFlow.map((e, i) => ({
    id: `e-${i}`,
    source: e.source,
    target: e.target,
    label: e.label,
    animated: true,
    style: { stroke: '#4b4b52', strokeWidth: 1, opacity: 0.6 },
    labelStyle: { fill: '#6b6b70', fontSize: 9, fontWeight: 500 },
    labelBgStyle: { fill: '#161618', fillOpacity: 0.95 },
    labelBgPadding: [5, 3] as [number, number],
    labelBgBorderRadius: 4,
  }));

  return { nodes, edges };
}

interface Props {
  onNodeSelect: (id: string | null) => void;
  selectedNodeId: string | null;
}

export default function FlowCanvas({ onNodeSelect, selectedNodeId }: Props) {
  const { nodes: initialNodes, edges: initialEdges } = useMemo(() => generateLayout(), []);
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);

  const onSelectionChange = useCallback(({ nodes: selectedNodes }: OnSelectionChangeParams) => {
    const selected = selectedNodes.find((n) => n.type === 'automation');
    onNodeSelect(selected?.id ?? null);
  }, [onNodeSelect]);

  const onPaneClick = useCallback(() => {
    onNodeSelect(null);
  }, [onNodeSelect]);

  const nodesWithSelection = useMemo(() =>
    nodes.map((n) => ({
      ...n,
      data: { ...n.data, selected: n.id === selectedNodeId },
    })),
    [nodes, selectedNodeId]
  );

  return (
    <div className="flex-1 h-full relative">
      <ReactFlow
        nodes={nodesWithSelection}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onSelectionChange={onSelectionChange}
        onPaneClick={onPaneClick}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        minZoom={0.2}
        maxZoom={2.5}
        defaultEdgeOptions={{
          animated: true,
          style: { stroke: '#4b4b52', strokeWidth: 1, opacity: 0.6 },
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
    </div>
  );
}

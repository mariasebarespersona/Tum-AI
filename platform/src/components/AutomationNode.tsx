'use client';

import { memo } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import { getIcon } from '@/lib/icons';
import { categoryMeta, type Automation, type Category } from '@/data/automations';

type AutomationNodeData = Automation & { selected?: boolean };

function AutomationNode({ data }: NodeProps & { data: AutomationNodeData }) {
  const Icon = getIcon(data.icon);
  const cat = categoryMeta[data.category as Category];
  const isSelected = data.selected;

  return (
    <div
      className={`
        relative group cursor-pointer
        rounded-lg border px-4 py-3 min-w-[190px] max-w-[210px]
        transition-all duration-150
        ${isSelected
          ? 'bg-[#222225] border-indigo-500/40 shadow-md'
          : 'bg-[#1e1e21] border-[#2e2e33] hover:border-[#3e3e44] hover:bg-[#222225]'
        }
      `}
    >
      {/* Status indicator */}
      {data.status === 'production' && (
        <div className="absolute top-2.5 right-3">
          <div className="w-2 h-2 rounded-full bg-emerald-400" />
        </div>
      )}
      {data.status === 'draft' && (
        <div className="absolute top-2.5 right-3">
          <div className="w-2 h-2 rounded-full bg-amber-400" />
        </div>
      )}

      {/* Handles */}
      <Handle
        type="target"
        position={Position.Left}
        className="!w-2 !h-2 !border-[1.5px] !border-[#3e3e44] !bg-[#1e1e21] hover:!border-indigo-400 !transition-colors"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="!w-2 !h-2 !border-[1.5px] !border-[#3e3e44] !bg-[#1e1e21] hover:!border-indigo-400 !transition-colors"
      />

      {/* Content */}
      <div className="flex items-center gap-3">
        <div
          className="flex-shrink-0 w-8 h-8 rounded-md flex items-center justify-center"
          style={{
            backgroundColor: `${cat.color}12`,
          }}
        >
          <Icon
            size={16}
            style={{ color: cat.color }}
          />
        </div>
        <div className="flex-1 min-w-0">
          <p className={`text-[13px] font-medium truncate leading-tight ${
            isSelected ? 'text-white' : 'text-[#d0d0d3]'
          }`}>
            {data.shortName}
          </p>
          <p className="text-[11px] text-[#6b6b70] mt-0.5">
            {cat.label}
          </p>
        </div>
      </div>

      {/* Meta */}
      <div className="mt-2 flex items-center gap-2">
        {data.dependencies.length > 0 && (
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#2a2a2e] text-[#5b5b60]">
            {data.dependencies.length} deps
          </span>
        )}
        <span className="text-[10px] text-[#5b5b60] ml-auto tabular-nums">
          {data.variables.length} vars
        </span>
      </div>
    </div>
  );
}

export default memo(AutomationNode);

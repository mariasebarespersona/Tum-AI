// ═══════════════════════════════════════════════════════════════
// TUMAI PLATFORM — Core Types
// ═══════════════════════════════════════════════════════════════

export interface Workspace {
  id: string;
  name: string;
  slug: string;
  plan: 'free' | 'starter' | 'pro' | 'enterprise';
  createdAt: string;
  apiKeys: ApiKey[];
  installedAutomations: string[]; // automation IDs
  webhooks: Webhook[];
  members: WorkspaceMember[];
}

export interface WorkspaceMember {
  id: string;
  email: string;
  name: string;
  role: 'owner' | 'admin' | 'editor' | 'viewer';
  avatarUrl?: string;
}

export interface ApiKey {
  id: string;
  name: string;
  prefix: string; // first 8 chars visible
  createdAt: string;
  lastUsedAt?: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  workspaces: string[];
  currentWorkspace: string;
}

export interface Execution {
  id: string;
  automationId: string;
  automationName: string;
  status: 'running' | 'completed' | 'failed' | 'queued';
  trigger: 'manual' | 'cron' | 'webhook' | 'api';
  startedAt: string;
  completedAt?: string;
  duration?: number; // ms
  input?: Record<string, unknown>;
  output?: Record<string, unknown>;
  error?: string;
  logs: ExecutionLog[];
}

export interface ExecutionLog {
  timestamp: string;
  level: 'info' | 'warn' | 'error' | 'debug';
  message: string;
  data?: Record<string, unknown>;
}

export interface Webhook {
  id: string;
  name: string;
  url: string;
  automationId: string;
  events: string[];
  secret: string;
  active: boolean;
  createdAt: string;
  lastTriggeredAt?: string;
}

export interface InstalledAutomation {
  automationId: string;
  installedAt: string;
  config: Record<string, string>;
  active: boolean;
  lastExecutedAt?: string;
  executionCount: number;
  schedule?: string; // cron expression
}

export interface FlowNode {
  id: string;
  automationId: string;
  position: { x: number; y: number };
  config: Record<string, string>;
}

export interface FlowEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
  condition?: string;
}

export interface Flow {
  id: string;
  name: string;
  description: string;
  nodes: FlowNode[];
  edges: FlowEdge[];
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardStats {
  totalAutomations: number;
  activeAutomations: number;
  totalExecutions: number;
  successRate: number;
  executionsToday: number;
  avgDuration: number;
}

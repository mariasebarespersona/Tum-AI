'use client';

import type {
  User, Workspace, Execution, InstalledAutomation, Flow, Webhook, DashboardStats
} from '@/types/platform';

// ═══════════════════════════════════════════════════════════════
// In-memory store with localStorage persistence
// Production: replace with PostgreSQL / Supabase / any DB
// ═══════════════════════════════════════════════════════════════

const STORAGE_KEY = 'tumai_platform_state';

interface PlatformState {
  user: User | null;
  workspace: Workspace | null;
  installedAutomations: InstalledAutomation[];
  executions: Execution[];
  flows: Flow[];
}

const defaultState: PlatformState = {
  user: null,
  workspace: null,
  installedAutomations: [],
  executions: [],
  flows: [],
};

function loadState(): PlatformState {
  if (typeof window === 'undefined') return defaultState;
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? { ...defaultState, ...JSON.parse(saved) } : defaultState;
  } catch {
    return defaultState;
  }
}

function saveState(state: PlatformState) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch { /* quota exceeded — ignore */ }
}

let state = defaultState;

export function initStore() {
  state = loadState();
  return state;
}

// ── Auth ────────────────────────────────────────────────────

export function login(email: string, name: string): User {
  const user: User = {
    id: crypto.randomUUID(),
    email,
    name,
    workspaces: ['ws-default'],
    currentWorkspace: 'ws-default',
  };
  const workspace: Workspace = {
    id: 'ws-default',
    name: `${name}'s Workspace`,
    slug: name.toLowerCase().replace(/\s+/g, '-'),
    plan: 'pro',
    createdAt: new Date().toISOString(),
    apiKeys: [{
      id: crypto.randomUUID(),
      name: 'Default Key',
      prefix: 'tm_' + Math.random().toString(36).slice(2, 10),
      createdAt: new Date().toISOString(),
    }],
    installedAutomations: [],
    webhooks: [],
    members: [{ id: user.id, email, name, role: 'owner' }],
  };
  state = { ...state, user, workspace };
  saveState(state);
  return user;
}

export function logout() {
  state = defaultState;
  saveState(state);
}

export function getUser(): User | null {
  return state.user;
}

export function getWorkspace(): Workspace | null {
  return state.workspace;
}

// ── Installed Automations ───────────────────────────────────

export function installAutomation(automationId: string): InstalledAutomation {
  const existing = state.installedAutomations.find(a => a.automationId === automationId);
  if (existing) return existing;

  const installed: InstalledAutomation = {
    automationId,
    installedAt: new Date().toISOString(),
    config: {},
    active: false,
    executionCount: 0,
  };
  state.installedAutomations = [...state.installedAutomations, installed];
  if (state.workspace) {
    state.workspace.installedAutomations = [
      ...state.workspace.installedAutomations,
      automationId,
    ];
  }
  saveState(state);
  return installed;
}

export function uninstallAutomation(automationId: string) {
  state.installedAutomations = state.installedAutomations.filter(
    a => a.automationId !== automationId
  );
  if (state.workspace) {
    state.workspace.installedAutomations =
      state.workspace.installedAutomations.filter(id => id !== automationId);
  }
  saveState(state);
}

export function getInstalledAutomations(): InstalledAutomation[] {
  return state.installedAutomations;
}

export function isInstalled(automationId: string): boolean {
  return state.installedAutomations.some(a => a.automationId === automationId);
}

export function updateAutomationConfig(automationId: string, config: Record<string, string>) {
  state.installedAutomations = state.installedAutomations.map(a =>
    a.automationId === automationId ? { ...a, config } : a
  );
  saveState(state);
}

export function toggleAutomation(automationId: string) {
  state.installedAutomations = state.installedAutomations.map(a =>
    a.automationId === automationId ? { ...a, active: !a.active } : a
  );
  saveState(state);
}

// ── Executions ──────────────────────────────────────────────

export function createExecution(
  automationId: string,
  automationName: string,
  trigger: Execution['trigger'] = 'manual'
): Execution {
  const execution: Execution = {
    id: crypto.randomUUID(),
    automationId,
    automationName,
    status: 'running',
    trigger,
    startedAt: new Date().toISOString(),
    logs: [
      {
        timestamp: new Date().toISOString(),
        level: 'info',
        message: `Execution started (trigger: ${trigger})`,
      },
    ],
  };
  state.executions = [execution, ...state.executions].slice(0, 100); // keep last 100
  saveState(state);

  // Simulate execution completing after 1-5 seconds
  const duration = 1000 + Math.random() * 4000;
  setTimeout(() => {
    const success = Math.random() > 0.15; // 85% success rate
    completeExecution(execution.id, success, duration);
  }, duration);

  return execution;
}

export function completeExecution(id: string, success: boolean, duration: number) {
  state.executions = state.executions.map(e => {
    if (e.id !== id) return e;
    const completedAt = new Date().toISOString();
    const logs = [
      ...e.logs,
      ...(success
        ? [
            { timestamp: completedAt, level: 'info' as const, message: 'Processing input data...' },
            { timestamp: completedAt, level: 'info' as const, message: 'Automation logic executed successfully' },
            { timestamp: completedAt, level: 'info' as const, message: `Completed in ${Math.round(duration)}ms` },
          ]
        : [
            { timestamp: completedAt, level: 'info' as const, message: 'Processing input data...' },
            { timestamp: completedAt, level: 'error' as const, message: 'Connection timeout after 5000ms' },
            { timestamp: completedAt, level: 'error' as const, message: 'Execution failed — will retry in 60s' },
          ]),
    ];
    // Update execution count on the installed automation
    const installed = state.installedAutomations.find(a => a.automationId === e.automationId);
    if (installed) {
      installed.executionCount++;
      installed.lastExecutedAt = completedAt;
    }
    return {
      ...e,
      status: success ? 'completed' as const : 'failed' as const,
      completedAt,
      duration: Math.round(duration),
      logs,
    };
  });
  saveState(state);
}

export function getExecutions(): Execution[] {
  return state.executions;
}

// ── Flows ───────────────────────────────────────────────────

export function getFlows(): Flow[] {
  return state.flows;
}

export function createFlow(name: string, description: string): Flow {
  const flow: Flow = {
    id: crypto.randomUUID(),
    name,
    description,
    nodes: [],
    edges: [],
    active: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  state.flows = [...state.flows, flow];
  saveState(state);
  return flow;
}

export function updateFlow(id: string, updates: Partial<Flow>) {
  state.flows = state.flows.map(f =>
    f.id === id ? { ...f, ...updates, updatedAt: new Date().toISOString() } : f
  );
  saveState(state);
}

export function deleteFlow(id: string) {
  state.flows = state.flows.filter(f => f.id !== id);
  saveState(state);
}

// ── Webhooks ────────────────────────────────────────────────

export function createWebhook(automationId: string, name: string, events: string[]): Webhook {
  const webhook: Webhook = {
    id: crypto.randomUUID(),
    name,
    url: `https://api.tumai.dev/webhooks/${crypto.randomUUID().slice(0, 8)}`,
    automationId,
    events,
    secret: 'whsec_' + crypto.randomUUID().replace(/-/g, ''),
    active: true,
    createdAt: new Date().toISOString(),
  };
  if (state.workspace) {
    state.workspace.webhooks = [...state.workspace.webhooks, webhook];
  }
  saveState(state);
  return webhook;
}

export function getWebhooks(): Webhook[] {
  return state.workspace?.webhooks ?? [];
}

export function toggleWebhook(id: string) {
  if (!state.workspace) return;
  state.workspace.webhooks = state.workspace.webhooks.map(w =>
    w.id === id ? { ...w, active: !w.active } : w
  );
  saveState(state);
}

export function deleteWebhook(id: string) {
  if (!state.workspace) return;
  state.workspace.webhooks = state.workspace.webhooks.filter(w => w.id !== id);
  saveState(state);
}

// ── Dashboard Stats ─────────────────────────────────────────

export function getDashboardStats(): DashboardStats {
  const executions = state.executions;
  const today = new Date().toISOString().slice(0, 10);
  const todayExecs = executions.filter(e => e.startedAt.startsWith(today));
  const completed = executions.filter(e => e.status === 'completed');
  const total = executions.filter(e => e.status !== 'running');

  return {
    totalAutomations: state.installedAutomations.length,
    activeAutomations: state.installedAutomations.filter(a => a.active).length,
    totalExecutions: executions.length,
    successRate: total.length > 0
      ? Math.round((completed.length / total.length) * 100)
      : 100,
    executionsToday: todayExecs.length,
    avgDuration: completed.length > 0
      ? Math.round(completed.reduce((sum, e) => sum + (e.duration ?? 0), 0) / completed.length)
      : 0,
  };
}

// ── Seed demo data ──────────────────────────────────────────

export function seedDemoData() {
  if (state.executions.length > 0) return; // already seeded

  const demoAutomations = [
    'payment-reminders', 'overdue-alerts', 'email-scheduler',
    'ai-data-assistant', 'payment-lifecycle', 'whatsapp-channel',
  ];

  demoAutomations.forEach(id => installAutomation(id));

  // Activate some
  ['payment-reminders', 'email-scheduler', 'payment-lifecycle'].forEach(id => toggleAutomation(id));

  // Create some past executions
  const statuses: Array<'completed' | 'failed'> = ['completed', 'completed', 'completed', 'completed', 'failed'];
  const triggers: Array<Execution['trigger']> = ['cron', 'manual', 'webhook', 'cron', 'cron'];
  const names = ['Payment Reminders', 'Email Scheduler', 'Payment Lifecycle', 'Overdue Alerts', 'AI Data Assistant'];

  for (let i = 0; i < 12; i++) {
    const hoursAgo = Math.floor(Math.random() * 72);
    const startedAt = new Date(Date.now() - hoursAgo * 3600000).toISOString();
    const duration = 500 + Math.random() * 4500;
    const statusIdx = i % statuses.length;
    const exec: Execution = {
      id: crypto.randomUUID(),
      automationId: demoAutomations[i % demoAutomations.length],
      automationName: names[i % names.length],
      status: statuses[statusIdx],
      trigger: triggers[i % triggers.length],
      startedAt,
      completedAt: new Date(new Date(startedAt).getTime() + duration).toISOString(),
      duration: Math.round(duration),
      logs: [
        { timestamp: startedAt, level: 'info', message: 'Execution started' },
        { timestamp: startedAt, level: 'info', message: statuses[statusIdx] === 'completed' ? 'Completed successfully' : 'Failed: timeout' },
      ],
    };
    state.executions.push(exec);
  }

  saveState(state);
}

'use client';

import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { MessageSquare, Send, X, Sparkles, Check, ChevronRight } from 'lucide-react';
import { automations, type Automation } from '@/data/automations';
import { updateAutomationConfig } from '@/lib/store';

// ═══════════════════════════════════════════════════════════════
// FlowConfigurator — AI Chat that configures automation flows
//
// When the user builds a flow (e.g., scraper → rules → whatsapp),
// the chat walks them through configuring each node's variables
// by asking plain-language questions instead of showing raw forms.
// ═══════════════════════════════════════════════════════════════

const automationById = new Map(automations.map(a => [a.id, a]));

// ── Question templates per automation ───────────────────────

interface Question {
  key: string;           // maps to variable name
  question: string;      // what to ask the user
  type: 'text' | 'list' | 'choice' | 'number';
  examples?: string[];
  choices?: string[];
  required?: boolean;
}

// Questions keyed by automation ID — the chat knows what to ask for each type
const AUTOMATION_QUESTIONS: Record<string, Question[]> = {
  'web-scraper-browser': [
    {
      key: 'SOURCES',
      question: 'What websites do you want to scrape? List them separated by commas.',
      type: 'list',
      examples: ['idealista.com', 'fotocasa.es', 'milanuncios.com', 'pisos.com'],
      required: true,
    },
    {
      key: 'SEARCH_LOCATION',
      question: 'What location/area are you searching in?',
      type: 'text',
      examples: ['Madrid', 'Barcelona centro', 'Valencia', 'Costa del Sol'],
      required: true,
    },
    {
      key: 'SEARCH_TYPE',
      question: 'What type of property?',
      type: 'choice',
      choices: ['Buy', 'Rent', 'Both'],
      required: true,
    },
    {
      key: 'SCHEDULE_CRON',
      question: 'How often should it scrape? (e.g., "every 6 hours", "3 times a day", "once a day")',
      type: 'text',
      examples: ['every 6 hours', 'once a day at 9am', '3 times a day'],
    },
  ],
  'web-scraper-json': [
    {
      key: 'SOURCES',
      question: 'What API endpoints or data sources do you want to pull from?',
      type: 'list',
      examples: ['https://api.example.com/listings'],
      required: true,
    },
    {
      key: 'SCHEDULE_CRON',
      question: 'How often should it run?',
      type: 'text',
      examples: ['every hour', 'every 6 hours', 'once a day'],
    },
  ],
  'rules-engine': [
    {
      key: 'PRICE_MAX',
      question: 'What\'s your maximum price?',
      type: 'number',
      examples: ['250000', '500000', '1000'],
      required: true,
    },
    {
      key: 'PRICE_MIN',
      question: 'Minimum price? (or skip)',
      type: 'number',
      examples: ['50000', '100000'],
    },
    {
      key: 'BEDROOMS_MIN',
      question: 'Minimum number of bedrooms?',
      type: 'number',
      examples: ['1', '2', '3'],
    },
    {
      key: 'SQM_MIN',
      question: 'Minimum size in m²? (or skip)',
      type: 'number',
      examples: ['50', '80', '100'],
    },
    {
      key: 'EXTRA_FILTERS',
      question: 'Any other filters? (e.g., "with terrace", "no ground floor", "parking included")',
      type: 'text',
      examples: ['with terrace', 'elevator required', 'parking included'],
    },
  ],
  'whatsapp-channel': [
    {
      key: 'PHONE_NUMBER',
      question: 'What phone number should receive the WhatsApp alerts? (with country code)',
      type: 'text',
      examples: ['+34612345678', '+1234567890'],
      required: true,
    },
    {
      key: 'MESSAGE_FORMAT',
      question: 'How do you want the messages formatted?',
      type: 'choice',
      choices: ['Compact (one line per listing)', 'Detailed (full info + image)', 'Summary (daily digest)'],
    },
    {
      key: 'ALERT_FREQUENCY',
      question: 'When should you be notified?',
      type: 'choice',
      choices: ['Immediately (each new listing)', 'Batch every few hours', 'Daily digest'],
    },
  ],
  'email-scheduler': [
    {
      key: 'EMAIL_TO',
      question: 'What email address should receive notifications?',
      type: 'text',
      required: true,
    },
    {
      key: 'EMAIL_FROM_NAME',
      question: 'What sender name? (e.g., "Tumai Alerts")',
      type: 'text',
    },
  ],
  'ai-data-assistant': [
    {
      key: 'SYSTEM_PROMPT',
      question: 'What should the assistant know about your business? Describe it briefly.',
      type: 'text',
      required: true,
    },
    {
      key: 'TOOLS',
      question: 'What data should the assistant be able to query? (e.g., payments, properties, clients)',
      type: 'list',
    },
  ],
  'payment-reminders': [
    {
      key: 'REMINDER_WINDOWS',
      question: 'How many days before/after the due date should reminders be sent? (e.g., "3 days before, on the day, 1 day after")',
      type: 'text',
      required: true,
    },
    {
      key: 'NOTIFICATION_CHANNEL',
      question: 'How should reminders be sent?',
      type: 'choice',
      choices: ['Email', 'WhatsApp', 'Both'],
      required: true,
    },
  ],
};

// Fallback questions for automations without custom questions
const DEFAULT_QUESTIONS: Question[] = [
  {
    key: 'DB_CONNECTION',
    question: 'What database should this connect to? (connection string or "default")',
    type: 'text',
  },
];

interface ChatMessage {
  id: string;
  role: 'assistant' | 'user' | 'system';
  content: string;
  choices?: string[];
  examples?: string[];
  nodeId?: string;     // which flow node this relates to
  questionKey?: string; // which variable this answer maps to
}

interface FlowNodeInfo {
  nodeId: string;
  automationId: string;
  automation: Automation;
  config: Record<string, string>;
  configured: boolean;
}

interface Props {
  flowNodes: Array<{ id: string; data: Record<string, unknown> }>;
  flowEdges: Array<{ source: string; target: string }>;
  onConfigUpdate: (nodeId: string, config: Record<string, string>) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export default function FlowConfigurator({ flowNodes, flowEdges, onConfigUpdate, isOpen, onToggle }: Props) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [currentNodeIdx, setCurrentNodeIdx] = useState(0);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [nodeConfigs, setNodeConfigs] = useState<FlowNodeInfo[]>([]);
  const [configStarted, setConfigStarted] = useState(false);
  const [allDone, setAllDone] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  // Ref to hold accumulated configs across async state updates
  const configsRef = useRef<FlowNodeInfo[]>([]);

  // Auto-scroll to bottom
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  // Build ordered node list from flow (following edges)
  // Only rebuild when node IDs or edge connections actually change — NOT when node data updates
  const flowNodeIds = useMemo(() => flowNodes.map(n => n.id).sort().join(','), [flowNodes]);
  const flowEdgeKeys = useMemo(() => flowEdges.map(e => `${e.source}->${e.target}`).sort().join(','), [flowEdges]);

  useEffect(() => {
    if (flowNodes.length === 0) {
      setNodeConfigs([]);
      configsRef.current = [];
      return;
    }

    // If we're already configuring, don't reset — just return
    if (configStarted && configsRef.current.length > 0) {
      return;
    }

    // Topological sort via edges
    const ordered: FlowNodeInfo[] = [];
    const visited = new Set<string>();

    // Find start nodes (no incoming edges)
    const targets = new Set(flowEdges.map(e => e.target));
    const startNodes = flowNodes.filter(n => !targets.has(n.id));
    const queue = startNodes.length > 0 ? [...startNodes] : [...flowNodes];

    const edgeMap = new Map<string, string>();
    flowEdges.forEach(e => edgeMap.set(e.source, e.target));

    // BFS following edges
    while (queue.length > 0) {
      const node = queue.shift()!;
      if (visited.has(node.id)) continue;
      visited.add(node.id);

      const automationId = (node.data.id as string) || '';
      const automation = automationById.get(automationId);
      if (automation) {
        // Preserve existing config if we have one
        const existing = configsRef.current.find(c => c.nodeId === node.id);
        ordered.push(existing || {
          nodeId: node.id,
          automationId,
          automation,
          config: {},
          configured: false,
        });
      }

      const nextId = edgeMap.get(node.id);
      if (nextId) {
        const nextNode = flowNodes.find(n => n.id === nextId);
        if (nextNode) queue.push(nextNode);
      }
    }

    // Add any unvisited nodes
    flowNodes.forEach(n => {
      if (!visited.has(n.id)) {
        const automationId = (n.data.id as string) || '';
        const automation = automationById.get(automationId);
        if (automation) {
          const existing = configsRef.current.find(c => c.nodeId === n.id);
          ordered.push(existing || { nodeId: n.id, automationId, automation, config: {}, configured: false });
        }
      }
    });

    setNodeConfigs(ordered);
    configsRef.current = ordered;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flowNodeIds, flowEdgeKeys]);

  const getQuestions = (automationId: string): Question[] => {
    return AUTOMATION_QUESTIONS[automationId] || DEFAULT_QUESTIONS;
  };

  const addMessage = useCallback((msg: Omit<ChatMessage, 'id'>) => {
    setMessages(prev => [...prev, { ...msg, id: crypto.randomUUID() }]);
  }, []);

  // Start configuration flow
  const startConfig = useCallback(() => {
    if (nodeConfigs.length === 0) return;

    setConfigStarted(true);
    setCurrentNodeIdx(0);
    setCurrentQuestionIdx(0);
    setAllDone(false);

    const nodeNames = nodeConfigs.map(n => `**${n.automation.name}**`).join(' → ');
    addMessage({
      role: 'system',
      content: `Flow detected: ${nodeNames}`,
    });

    addMessage({
      role: 'assistant',
      content: `I'll walk you through configuring each automation in your flow. Let's start!\n\n**Step 1/${nodeConfigs.length}: ${nodeConfigs[0].automation.name}**`,
    });

    // Ask first question of first node
    const questions = getQuestions(nodeConfigs[0].automationId);
    if (questions.length > 0) {
      const q = questions[0];
      addMessage({
        role: 'assistant',
        content: q.question,
        choices: q.choices,
        examples: q.examples,
        nodeId: nodeConfigs[0].nodeId,
        questionKey: q.key,
      });
    }
  }, [nodeConfigs, addMessage]);

  const processAnswer = useCallback((answer: string) => {
    if (allDone) return;
    const configs = configsRef.current;
    if (configs.length === 0) return;

    const currentNode = configs[currentNodeIdx];
    const questions = getQuestions(currentNode.automationId);
    const currentQuestion = questions[currentQuestionIdx];

    // Save the answer to ref (single source of truth)
    if (currentQuestion && answer) {
      configs[currentNodeIdx] = {
        ...configs[currentNodeIdx],
        config: {
          ...configs[currentNodeIdx].config,
          [currentQuestion.key]: answer,
        },
      };
      // Notify parent
      onConfigUpdate(currentNode.nodeId, configs[currentNodeIdx].config);
      updateAutomationConfig(currentNode.automationId, configs[currentNodeIdx].config);
    }

    // Move to next question or next node
    const nextQuestionIdx = currentQuestionIdx + 1;
    if (nextQuestionIdx < questions.length) {
      // More questions for this node
      setCurrentQuestionIdx(nextQuestionIdx);
      const q = questions[nextQuestionIdx];
      addMessage({
        role: 'assistant',
        content: q.question,
        choices: q.choices,
        examples: q.examples,
        nodeId: currentNode.nodeId,
        questionKey: q.key,
      });
    } else {
      // This node is done — mark configured
      configs[currentNodeIdx] = { ...configs[currentNodeIdx], configured: true };

      const nextNodeIdx = currentNodeIdx + 1;
      if (nextNodeIdx < configs.length) {
        // Move to next node
        setCurrentNodeIdx(nextNodeIdx);
        setCurrentQuestionIdx(0);
        const nextNode = configs[nextNodeIdx];

        addMessage({
          role: 'system',
          content: `${currentNode.automation.name} configured`,
        });

        addMessage({
          role: 'assistant',
          content: `**Step ${nextNodeIdx + 1}/${configs.length}: ${nextNode.automation.name}**`,
        });

        const nextQuestions = getQuestions(nextNode.automationId);
        if (nextQuestions.length > 0) {
          const q = nextQuestions[0];
          addMessage({
            role: 'assistant',
            content: q.question,
            choices: q.choices,
            examples: q.examples,
            nodeId: nextNode.nodeId,
            questionKey: q.key,
          });
        }
      } else {
        // All nodes done!
        setAllDone(true);
        addMessage({
          role: 'system',
          content: `All ${configs.length} automations configured`,
        });

        // Build summary from ref (has ALL accumulated answers)
        const summary = configs.map(n => {
          const entries = Object.entries(n.config).filter(([, v]) => v);
          const configEntries = entries
            .map(([k, v]) => `  • ${k}: ${v}`)
            .join('\n');
          return `**${n.automation.name}**\n${configEntries || '  (default config)'}`;
        }).join('\n\n');

        addMessage({
          role: 'assistant',
          content: `Your flow is ready! Here's the configuration:\n\n${summary}\n\nHit **Save** in the toolbar to save this flow. The automations will use these settings when executed.`,
        });
      }
    }

    // Sync ref to state for UI reactivity
    setNodeConfigs([...configs]);
    configsRef.current = configs;
  }, [allDone, currentNodeIdx, currentQuestionIdx, addMessage, onConfigUpdate]);

  const handleSend = () => {
    const text = input.trim();
    if (!text) return;

    addMessage({ role: 'user', content: text });
    setInput('');

    if (!configStarted) {
      startConfig();
      return;
    }

    processAnswer(text);
  };

  const handleChoiceClick = (choice: string) => {
    addMessage({ role: 'user', content: choice });
    processAnswer(choice);
  };

  const handleSkip = () => {
    addMessage({ role: 'user', content: '(skipped)' });
    processAnswer('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Count configured nodes
  const configuredCount = nodeConfigs.filter(n => n.configured).length;

  if (!isOpen) {
    return (
      <button
        onClick={onToggle}
        className="absolute bottom-6 right-6 z-20 flex items-center gap-2 px-4 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white text-[13px] font-medium rounded-xl shadow-lg transition-all hover:scale-105"
      >
        <MessageSquare size={16} />
        Configure Flow
        {nodeConfigs.length > 0 && (
          <span className="ml-1 px-1.5 py-0.5 bg-white/20 rounded text-[11px]">
            {configuredCount}/{nodeConfigs.length}
          </span>
        )}
      </button>
    );
  }

  return (
    <div className="absolute bottom-4 right-4 z-20 w-[380px] h-[520px] bg-[#1a1a1d] border border-[#2e2e33] rounded-xl shadow-2xl flex flex-col overflow-hidden animate-slide-in">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#2e2e33]">
        <div className="flex items-center gap-2">
          <Sparkles size={16} className="text-indigo-400" />
          <h3 className="text-[14px] font-semibold text-white">Flow Configurator</h3>
          {nodeConfigs.length > 0 && (
            <span className="text-[11px] px-1.5 py-0.5 rounded bg-[#222225] text-[#8b8b8f]">
              {configuredCount}/{nodeConfigs.length} done
            </span>
          )}
        </div>
        <button onClick={onToggle} className="p-1 hover:bg-[#222225] rounded transition-colors">
          <X size={14} className="text-[#6b6b70]" />
        </button>
      </div>

      {/* Progress bar */}
      {nodeConfigs.length > 0 && (
        <div className="px-4 py-2 border-b border-[#2e2e33]">
          <div className="flex items-center gap-1.5">
            {nodeConfigs.map((node, i) => (
              <div key={node.nodeId} className="flex items-center gap-1.5">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-semibold ${
                  node.configured
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : i === currentNodeIdx && configStarted
                      ? 'bg-indigo-500/20 text-indigo-400'
                      : 'bg-[#222225] text-[#6b6b70]'
                }`}>
                  {node.configured ? <Check size={10} /> : i + 1}
                </div>
                <span className={`text-[10px] truncate max-w-[60px] ${
                  node.configured ? 'text-emerald-400' :
                  i === currentNodeIdx && configStarted ? 'text-white' : 'text-[#6b6b70]'
                }`}>
                  {node.automation.shortName}
                </span>
                {i < nodeConfigs.length - 1 && (
                  <ChevronRight size={10} className="text-[#3e3e44]" />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
        {messages.length === 0 && nodeConfigs.length > 0 && (
          <div className="text-center py-8">
            <Sparkles size={24} className="mx-auto text-indigo-400/50 mb-3" />
            <p className="text-[14px] text-[#8b8b8f] mb-1">Ready to configure your flow</p>
            <p className="text-[12px] text-[#6b6b70] mb-4">
              {nodeConfigs.length} automation{nodeConfigs.length > 1 ? 's' : ''} detected
            </p>
            <button
              onClick={startConfig}
              className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white text-[13px] font-medium rounded-lg transition-colors"
            >
              Start Configuration
            </button>
          </div>
        )}

        {messages.length === 0 && nodeConfigs.length === 0 && (
          <div className="text-center py-8">
            <MessageSquare size={24} className="mx-auto text-[#3e3e44] mb-3" />
            <p className="text-[14px] text-[#6b6b70]">Add nodes to your flow first</p>
            <p className="text-[12px] text-[#5b5b60]">Then I&apos;ll help you configure them</p>
          </div>
        )}

        {messages.map((msg) => (
          <div key={msg.id}>
            {msg.role === 'system' ? (
              <div className="flex items-center gap-2 py-1">
                <div className="h-px flex-1 bg-[#2e2e33]" />
                <span className="text-[10px] text-[#6b6b70] flex items-center gap-1">
                  <Check size={10} className="text-emerald-400" />
                  {msg.content}
                </span>
                <div className="h-px flex-1 bg-[#2e2e33]" />
              </div>
            ) : (
              <div className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-xl px-3.5 py-2.5 ${
                  msg.role === 'user'
                    ? 'bg-indigo-500 text-white'
                    : 'bg-[#222225] text-[#d0d0d3] border border-[#2e2e33]'
                }`}>
                  <p className="text-[13px] leading-relaxed whitespace-pre-wrap">{msg.content}</p>

                  {/* Choice buttons */}
                  {msg.choices && msg.role === 'assistant' && !allDone && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {msg.choices.map(choice => (
                        <button
                          key={choice}
                          onClick={() => handleChoiceClick(choice)}
                          className="px-2.5 py-1 text-[11px] bg-[#2a2a2e] hover:bg-indigo-500/20 hover:text-indigo-300 text-[#a0a0a5] rounded-md border border-[#3e3e44] transition-colors"
                        >
                          {choice}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Example hints */}
                  {msg.examples && msg.role === 'assistant' && !allDone && (
                    <p className="text-[10px] text-[#6b6b70] mt-1.5">
                      e.g. {msg.examples.slice(0, 3).join(', ')}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="px-3 py-3 border-t border-[#2e2e33]">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              allDone ? 'Flow configured!'
              : !configStarted ? 'Type to start...'
              : 'Your answer...'
            }
            disabled={allDone}
            className="flex-1 px-3 py-2 text-[13px] bg-[#222225] border border-[#2e2e33] rounded-lg text-white placeholder-[#6b6b70] focus:outline-none focus:border-indigo-500/50 disabled:opacity-50 transition-colors"
          />
          {configStarted && !allDone && (
            <button
              onClick={handleSkip}
              className="px-2 py-2 text-[11px] text-[#6b6b70] hover:text-white transition-colors"
            >
              Skip
            </button>
          )}
          <button
            onClick={handleSend}
            disabled={!input.trim() || allDone}
            className="p-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg transition-colors disabled:opacity-30"
          >
            <Send size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

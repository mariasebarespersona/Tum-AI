---
name: flow-configurator
description: Build and extend the Tumai Flow Configurator — the conversational chat inside the visual flow editor that walks users through configuring automation dependencies via plain-language questions instead of raw forms. Use when adding new automation question templates, extending the chat logic, or integrating new automation types.
---

# Flow Configurator Skill

The Flow Configurator is a chat panel embedded in Tumai's visual flow editor (`/editor`). When a user builds a flow by connecting automation nodes on the canvas, the chat activates and walks them through configuring each node in plain language.

## Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                     FLOW EDITOR PAGE                          │
│                                                               │
│  ┌─────────────────────────────────┐  ┌────────────────────┐ │
│  │                                 │  │  FlowConfigurator  │ │
│  │         React Flow Canvas       │  │  (Chat Panel)      │ │
│  │                                 │  │                    │ │
│  │  [Scraper] ──→ [Rules] ──→ [WA] │  │  "What websites?"  │ │
│  │                                 │  │  > idealista.com   │ │
│  │                                 │  │  "What location?"  │ │
│  │                                 │  │  > Madrid          │ │
│  │                                 │  │  "Max price?"      │ │
│  │                                 │  │  > 250000          │ │
│  │                                 │  │  ✓ All configured  │ │
│  └─────────────────────────────────┘  └────────────────────┘ │
└──────────────────────────────────────────────────────────────┘
```

## How It Works

1. User adds automation nodes to canvas and connects them with edges
2. Chat auto-opens when ≥2 nodes are connected
3. Chat detects the flow topology (topological sort via edges)
4. For each node (in order), it asks the relevant questions
5. User answers in plain language or clicks choice buttons
6. Answers are saved as automation config (stored in node data + localStorage)
7. When all nodes are configured, a summary is shown

## Key Components

### FlowConfigurator Component
**File**: `tumai/platform/src/components/FlowConfigurator.tsx`

**Props**:
```typescript
interface Props {
  flowNodes: Array<{ id: string; data: Record<string, unknown> }>;
  flowEdges: Array<{ source: string; target: string }>;
  onConfigUpdate: (nodeId: string, config: Record<string, string>) => void;
  isOpen: boolean;
  onToggle: () => void;
}
```

**State**:
- `messages`: Chat history
- `currentNodeIdx`: Which automation we're configuring
- `currentQuestionIdx`: Which question within that automation
- `nodeConfigs`: Config collected so far per node

### Question Templates
Each automation has a set of questions defined in `AUTOMATION_QUESTIONS`:

```typescript
interface Question {
  key: string;           // maps to automation variable name
  question: string;      // plain-language question
  type: 'text' | 'list' | 'choice' | 'number';
  examples?: string[];   // shown as hints
  choices?: string[];    // rendered as clickable buttons
  required?: boolean;
}
```

## Adding Questions for a New Automation

When a new automation is added to the catalog, add its questions to the `AUTOMATION_QUESTIONS` map in `FlowConfigurator.tsx`:

```typescript
'my-new-automation': [
  {
    key: 'API_KEY',              // matches the variable name in automations.ts
    question: 'What API key should this use?',
    type: 'text',
    required: true,
  },
  {
    key: 'MODE',
    question: 'Which mode?',
    type: 'choice',
    choices: ['Simple', 'Advanced', 'Custom'],
  },
],
```

**Rules**:
- `key` must match a variable name in the automation's `variables` array
- Questions should be plain language, not technical jargon
- Always provide `examples` for text inputs to guide the user
- Use `choices` when there are a fixed set of options
- Mark `required: true` for essential config only
- Order questions from most important to least (user can skip optional ones)

## Currently Supported Automations

| Automation | # Questions | Key Config |
|------------|-------------|------------|
| `web-scraper-browser` | 4 | Sources, location, type, schedule |
| `web-scraper-json` | 2 | API endpoints, schedule |
| `rules-engine` | 5 | Price range, bedrooms, sqm, extra filters |
| `whatsapp-channel` | 3 | Phone number, message format, frequency |
| `email-scheduler` | 2 | Email address, sender name |
| `ai-data-assistant` | 2 | System prompt, data tools |
| `payment-reminders` | 2 | Reminder windows, notification channel |

Automations without custom questions get a generic fallback (DB connection).

## Flow Detection Logic

The configurator processes nodes in topological order:

1. Find nodes with no incoming edges (start nodes)
2. Follow edges to find the order: start → middle → end
3. If no edges, process nodes in the order they were added
4. Skip non-automation nodes (labels, etc.)

This ensures the chat configures the scraper before the filter before the notifier — matching the user's mental model of the data flow.

## Chat UX Patterns

### Choice Buttons
When a question has `choices`, clickable buttons appear below the question:
```
How should reminders be sent?
  [Email]  [WhatsApp]  [Both]
```

### Skip
Optional questions show a "Skip" button. Skipped questions use empty string as config value.

### Progress Bar
A horizontal progress indicator shows numbered steps with automation names:
```
① Browser Bot → ② Rules Engine → ③ WhatsApp
```
Steps turn green when configured.

### Summary
After all nodes are configured, a markdown summary shows the full config:
```
**Browser Automation**
  • SOURCES: idealista.com, fotocasa.es
  • SEARCH_LOCATION: Madrid

**Rules Engine**
  • PRICE_MAX: 250000
  • BEDROOMS_MIN: 2

**WhatsApp Channel**
  • PHONE_NUMBER: +34612345678
```

## Integration with Editor

The editor page (`/editor`) integrates the configurator:

1. `FlowConfigurator` receives `flowNodes` and `flowEdges` as props
2. When config is updated, `onConfigUpdate(nodeId, config)` is called
3. Config is stored in the node's `data._config` field
4. On save, the full flow (nodes + edges + configs) can be persisted

## Extending to LLM-Powered Configuration

The current implementation uses static question templates. To make it truly AI-powered:

1. Replace `AUTOMATION_QUESTIONS` with a Claude API call
2. Send the automation's `variables` array as context
3. Let Claude generate contextual questions based on:
   - The automation type
   - What other nodes are in the flow
   - Previous answers (e.g., if source is "idealista", ask Spain-specific filters)
4. Use Claude's tool_use to validate and structure the answers

```python
# Future: LLM-powered question generation
response = anthropic.messages.create(
    model="claude-sonnet-4-6-20250514",
    system="You are configuring a web scraper automation...",
    messages=[{"role": "user", "content": "The user selected idealista.com as source"}],
    tools=[{
        "name": "set_config",
        "input_schema": {
            "properties": {
                "SOURCES": {"type": "array"},
                "SEARCH_LOCATION": {"type": "string"},
                ...
            }
        }
    }]
)
```

This is the Phase 2 evolution — for now, static templates are fast and predictable.

# Example: Standalone FAQ Bot (Zero Client Data)

This is the simplest WhatsApp integration — a conversational AI bot that answers
questions about a business using only a system prompt. No database, no client records,
no payment data required.

**Why this is the ideal first demo:**
- Only needs: Twilio sandbox + LLM API key
- Zero database setup
- Works in < 30 minutes
- Demonstrates the full inbound/outbound flow
- Easily customizable via system prompt

## What You Need

| Requirement | How to Get |
|-------------|-----------|
| Twilio account | twilio.com (free trial) |
| WhatsApp Sandbox | Twilio Console → Messaging → WhatsApp Sandbox |
| LLM API key | Anthropic or OpenAI |
| Public URL | ngrok (dev) or Railway (prod) |

## Complete Implementation

```python
"""
standalone_faq_bot.py — WhatsApp FAQ bot powered by Claude.
Zero database. Zero client data. Pure conversation.

Run: uvicorn standalone_faq_bot:app --port 8000
Expose: ngrok http 8000
Configure: Twilio Sandbox webhook → https://<ngrok-url>/webhook
"""

from fastapi import FastAPI, Request, Response
from twilio.twiml.messaging_response import MessagingResponse
from twilio.request_validator import RequestValidator
from anthropic import Anthropic
import os

app = FastAPI()

# Config from environment
TWILIO_AUTH_TOKEN = os.environ["TWILIO_AUTH_TOKEN"]
ANTHROPIC_API_KEY = os.environ.get("ANTHROPIC_API_KEY", os.environ.get("LLM_API_KEY"))

validator = RequestValidator(TWILIO_AUTH_TOKEN)
anthropic = Anthropic(api_key=ANTHROPIC_API_KEY)

# In-memory conversation history (per phone number)
# In production, replace with Redis or DB
conversations: dict[str, list] = {}

# This is the ONLY thing a client needs to customize
SYSTEM_PROMPT = """You are a helpful business assistant.
You answer questions about the company's services, pricing, and availability.

Rules:
- Keep responses SHORT (under 300 characters) — this is WhatsApp
- Be warm but professional
- If you don't know something, say so honestly
- Respond in the same language the user writes in
- Never make up prices, dates, or contact info

Company info:
- [CUSTOMIZE: Add your company description here]
- [CUSTOMIZE: Add services, pricing, hours, location]
- [CUSTOMIZE: Add FAQ answers]
"""


@app.post("/webhook")
async def whatsapp_webhook(request: Request):
    """Receive WhatsApp messages from Twilio and respond with AI."""
    form_data = await request.form()
    form_dict = dict(form_data)

    # Validate Twilio signature (skip in dev with sandbox)
    # signature = request.headers.get("X-Twilio-Signature", "")
    # if not validator.validate(str(request.url), form_dict, signature):
    #     return Response(status_code=403)

    from_number = form_dict.get("From", "").replace("whatsapp:", "")
    body = form_dict.get("Body", "").strip()

    if not body:
        return _twiml_response("Send me a message and I'll help you!")

    # Get or create conversation history
    if from_number not in conversations:
        conversations[from_number] = []

    history = conversations[from_number]

    # Add user message
    history.append({"role": "user", "content": body})

    # Keep only last 10 messages for context
    if len(history) > 10:
        history = history[-10:]
        conversations[from_number] = history

    # Call Claude
    try:
        response = anthropic.messages.create(
            model="claude-sonnet-4-6-20250514",
            max_tokens=500,
            system=SYSTEM_PROMPT,
            messages=history,
        )
        reply = response.content[0].text

        # Save assistant response to history
        history.append({"role": "assistant", "content": reply})
    except Exception as e:
        reply = "Sorry, I'm having trouble right now. Please try again in a moment."
        print(f"LLM error: {e}")

    return _twiml_response(reply)


@app.get("/health")
async def health():
    return {"status": "ok", "active_conversations": len(conversations)}


def _twiml_response(text: str) -> Response:
    twiml = MessagingResponse()
    twiml.message(text)
    return Response(content=str(twiml), media_type="application/xml")
```

## Setup Steps (< 30 minutes)

### 1. Install dependencies
```bash
pip install fastapi uvicorn twilio anthropic
```

### 2. Set environment variables
```bash
export TWILIO_AUTH_TOKEN="your_token"
export ANTHROPIC_API_KEY="sk-ant-..."
```

### 3. Run the server
```bash
uvicorn standalone_faq_bot:app --port 8000
```

### 4. Expose with ngrok (for development)
```bash
ngrok http 8000
# Copy the https URL
```

### 5. Configure Twilio Sandbox
1. Go to Twilio Console → Messaging → WhatsApp Sandbox
2. Set "When a message comes in" to: `https://<your-ngrok-url>/webhook`
3. Method: POST

### 6. Test it
1. Send "join <sandbox-word>" to the Twilio sandbox number
2. Send any message — the bot responds!

## Customization

The ONLY thing to change for a new client is `SYSTEM_PROMPT`:

```python
SYSTEM_PROMPT = """You are the assistant for Garcia's Plumbing.

Services:
- Emergency repairs: $150/hour (24/7)
- Drain cleaning: $99 flat rate
- Water heater installation: $800-$1,500
- Free estimates for big jobs

Hours: Mon-Fri 7am-6pm, Sat 8am-2pm
Phone: (555) 123-4567
Address: 123 Main St, Houston TX

Common questions:
- We accept cash, credit cards, and financing
- Licensed and insured (TX License #12345)
- 90-day warranty on all repairs
"""
```

That's it. Same code, different prompt, different business.

# Conversation Patterns

Patterns extracted from Kapso's `automate-whatsapp` skill, adapted for Tumai + Twilio.

## Pattern 1: Linear Notification (Outbound Only)

```
[CRON trigger] → [Query DB for pending items] → [Send template] → [Log]
```

No webhook needed. Fire and forget.

**Use cases**: payment-reminders, overdue-alerts, contract-completion-cascade

**Implementation**:
```python
# In the automation's cron job:
payments = get_upcoming_payments(window_days=3)
for payment in payments:
    await whatsapp.send_template(
        to=payment.client_phone,
        template_sid="HXxxx",
        variables={"1": payment.client_name, "2": str(payment.amount)},
        automation_id="payment-reminders"
    )
```

## Pattern 2: Request-Response (Bidirectional)

```
[User sends message] → [Webhook] → [Identify user] → [Process with LLM] → [Reply]
```

Single turn. No multi-step flow.

**Use cases**: ai-data-assistant, FAQ bot, balance inquiries

**Implementation**:
```python
# Webhook handler returns TwiML response
async def handle(message):
    history = await whatsapp.get_conversation_as_llm_messages(message["from"])
    response = await call_claude(history + [{"role": "user", "content": message["body"]}])
    return response.content[0].text
```

## Pattern 3: Multi-Step Flow (Guided)

```
[User sends message] → [Webhook] → [Identify step in flow]
    → Step 1: Ask name → [Wait for response]
    → Step 2: Ask amount → [Wait for response]
    → Step 3: Confirm → [Execute action]
```

Requires conversation state tracking.

**Use cases**: onboarding, purchase initiation, data collection

**Implementation**:
```python
# Conversation context tracks the current step
conversation = message["conversation"]
step = conversation["context"].get("step", 0)

if step == 0:
    # Start flow
    await update_context(conversation["id"], {"step": 1, "flow": "purchase"})
    return "What property are you interested in? Reply with the property ID."
elif step == 1:
    # Process property selection
    property_id = message["body"].strip()
    await update_context(conversation["id"], {"step": 2, "property_id": property_id})
    return f"Property {property_id} selected. Reply CONFIRM to proceed."
elif step == 2:
    if message["body"].strip().upper() == "CONFIRM":
        await execute_purchase(conversation["context"])
        await close_conversation(conversation["id"])
        return "Purchase initiated! You'll receive a confirmation shortly."
```

## Pattern 4: Media Processing

```
[User sends photo/audio] → [Webhook] → [Route by media type]
    → Audio: transcribe with Whisper → process text
    → Image: classify with Vision → respond
```

**Use cases**: ai-voice-processor, ai-photo-classifier, ai-asset-inspector

**Implementation**:
```python
if message["media_type"].startswith("audio/"):
    # Download from Twilio, transcribe, process
    audio_url = message["media_url"]
    transcript = await transcribe_audio(audio_url)
    return await handle_data_query({"body": transcript, **message})

elif message["media_type"].startswith("image/"):
    image_url = message["media_url"]
    analysis = await classify_photo(image_url)
    return f"Photo analysis: {analysis['category']} (confidence: {analysis['score']}%)"
```

## Pattern 5: Escalation to Human

```
[User in bot conversation] → [Bot can't help / user requests human]
    → [Update conversation: active_automation = None, status = "escalated"]
    → [Notify admin via WhatsApp/email]
    → [Human takes over in CRM]
```

**Keywords that trigger escalation**: "hablar con alguien", "agente", "humano", "persona real"

## Anti-Patterns to Avoid

1. **Don't send too many messages** — WhatsApp will rate-limit and potentially ban
2. **Don't ignore the 24h window** — Templates only outside session
3. **Don't store media URLs long-term** — Twilio media URLs expire
4. **Don't skip dedup** — Cron can run twice; always check notification_log
5. **Don't send walls of text** — Keep under 300 chars, use multiple messages if needed

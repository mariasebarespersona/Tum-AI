# Twilio WhatsApp API Reference

## Key Concepts

### Session Window (24h Rule)
- **User-initiated**: When a user messages your number, a 24h session opens
- **During session**: Send any free-form text, media, interactive messages
- **Outside session**: MUST use pre-approved templates (HSM)
- **Session resets**: Each user message resets the 24h timer

### Message Types

| Type | In-session | Out-of-session | Method |
|------|-----------|----------------|--------|
| Text | Yes | No | `messages.create(body=...)` |
| Template | Yes | Yes | `messages.create(content_sid=...)` |
| Media | Yes | No | `messages.create(media_url=...)` |
| Interactive | Yes | No | Via Content Templates |

### Twilio Content Templates (for WhatsApp)
Twilio uses **Content Templates** (HXxxx SIDs) to wrap WhatsApp HSM templates.

```python
# Create via Twilio API
from twilio.rest import Client
client = Client(sid, token)

template = client.content.v1.contents.create(
    friendly_name="payment_reminder",
    language="es",
    types={
        "twilio/text": {
            "body": "Hola {{1}}, tu pago de {{2}} vence el {{3}}."
        }
    },
    variables={"1": "name", "2": "amount", "3": "date"}
)

# Submit for WhatsApp approval
client.content.v1.content_and_approvals.create(
    friendly_name="payment_reminder",
    language="es",
    types={"twilio/text": {"body": "..."}},
    content_approval_request={"name": "payment_reminder", "category": "UTILITY"}
)
```

### Sending Messages

```python
# Plain text (in-session only)
message = client.messages.create(
    from_="whatsapp:+14155238886",
    to="whatsapp:+521234567890",
    body="Tu pago fue recibido. Gracias!"
)

# Template (works anytime)
message = client.messages.create(
    from_="whatsapp:+14155238886",
    to="whatsapp:+521234567890",
    content_sid="HXxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    content_variables='{"1":"Maria","2":"$500","3":"April 1, 2026"}'
)

# Media (in-session only)
message = client.messages.create(
    from_="whatsapp:+14155238886",
    to="whatsapp:+521234567890",
    body="Here's your receipt",
    media_url=["https://example.com/receipt.pdf"]
)
```

### Receiving Messages (Webhook)

Twilio sends a POST with form-encoded data:

```
MessageSid=SMxxxxx
AccountSid=ACxxxxx
From=whatsapp:+521234567890
To=whatsapp:+14155238886
Body=Hola, cuanto debo?
NumMedia=0
```

With media:
```
NumMedia=1
MediaUrl0=https://api.twilio.com/2010-04-01/Accounts/ACxxx/Messages/MMxxx/Media/MExxx
MediaContentType0=image/jpeg
```

### Webhook Signature Validation

```python
from twilio.request_validator import RequestValidator

validator = RequestValidator(auth_token)
is_valid = validator.validate(
    uri="https://your-api.com/webhooks/whatsapp",
    params=form_data_dict,
    signature=request.headers["X-Twilio-Signature"]
)
```

### Status Callbacks

Track delivery status by setting `status_callback`:

```python
message = client.messages.create(
    from_="whatsapp:+14155238886",
    to="whatsapp:+521234567890",
    body="Hello",
    status_callback="https://your-api.com/webhooks/whatsapp/status"
)
```

Status values: `queued` → `sent` → `delivered` → `read` (or `failed`, `undelivered`)

### Twilio WhatsApp Sandbox (Development)

1. Go to Twilio Console → Messaging → Try it Out → WhatsApp Sandbox
2. Note the sandbox number (usually +1 415 523 8886)
3. Users join by sending: `join <your-word>` to the sandbox number
4. Configure webhook URL in sandbox settings
5. No template approval needed in sandbox — all messages work

### Rate Limits

| Tier | Messages/sec | How to get |
|------|-------------|------------|
| Sandbox | 1 msg/sec | Default |
| Business (new) | 250 msg/24h | After Meta approval |
| Business (scaled) | 1K-100K/24h | Based on quality rating |

### Pricing (approximate)

| Direction | Cost |
|-----------|------|
| Utility template (business-initiated) | ~$0.005-0.01 |
| Marketing template | ~$0.02-0.05 |
| User-initiated session | ~$0.005 |
| Twilio per-message fee | +$0.005 |

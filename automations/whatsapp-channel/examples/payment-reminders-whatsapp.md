# Example: payment-reminders + WhatsApp

Complete integration of the `payment-reminders` automation with WhatsApp outbound.

## Config Changes

```json
{
  "REMINDER_WINDOWS": [-3, 0, 1, 3, 7],
  "NOTIFICATION_CHANNEL": "both",
  "WHATSAPP_TEMPLATE_SID": "HXxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  "DEDUP_HOURS": 24
}
```

## Template to Create in Twilio

```
Name: payment_reminder
Category: UTILITY
Language: es

Body:
"Hola {{1}} 👋

Tu pago de {{2}} vence el {{3}}.

Responde PAGAR para ver opciones de pago o AYUDA si tienes dudas."
```

## Modified payment-reminders Script

```python
"""payment-reminders with WhatsApp channel support."""

from datetime import datetime, timedelta
from api.services.whatsapp_service import WhatsAppService

async def run_payment_reminders(config: dict, db, whatsapp: WhatsAppService):
    """Check for payments in reminder windows and send notifications."""

    windows = config["REMINDER_WINDOWS"]  # [-3, 0, 1, 3, 7]
    channel = config.get("NOTIFICATION_CHANNEL", "email")
    template_sid = config.get("WHATSAPP_TEMPLATE_SID")
    today = datetime.now().date()

    for window in windows:
        target_date = today + timedelta(days=-window)  # negative = before due

        # Query payments due on target_date
        payments = db.table("payments") \
            .select("*, clients(name, phone, email)") \
            .eq("due_date", target_date.isoformat()) \
            .eq("status", "pending") \
            .execute()

        for payment in payments.data:
            client = payment["clients"]
            dedup_key = f"payment_reminder:{payment['id']}:{window}"

            # Check dedup
            existing = db.table("whatsapp_notification_log") \
                .select("id").eq("dedup_key", dedup_key).execute()
            if existing.data:
                continue

            variables = {
                "name": client["name"],
                "amount": f"${payment['amount']:,.2f}",
                "due_date": target_date.strftime("%d de %B, %Y"),
            }

            # Send via WhatsApp
            if channel in ("whatsapp", "both") and client.get("phone") and template_sid:
                try:
                    await whatsapp.send_template(
                        to=client["phone"],
                        template_sid=template_sid,
                        variables={
                            "1": variables["name"],
                            "2": variables["amount"],
                            "3": variables["due_date"]
                        },
                        automation_id="payment-reminders"
                    )
                except Exception as e:
                    print(f"WhatsApp send failed for {client['phone']}: {e}")

            # Send via email (existing flow)
            if channel in ("email", "both") and client.get("email"):
                await send_reminder_email(client["email"], variables)

            # Log dedup
            db.table("whatsapp_notification_log").insert({
                "automation_id": "payment-reminders",
                "recipient_phone": client.get("phone", ""),
                "template_id": template_sid,
                "dedup_key": dedup_key
            }).execute()
```

## Cron Setup

```python
# In background-scheduler automation config:
{
    "jobs": [
        {
            "id": "payment_reminders",
            "func": "run_payment_reminders",
            "trigger": "cron",
            "hour": 9,
            "minute": 0,
            "timezone": "America/Chicago"
        }
    ]
}
```

## Expected WhatsApp Message

```
Hola Maria 👋

Tu pago de $1,500.00 vence el 03 de April, 2026.

Responde PAGAR para ver opciones de pago o AYUDA si tienes dudas.
```

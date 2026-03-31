# Example: ai-data-assistant + WhatsApp (Bidirectional)

Full conversational AI agent accessible via WhatsApp.

## Flow

```
User: "Cuanto debo este mes?"
  → Webhook receives message
  → Router: no active automation → default to ai-data-assistant
  → Load conversation history (last 10 messages)
  → Claude API with business tools
  → Claude calls query_client_balance(phone="+521234567890")
  → Returns: "Tienes 2 pagos pendientes por un total de $3,000. Vencen el 1 y 15 de abril."
```

## Webhook Handler

```python
# Registered in AUTOMATION_HANDLERS

AUTOMATION_HANDLERS = {
    "ai-data-assistant": handle_data_query,
    "ai-voice-processor": handle_voice_note,
    "ai-photo-classifier": handle_photo,
}

async def handle_data_query(message: dict) -> str:
    """Conversational business data assistant via WhatsApp."""
    from anthropic import Anthropic

    anthropic = Anthropic()

    # Get conversation history
    history = await whatsapp_service.get_conversation_as_llm_messages(
        message["from"], limit=10
    )
    history.append({"role": "user", "content": message["body"]})

    # Define tools the assistant can use
    tools = [
        {
            "name": "query_client_balance",
            "description": "Get payment balance for a client by phone number",
            "input_schema": {
                "type": "object",
                "properties": {
                    "phone": {"type": "string", "description": "Client phone in E.164"}
                },
                "required": ["phone"]
            }
        },
        {
            "name": "query_upcoming_payments",
            "description": "List upcoming payments for a client",
            "input_schema": {
                "type": "object",
                "properties": {
                    "phone": {"type": "string"},
                    "days_ahead": {"type": "integer", "default": 30}
                },
                "required": ["phone"]
            }
        },
        {
            "name": "query_property_status",
            "description": "Get current status of a property by ID or address",
            "input_schema": {
                "type": "object",
                "properties": {
                    "query": {"type": "string", "description": "Property ID or partial address"}
                },
                "required": ["query"]
            }
        }
    ]

    system_prompt = f"""You are a helpful assistant for a mobile home company.
The user is contacting you via WhatsApp from phone {message['from']}.
{'Their name is ' + message.get('client_name', '') + '.' if message.get('client_name') else ''}

Rules:
- Keep responses SHORT (under 300 characters when possible) — this is WhatsApp
- Use the tools to get real data — never make up numbers
- Respond in the same language the user writes in
- If you can't help, suggest they call the office
- Be warm but professional"""

    # Call Claude
    response = anthropic.messages.create(
        model="claude-sonnet-4-6-20250514",
        max_tokens=500,
        system=system_prompt,
        messages=history,
        tools=tools
    )

    # Handle tool use (simplified — production needs a loop)
    if response.stop_reason == "tool_use":
        tool_call = next(b for b in response.content if b.type == "tool_use")
        tool_result = await execute_tool(tool_call.name, tool_call.input, message)

        # Send tool result back to Claude
        history.append({"role": "assistant", "content": response.content})
        history.append({"role": "user", "content": [
            {"type": "tool_result", "tool_use_id": tool_call.id, "content": str(tool_result)}
        ]})

        final = anthropic.messages.create(
            model="claude-sonnet-4-6-20250514",
            max_tokens=500,
            system=system_prompt,
            messages=history,
            tools=tools
        )
        return final.content[0].text

    return response.content[0].text


async def execute_tool(name: str, input: dict, message: dict):
    """Execute a business tool against PostgreSQL."""
    phone = input.get("phone", message["from"])

    if name == "query_client_balance":
        result = db.table("payments") \
            .select("amount, due_date, status") \
            .eq("client_phone", phone) \
            .in_("status", ["pending", "late"]) \
            .execute()
        total = sum(p["amount"] for p in result.data)
        return {"pending_payments": len(result.data), "total_owed": total,
                "details": result.data}

    elif name == "query_upcoming_payments":
        # ... similar query
        pass

    elif name == "query_property_status":
        # ... similar query
        pass
```

## Example Conversation

```
User: Hola buenas
Bot:  Hola! Soy el asistente de your company. ¿En qué te puedo ayudar?

User: Cuanto debo?
Bot:  Tienes 2 pagos pendientes:
      - $1,500 vence el 1 de abril
      - $1,500 vence el 15 de abril
      Total: $3,000

User: Ya pagué el primero
Bot:  Déjame verificar... Veo que el pago del 1 de abril aún aparece como
      pendiente. ¿Puedes enviarme el comprobante de pago?

User: [sends photo of receipt]
Bot:  (routes to ai-photo-classifier → extracts amount/date → confirms)
      Recibí tu comprobante por $1,500 del 28 de marzo. Lo paso al equipo
      para que actualicen tu cuenta. ¡Gracias!
```

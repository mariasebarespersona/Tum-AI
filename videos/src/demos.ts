import type { Message } from './types';

// ═══════════════════════════════════════════════════════════════
// DEMO 1: Housing Scraper — Agent sends matching listings
// ═══════════════════════════════════════════════════════════════

export const housingScraperMessages: Message[] = [
  {
    sender: 'agent',
    text: '🏠 *Housing Alert — 3 new matches*\nFilters: Madrid, 200K–500K€, ≥2 bed, ≥80m²',
    delayFrames: 30,
  },
  {
    sender: 'agent',
    text: '🏠 *Piso en Chamberí*\n💰 285,000€\n📍 C/ Fuencarral 42, Madrid\n📐 3 hab · 95m² · 2º planta\n🔗 idealista.com/inmueble/103...',
    delayFrames: 80,
    image: '🏢',
  },
  {
    sender: 'agent',
    text: '🏠 *Ático en Salamanca*\n💰 445,000€\n📍 C/ Velázquez 18, Madrid\n📐 2 hab · 82m² · Terraza 15m²\n🔗 idealista.com/inmueble/107...',
    delayFrames: 150,
    image: '🌇',
  },
  {
    sender: 'user',
    text: 'Me interesa el de Chamberí. Puedes conseguir más info?',
    delayFrames: 230,
  },
  {
    sender: 'agent',
    text: '📋 Buscando detalles del inmueble en Chamberí...\n\n✅ Año construcción: 2004\n✅ Certificado energético: B\n✅ Ascensor: Sí\n✅ Plaza garaje: No incluida\n✅ Comunidad: 85€/mes\n\n¿Quieres que agende una visita?',
    delayFrames: 290,
  },
  {
    sender: 'user',
    text: 'Sí, para esta semana si es posible',
    delayFrames: 370,
  },
  {
    sender: 'agent',
    text: '📅 Contactando al agente... Te confirmo horario en breve.',
    delayFrames: 420,
  },
];

// ═══════════════════════════════════════════════════════════════
// DEMO 2: Payment Reminder — Agent reminds tenant about rent
// ═══════════════════════════════════════════════════════════════

export const paymentReminderMessages: Message[] = [
  {
    sender: 'agent',
    text: '👋 Hola María,\n\nTu pago de *$1,200* por el apartamento en C/ Gran Vía 28 vence el *5 de abril*.\n\nResponde PAGAR para ver opciones o AYUDA si tienes dudas.',
    delayFrames: 30,
  },
  {
    sender: 'user',
    text: 'PAGAR',
    delayFrames: 110,
  },
  {
    sender: 'agent',
    text: '💳 Opciones de pago:\n\n1️⃣ *Transferencia bancaria*\nIBAN: ES12 1234 5678 9012 3456\nConcepto: RENT-ABR-2026-GV28\n\n2️⃣ *Bizum*\nAl número: +34 612 345 678\n\n3️⃣ *Stripe* (tarjeta)\nhttps://pay.tumai.dev/inv/a8f3...\n\nUna vez realizado, envíame el comprobante y lo registro.',
    delayFrames: 170,
  },
  {
    sender: 'user',
    text: 'Ya hice la transferencia',
    delayFrames: 260,
  },
  {
    sender: 'user',
    text: '📄 comprobante_abril.pdf',
    delayFrames: 290,
    image: '📄',
  },
  {
    sender: 'agent',
    text: '✅ *Pago recibido y registrado*\n\nMonto: $1,200.00\nConcepto: Renta Abril 2026\nEstado: Pagado\n\nTu próximo pago vence el 5 de mayo.\n¡Gracias María! 🙏',
    delayFrames: 350,
  },
];

// ═══════════════════════════════════════════════════════════════
// DEMO 3: AI Data Assistant — Tenant asks about their account
// ═══════════════════════════════════════════════════════════════

export const dataAssistantMessages: Message[] = [
  {
    sender: 'user',
    text: 'Hola, cuánto debo en total?',
    delayFrames: 30,
  },
  {
    sender: 'agent',
    text: '🔍 Consultando tu cuenta...',
    delayFrames: 90,
  },
  {
    sender: 'agent',
    text: '📊 *Resumen de tu cuenta:*\n\nContrato: Apt. Gran Vía 28, 2ºB\nInquilino: María García\n\n💰 *Balance pendiente: $2,450.00*\n\n• Renta Marzo: $1,200 ⏳ Vence 5 mar\n• Renta Abril: $1,200 📅 Vence 5 abr\n• Mora Febrero: $50 ⚠️ 10 días tarde\n\n¿Necesitas algo más?',
    delayFrames: 160,
  },
  {
    sender: 'user',
    text: 'Por qué tengo mora en febrero?',
    delayFrames: 250,
  },
  {
    sender: 'agent',
    text: '📋 *Detalle de mora — Febrero 2026:*\n\nFecha vencimiento: 5 feb\nFecha de pago: 15 feb\nDías de retraso: 10\n\nPolítica: $5/día después de 5 días de gracia\nCálculo: 5 días × $5 = *$25*\n\n⚠️ Nota: La mora se recalculó de $50 a $25 — hubo un ajuste el 20 feb.\n\nBalance actualizado: *$2,425.00*',
    delayFrames: 320,
  },
  {
    sender: 'user',
    text: 'Ok gracias. Puedo pagar solo lo de febrero por ahora?',
    delayFrames: 400,
  },
  {
    sender: 'agent',
    text: '✅ Claro. Aquí tienes el link para pagar *$1,225.00* (renta feb + mora):\n\nhttps://pay.tumai.dev/partial/feb26\n\nUna vez pagado, tu balance será $1,200 (renta marzo).',
    delayFrames: 460,
  },
];

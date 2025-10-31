import { type Locale } from '@/lib/locale';

export type AreaKey = 'habits' | 'confidence' | 'stability' | 'access' | 'resilience';
export type Bucket = 'getting_started' | 'building' | 'progress' | 'on_track' | 'empowered';
export type PersonaKey = 'rebuilder' | 'starter' | 'steadier' | 'planner' | 'navigator';

type Localized<T> = { en: T; es: T };

export const personaCopy: Record<PersonaKey, {
  icon: string;
  title: Localized<string>;
  subtitle: Localized<string>;
  about: Localized<string>;
  focus: Localized<string[]>;
  plan30: Localized<string[]>;
}> = {
  rebuilder: {
    icon: '🧭',
    title: { en: 'Rebuilder', es: 'Reconstruyendo' },
    subtitle: {
      en: 'Small, steady wins rebuild confidence.',
      es: 'Pequeños logros constantes reconstruyen la confianza.',
    },
    about: {
      en: 'You’re restarting with intention. We’ll lower stress and get quick, durable wins.',
      es: 'Estás reiniciando con intención. Bajemos el estrés y consigamos logros duraderos.',
    },
    focus: {
      en: ['Bills on rails', 'Tiny cash buffer', 'Simple spend plan'],
      es: ['Pagos automáticos', 'Pequeño colchón', 'Plan de gastos simple'],
    },
    plan30: {
      en: [
        'Auto-schedule minimums and due dates.',
        'Move $10–$25 per payday into a “buffer” jar.',
        'Use a needs-goals-wants list for the week.',
      ],
      es: [
        'Programa mínimos y fechas de pago.',
        'Pasa $10–$25 por quincena a un “colchón”.',
        'Usa una lista: necesidades–metas–gustos.',
      ],
    },
  },
  starter: {
    icon: '🌱',
    title: { en: 'Starter', es: 'Comienzos' },
    subtitle: { en: 'Clear steps beat perfect plans.', es: 'Pasos claros superan planes perfectos.' },
    about: {
      en: 'You’ve got momentum. We’ll add clarity and routines.',
      es: 'Ya tienes impulso. Sumemos claridad y rutinas.',
    },
    focus: {
      en: ['Spending rhythm', 'Bill calendar', 'Credit basics'],
      es: ['Ritmo de gastos', 'Calendario de pagos', 'Crédito básico'],
    },
    plan30: {
      en: [
        'Pick one “pay-down day” monthly.',
        'Track 3 categories only (groceries, fuel, fun).',
        'Check credit report once.',
      ],
      es: [
        'Elige un “día de pago de deuda” mensual.',
        'Controla solo 3 rubros (comida, gasolina, ocio).',
        'Revisa tu reporte de crédito una vez.',
      ],
    },
  },
  steadier: {
    icon: '🧩',
    title: { en: 'Steadier', es: 'Más estable' },
    subtitle: { en: 'Systems make progress feel easy.', es: 'Los sistemas facilitan el progreso.' },
    about: {
      en: 'You’re building stability. We’ll automate and simplify.',
      es: 'Estás construyendo estabilidad. Automatizamos y simplificamos.',
    },
    focus: {
      en: ['Emergency cushion', 'Debt game plan', 'Trust & access'],
      es: ['Fondo de emergencia', 'Plan de deuda', 'Confianza y acceso'],
    },
    plan30: {
      en: [
        'Grow buffer to $200–$400.',
        'Snowball one balance (smallest first).',
        'Set alerts for balances and deposits.',
      ],
      es: [
        'Sube el colchón a $200–$400.',
        'Ataque “bola de nieve” a un saldo.',
        'Activa alertas de saldos y depósitos.',
      ],
    },
  },
  planner: {
    icon: '🗺️',
    title: { en: 'Planner', es: 'Planificador(a)' },
    subtitle: { en: 'Purpose turns dollars into progress.', es: 'El propósito vuelve dinero en progreso.' },
    about: {
      en: 'You’re organized. We’ll optimize for goals.',
      es: 'Estás organizado(a). Optimizamos para tus metas.',
    },
    focus: {
      en: ['Goal buckets', 'Rate checkups', 'Resilience habits'],
      es: ['Sobres de metas', 'Revisión de tasas', 'Hábitos de resiliencia'],
    },
    plan30: {
      en: [
        'Open goal sub-savings (auto-move on payday).',
        'Refi check: autos/cards vs CU rates.',
        '2% “rainy day” rule for variable bills.',
      ],
      es: [
        'Crea sobres de ahorro (movimiento automático).',
        'Evalúa refinanciar: auto/tarjetas vs CU.',
        'Regla 2% “imprevistos” en gastos variables.',
      ],
    },
  },
  navigator: {
    icon: '🚀',
    title: { en: 'Navigator', es: 'Navegante' },
    subtitle: { en: 'Confident and ready to grow.', es: 'Con confianza y listo para crecer.' },
    about: {
      en: 'You’re on track. We’ll compound advantages.',
      es: 'Vas en buen camino. Compongamos ventajas.',
    },
    focus: {
      en: ['Bigger buffer', 'Wealth habits', 'Community impact'],
      es: ['Mayor colchón', 'Hábitos de patrimonio', 'Impacto comunitario'],
    },
    plan30: {
      en: ['Boost buffer to 1 month.', 'Automate investments.', 'Mentor someone locally.'],
      es: ['Sube el colchón a 1 mes.', 'Automatiza inversiones.', 'Sé mentor en tu comunidad.'],
    },
  },
};

/** Simple persona engine: pick the lowest area bucket, tie-break via priorities. */
export function pickPersona(b: Record<AreaKey, Bucket>): PersonaKey {
  const rank: Record<Bucket, number> = {
    getting_started: 1, building: 2, progress: 3, on_track: 4, empowered: 5,
  };
  const order: AreaKey[] = ['habits', 'stability', 'confidence', 'access', 'resilience'];
  let weakest: AreaKey = order[0];
  for (const k of order) {
    if (rank[b[k]] < rank[b[weakest]]) weakest = k;
  }
  // Map weakest area to persona
  if (weakest === 'habits') return 'rebuilder';
  if (weakest === 'stability') return 'starter';
  if (weakest === 'confidence') return 'steadier';
  if (weakest === 'access') return 'planner';
  return 'navigator';
}

export function pick<T>(loc: Locale, v: { en: T; es: T }) {
  return loc === 'es' ? v.es : v.en;
}

/**
 * Pricing configuration for all supported AI tools.
 * Used by the audit engine for calculations and comparisons.
 */

export const PRICING_CONFIG = {
  ChatGPT: {
    plans: {
      Free: { monthlyPrice: 0, seats: 1, perSeat: false },
      Plus: { monthlyPrice: 20, seats: 1, perSeat: false },
      Team: { monthlyPrice: 30, seats: 1, perSeat: true },
      Business: { monthlyPrice: null, seats: 1, perSeat: true, note: 'Custom pricing' }
    }
  },
  Claude: {
    plans: {
      Free: { monthlyPrice: 0, seats: 1, perSeat: false },
      Plus: { monthlyPrice: 20, seats: 1, perSeat: false },
      Pro: { monthlyPrice: 20, seats: 1, perSeat: false },
      Team: { monthlyPrice: 30, seats: 1, perSeat: true },
      Business: { monthlyPrice: null, seats: 1, perSeat: true, note: 'Custom pricing' }
    }
  },
  Cursor: {
    plans: {
      Free: { monthlyPrice: 0, seats: 1, perSeat: false },
      Pro: { monthlyPrice: 20, seats: 1, perSeat: false },
      Business: { monthlyPrice: null, seats: 1, perSeat: true, note: 'Custom pricing' }
    }
  },
  Copilot: {
    plans: {
      Free: { monthlyPrice: 0, seats: 1, perSeat: false },
      Individual: { monthlyPrice: 10, seats: 1, perSeat: false },
      Business: { monthlyPrice: 21, seats: 1, perSeat: true },
      Enterprise: { monthlyPrice: null, seats: 1, perSeat: true, note: 'Custom pricing' }
    }
  },
  Gemini: {
    plans: {
      Free: { monthlyPrice: 0, seats: 1, perSeat: false },
      Advanced: { monthlyPrice: 20, seats: 1, perSeat: false },
      Business: { monthlyPrice: null, seats: 1, perSeat: true, note: 'Custom pricing' }
    }
  },
  'OpenAI API': {
    plans: {
      Custom: { monthlyPrice: null, seats: 1, perSeat: false, note: 'Pay-as-you-go' }
    }
  },
  'Anthropic API': {
    plans: {
      Custom: { monthlyPrice: null, seats: 1, perSeat: false, note: 'Pay-as-you-go' }
    }
  },
  Windsurf: {
    plans: {
      Free: { monthlyPrice: 0, seats: 1, perSeat: false },
      Pro: { monthlyPrice: 15, seats: 1, perSeat: false },
      Team: { monthlyPrice: null, seats: 1, perSeat: true, note: 'Custom pricing' }
    }
  }
} as const;

export const ANNUAL_MULTIPLIER = 12;

export function getEquivalentPlan(tool: string, currentPlan: string): string[] {
  const equivalents: Record<string, Record<string, string[]>> = {
    ChatGPT: {
      Team: ['Plus', 'Pro'],
      Business: ['Team', 'Plus'],
      Enterprise: ['Business', 'Team']
    },
    Claude: {
      Team: ['Plus', 'Pro'],
      Business: ['Team', 'Plus']
    },
    Cursor: {
      Business: ['Pro'],
      Pro: ['Free']
    },
    Copilot: {
      Enterprise: ['Business'],
      Business: ['Individual']
    },
    Gemini: {
      Business: ['Advanced', 'Free'],
      Advanced: ['Free']
    },
    Windsurf: {
      Team: ['Pro'],
      Pro: ['Free']
    }
  };

  return equivalents[tool]?.[currentPlan] ?? [];
}

import { UseCase } from '../../types';

export interface SummaryInput {
  teamSize: number;
  primaryUseCase: UseCase;
  tools: string[];
  totalMonthlySpend: number;
  totalMonthlySavings: number;
  recommendations: Array<{ tool: string; suggestion: string }>;
}

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

function buildPrompt(input: SummaryInput) {
  return `Create an executive summary of approximately 100 words for a B2B finance leader.

Team size: ${input.teamSize}
Primary use case: ${input.primaryUseCase}
Tools audited: ${input.tools.join(', ')}
Current monthly spend: $${input.totalMonthlySpend}
Potential monthly savings: $${input.totalMonthlySavings}
Top recommendations: ${input.recommendations.map((r) => `${r.tool}: ${r.suggestion}`).join('; ')}

Use plain, business-friendly language. Focus on cost optimization, plan alignment, and productivity preservation. Do not include any private customer data.`;
}

async function fetchOpenAISummary(input: SummaryInput): Promise<string | null> {
  if (!OPENAI_API_KEY) {
    return null;
  }

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: 'gpt-4.1-mini',
      messages: [
        {
          role: 'user',
          content: buildPrompt(input)
        }
      ],
      max_tokens: 280,
      temperature: 0.7
    })
  });

  if (!response.ok) {
    const text = await response.text();
    console.warn('OpenAI summary request failed:', response.status, text);
    return null;
  }

  const data = await response.json();
  return data?.choices?.[0]?.message?.content?.trim() ?? null;
}

async function fetchAnthropicSummary(input: SummaryInput): Promise<string | null> {
  if (!ANTHROPIC_API_KEY) {
    return null;
  }

  const response = await fetch('https://api.anthropic.com/v1/complete', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': ANTHROPIC_API_KEY
    },
    body: JSON.stringify({
      model: 'claude-3.5-sonic',
      max_tokens: 300,
      temperature: 0.7,
      prompt: buildPrompt(input)
    })
  });

  if (!response.ok) {
    const text = await response.text();
    console.warn('Anthropic summary request failed:', response.status, text);
    return null;
  }

  const data = await response.json();
  return data?.completion?.trim() ?? null;
}

export async function generateSummary(input: SummaryInput): Promise<string> {
  const openAIResult = await fetchOpenAISummary(input);
  if (openAIResult) {
    return openAIResult;
  }

  const anthropicResult = await fetchAnthropicSummary(input);
  if (anthropicResult) {
    return anthropicResult;
  }

  return `This AI spend audit reviewed ${input.tools.length} tools across a ${input.teamSize}-person team focused on ${input.primaryUseCase.toLowerCase()}. The rule-based recommendations show potential yearly savings of approximately $${Math.round(input.totalMonthlySavings * 12)} while preserving current workflows and core tool capabilities.`;
}

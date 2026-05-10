/**
 * AI Summary generation service using OpenAI or Anthropic.
 * Generates personalized 100-word audit summaries.
 */

interface AISummaryInput {
  teamSize: number;
  useCase: string;
  toolsList: string[];
  totalMonthlySpend: number;
  totalMonthlySavings: number;
  recommendations: Array<{ tool: string; suggestion: string }>;
}

/**
 * Generate personalized summary using OpenAI GPT.
 */
export async function generateSummaryWithOpenAI(input: AISummaryInput, maxRetries: number = 3): Promise<string | null> {
  if (!process.env.OPENAI_API_KEY) {
    console.warn('OpenAI API key not configured');
    return null;
  }

  const systemPrompt = `You are a financial advisor for startup AI spending. Generate a concise, professional 100-word summary of an AI tool audit. Focus on key savings opportunities, which plans are overpriced for the team size, and actionable next steps. Tone: Professional but friendly and supportive.`;

  const userPrompt = `Generate a personalized audit summary based on:
- Team Size: ${input.teamSize}
- Primary Use Case: ${input.useCase}
- Current Tools: ${input.toolsList.join(', ')}
- Total Monthly Spend: $${input.totalMonthlySpend}
- Recommended Monthly Savings: $${input.totalMonthlySavings}
- Top Recommendations: ${input.recommendations.map((r) => r.suggestion).join('; ')}

Write exactly 100 words. Be specific about savings and next steps.`;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: 'gpt-4-turbo',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ],
          temperature: 0.7,
          max_tokens: 200
        })
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.statusText}`);
      }

      const data = (await response.json()) as any;
      const summary = data.choices?.[0]?.message?.content?.trim();

      if (summary) {
        return summary;
      }
    } catch (error) {
      console.error(`OpenAI request failed (attempt ${attempt + 1}/${maxRetries}):`, error);
      if (attempt < maxRetries - 1) {
        await new Promise((resolve) => setTimeout(resolve, 1000 * (attempt + 1)));
      }
    }
  }

  return null;
}

/**
 * Generate personalized summary using Anthropic Claude.
 */
export async function generateSummaryWithAnthropic(input: AISummaryInput, maxRetries: number = 3): Promise<string | null> {
  if (!process.env.ANTHROPIC_API_KEY) {
    console.warn('Anthropic API key not configured');
    return null;
  }

  const systemPrompt = `You are a financial advisor for startup AI spending. Generate a concise, professional 100-word summary of an AI tool audit. Focus on key savings opportunities, which plans are overpriced for the team size, and actionable next steps. Tone: Professional but friendly and supportive. Be specific about dollar amounts and percentages.`;

  const userPrompt = `Generate a personalized audit summary based on:
- Team Size: ${input.teamSize}
- Primary Use Case: ${input.useCase}
- Current Tools: ${input.toolsList.join(', ')}
- Total Monthly Spend: $${input.totalMonthlySpend}
- Recommended Monthly Savings: $${input.totalMonthlySavings}
- Top Recommendations: ${input.recommendations.map((r) => r.suggestion).join('; ')}

Write exactly 100 words. Be specific about savings and next steps.`;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: 'claude-3-sonnet-20240229',
          max_tokens: 200,
          messages: [
            { role: 'user', content: userPrompt }
          ],
          system: systemPrompt
        })
      });

      if (!response.ok) {
        throw new Error(`Anthropic API error: ${response.statusText}`);
      }

      const data = (await response.json()) as any;
      const summary = data.content?.[0]?.text?.trim();

      if (summary) {
        return summary;
      }
    } catch (error) {
      console.error(`Anthropic request failed (attempt ${attempt + 1}/${maxRetries}):`, error);
      if (attempt < maxRetries - 1) {
        await new Promise((resolve) => setTimeout(resolve, 1000 * (attempt + 1)));
      }
    }
  }

  return null;
}

/**
 * Generate summary using the best available service (OpenAI preferred, fallback to Anthropic).
 */
export async function generateAISummary(input: AISummaryInput): Promise<string> {
  let summary: string | null = null;

  // Try OpenAI first
  if (process.env.OPENAI_API_KEY) {
    summary = await generateSummaryWithOpenAI(input);
  }

  // Fallback to Anthropic if OpenAI fails
  if (!summary && process.env.ANTHROPIC_API_KEY) {
    summary = await generateSummaryWithAnthropic(input);
  }

  // Fallback template if both APIs fail or are unconfigured
  if (!summary) {
    const percentageSavings = input.totalMonthlySpend > 0 
      ? Math.round((input.totalMonthlySavings / input.totalMonthlySpend) * 100)
      : 0;
    
    summary = `Your audit identified significant savings opportunities across your AI stack. By optimizing your current plans and consolidating overlapping tools, you could reduce monthly spend by ${percentageSavings}%. The recommendations above provide specific, actionable steps to maintain productivity while improving financial efficiency. Your team size and ${input.useCase.toLowerCase()} use case align best with consolidated tooling focused on essentials.`;
  }

  return summary;
}

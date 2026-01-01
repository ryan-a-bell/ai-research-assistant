export interface ProviderConfig {
  name: string;
  baseUrl: string;
  popularModels: string[];
  requiresPrefix?: boolean;
}

export const PROVIDERS: Record<string, ProviderConfig> = {
  openai: {
    name: 'OpenAI',
    baseUrl: 'https://api.openai.com/v1',
    popularModels: [
      'gpt-4',
      'gpt-4-turbo',
      'gpt-4o',
      'gpt-4o-mini',
      'gpt-3.5-turbo',
    ],
  },
  openrouter: {
    name: 'OpenRouter',
    baseUrl: 'https://openrouter.ai/api/v1',
    popularModels: [
      'anthropic/claude-3.5-sonnet',
      'anthropic/claude-3-opus',
      'openai/gpt-4-turbo',
      'openai/gpt-4o',
      'google/gemini-pro-1.5',
      'meta-llama/llama-3.1-70b-instruct',
      'mistralai/mistral-large',
    ],
    requiresPrefix: true,
  },
  custom: {
    name: 'Custom',
    baseUrl: '',
    popularModels: [],
  },
};

export function getProviderBaseUrl(provider: string): string {
  return PROVIDERS[provider]?.baseUrl || '';
}

export function getProviderModels(provider: string): string[] {
  return PROVIDERS[provider]?.popularModels || [];
}

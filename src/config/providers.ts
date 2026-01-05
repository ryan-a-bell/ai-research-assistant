export interface ProviderConfig {
  name: string;
  baseUrl: string;
  popularModels: string[];
  requiresPrefix?: boolean;
  isLocal?: boolean;
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
  gemini: {
    name: 'Google Gemini',
    baseUrl: 'https://generativelanguage.googleapis.com/v1beta/openai',
    popularModels: [
      'gemini-1.5-pro',
      'gemini-1.5-flash',
      'gemini-pro',
      'gemini-pro-vision',
    ],
  },
  ollama: {
    name: 'Ollama (Local)',
    baseUrl: 'http://localhost:11434/v1',
    popularModels: [
      'llama3.1:70b',
      'llama3.1:8b',
      'mistral:7b',
      'mixtral:8x7b',
      'qwen2.5:72b',
      'codellama:13b',
      'phi3:medium',
      'deepseek-coder:6.7b',
    ],
    isLocal: true,
  },
  lmstudio: {
    name: 'LM Studio (Local)',
    baseUrl: 'http://localhost:1234/v1',
    popularModels: [
      'local-model',
      'llama-3.1-8b',
      'mistral-7b',
      'phi-3-mini',
    ],
    isLocal: true,
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

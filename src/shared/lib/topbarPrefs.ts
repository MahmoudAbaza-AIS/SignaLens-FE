const LLM_KEY = 'signalens.llmProvider'
const REFRESH_KEY = 'signalens.refreshSeconds'

export const LLM_OPTIONS = [
  { value: 'local-qwen', label: 'Local · Qwen' },
  { value: 'cohere', label: 'Cohere' },
  { value: 'huggingface', label: 'Hugging Face' },
  { value: 'deepseek', label: 'DeepSeek' },
] as const

export const REFRESH_OPTIONS = [
  { value: '10', label: '10s' },
  { value: '30', label: '30s' },
  { value: '60', label: '60s' },
  { value: 'off', label: 'Off' },
] as const

export function llmLabelForValue(value: string): string {
  return LLM_OPTIONS.find((option) => option.value === value)?.label ?? LLM_OPTIONS[0].label
}

export function llmValueForProviderName(name: string): string | null {
  const normalized = name.trim().toLowerCase()
  return (
    LLM_OPTIONS.find((option) => option.label.toLowerCase() === normalized)
      ?.value ?? null
  )
}

export function readLlmProvider(): string {
  return localStorage.getItem(LLM_KEY) ?? LLM_OPTIONS[0].value
}

export function writeLlmProvider(value: string) {
  localStorage.setItem(LLM_KEY, value)
  window.dispatchEvent(new CustomEvent('signalens:llm', { detail: value }))
}

export function readRefreshSeconds(): string {
  return localStorage.getItem(REFRESH_KEY) ?? '30'
}

export function writeRefreshSeconds(value: string) {
  localStorage.setItem(REFRESH_KEY, value)
  window.dispatchEvent(new CustomEvent('signalens:refresh', { detail: value }))
}

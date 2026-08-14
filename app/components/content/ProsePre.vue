<script setup lang="ts">
import { Check, Copy } from 'lucide-vue-next'

const props = defineProps<{ class?: string }>()

const preEl = ref<HTMLElement | null>(null)
const copied = ref(false)

const lang = computed(() => {
  const match = (props.class ?? '').match(/language-(\w+)/)
  const key = match?.[1] ?? ''
  const map: Record<string, string> = {
    html: 'HTML',
    css: 'CSS',
    js: 'JavaScript',
    javascript: 'JavaScript',
    ts: 'TypeScript',
    typescript: 'TypeScript',
    json: 'JSON',
    bash: 'Terminal',
    md: 'Markdown',
    markdown: 'Markdown',
  }
  return map[key] ?? key
})

async function copy() {
  if (!preEl.value) return
  try {
    await navigator.clipboard.writeText(preEl.value.innerText)
  } catch {
    const textarea = document.createElement('textarea')
    textarea.value = preEl.value.innerText
    textarea.style.position = 'fixed'
    textarea.style.opacity = '0'
    document.body.appendChild(textarea)
    textarea.select()
    document.execCommand('copy')
    document.body.removeChild(textarea)
  }
  copied.value = true
  window.setTimeout(() => {
    copied.value = false
  }, 1600)
}
</script>

<template>
  <div class="code-block">
    <div class="code-toolbar">
      <span class="code-lang">{{ lang || 'Code' }}</span>
      <button
        type="button"
        class="copy-btn"
        :aria-label="copied ? 'Code copied to clipboard' : 'Copy code to clipboard'"
        @click="copy"
      >
        <Check v-if="copied" class="size-3.5 text-success" aria-hidden="true" />
        <Copy v-else class="size-3.5" aria-hidden="true" />
        {{ copied ? 'Copied' : 'Copy' }}
      </button>
    </div>
    <pre ref="preEl" :class="props.class"><slot /></pre>
  </div>
</template>
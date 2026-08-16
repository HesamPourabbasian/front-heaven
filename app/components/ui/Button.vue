<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    variant?: 'default' | 'primary' | 'secondary' | 'outline' | 'ghost' | 'link' | 'danger'
    size?: 'default' | 'sm' | 'lg' | 'icon'
    disabled?: boolean
    class?: string
    type?: 'button' | 'submit' | 'reset'
    to?: string
  }>(),
  {
    variant: 'default',
    size: 'default',
    disabled: false,
    type: 'button',
  },
)

const variantClasses = computed(() => {
  switch (props.variant) {
    case 'primary':
    case 'default':
      return 'btn-primary'
    case 'secondary':
      return 'btn-secondary'
    case 'outline':
      return 'border border-border bg-transparent text-ink hover:bg-surface-2 hover:border-border-strong active:bg-surface-3'
    case 'ghost':
      return 'btn-ghost'
    case 'link':
      return 'text-primary underline-offset-4 hover:underline p-0 h-auto font-medium'
    case 'danger':
      return 'bg-danger text-white hover:bg-danger/90'
    default:
      return 'btn-primary'
  }
})

const sizeClasses = computed(() => {
  if (props.variant === 'link') return ''
  switch (props.size) {
    case 'sm':
      return 'h-8 px-3 text-xs rounded-lg'
    case 'lg':
      return 'h-12 px-6 text-base rounded-xl'
    case 'icon':
      return 'size-9 p-0 rounded-xl'
    case 'default':
    default:
      return 'h-10 px-4 py-2 text-sm rounded-xl'
  }
})
</script>

<template>
  <NuxtLink
    v-if="to"
    :to="to"
    :class="[
      'btn',
      variantClasses,
      sizeClasses,
      disabled ? 'pointer-events-none opacity-50' : '',
      $props.class,
    ]"
  >
    <slot />
  </NuxtLink>
  <button
    v-else
    :type="type"
    :disabled="disabled"
    :class="[
      'btn',
      variantClasses,
      sizeClasses,
      $props.class,
    ]"
  >
    <slot />
  </button>
</template>

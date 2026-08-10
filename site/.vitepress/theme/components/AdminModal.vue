<script setup>
defineProps({
  title: { type: String, default: '编辑' }
})

const emit = defineEmits(['close'])
</script>

<template>
  <div class="admin-modal-backdrop" @click.self="emit('close')">
    <div class="admin-modal" role="dialog" aria-modal="true">
      <header class="admin-modal-header">
        <h2>{{ title }}</h2>
        <button class="admin-modal-close" type="button" aria-label="关闭" @click="emit('close')">×</button>
      </header>
      <div class="admin-modal-body">
        <slot />
      </div>
    </div>
  </div>
</template>


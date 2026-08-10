<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'

const glowRef = ref(null)
let rafId = 0
let reduced = false
const pos = { x: -300, y: -300 }
const target = { x: -300, y: -300 }

function onMove(event) {
  target.x = event.clientX
  target.y = event.clientY
}

function tick() {
  pos.x += (target.x - pos.x) * 0.09
  pos.y += (target.y - pos.y) * 0.09
  if (glowRef.value) {
    glowRef.value.style.transform = `translate(${pos.x}px, ${pos.y}px) translate(-50%, -50%)`
  }
  rafId = requestAnimationFrame(tick)
}

onMounted(() => {
  reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  window.addEventListener('pointermove', onMove, { passive: true })
  if (!reduced) rafId = requestAnimationFrame(tick)
})

onBeforeUnmount(() => {
  cancelAnimationFrame(rafId)
  window.removeEventListener('pointermove', onMove)
})
</script>

<template>
  <div ref="glowRef" class="mouse-glow" aria-hidden="true" />
</template>


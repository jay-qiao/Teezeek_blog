<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'

const props = defineProps({
  count: { type: Number, default: 26 }
})

const canvasRef = ref(null)
let ctx = null
let rafId = 0
let particles = []
let width = 0
let height = 0
let reduced = false

function spawn() {
  particles = Array.from({ length: props.count }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    size: 0.8 + Math.random() * 1.8,
    speedY: 0.08 + Math.random() * 0.22,
    drift: (Math.random() - 0.5) * 0.18,
    phase: Math.random() * Math.PI * 2,
    crimson: Math.random() > 0.84
  }))
}

function drawFrame(time) {
  if (!ctx) return
  ctx.clearRect(0, 0, width, height)
  for (const p of particles) {
    p.y += p.speedY
    p.x += p.drift + Math.sin(time * 0.0004 + p.phase) * 0.08
    if (p.y > height + 4) {
      p.y = -4
      p.x = Math.random() * width
    }
    if (p.x < -4) p.x = width + 4
    if (p.x > width + 4) p.x = -4
    const alpha = Math.max(0.08, 0.16 + Math.sin(time * 0.001 + p.phase) * 0.1)
    const color = p.crimson ? '255, 140, 120' : '201, 168, 76'
    ctx.beginPath()
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
    ctx.fillStyle = `rgba(${color}, ${alpha})`
    ctx.fill()
  }
  rafId = requestAnimationFrame(drawFrame)
}

function resize() {
  width = window.innerWidth
  height = window.innerHeight
  if (canvasRef.value) {
    canvasRef.value.width = width * window.devicePixelRatio
    canvasRef.value.height = height * window.devicePixelRatio
    canvasRef.value.style.width = `${width}px`
    canvasRef.value.style.height = `${height}px`
    ctx.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0)
  }
  spawn()
}

onMounted(() => {
  reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  ctx = canvasRef.value.getContext('2d')
  resize()
  window.addEventListener('resize', resize)
  if (reduced) {
    drawFrame(0)
    cancelAnimationFrame(rafId)
  } else {
    rafId = requestAnimationFrame(drawFrame)
  }
})

onBeforeUnmount(() => {
  cancelAnimationFrame(rafId)
  window.removeEventListener('resize', resize)
})
</script>

<template>
  <canvas ref="canvasRef" class="ash-particles" aria-hidden="true" />
</template>


<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'

const props = defineProps({
  density: { type: Number, default: 1 }
})

const canvasRef = ref(null)
let ctx = null
let rafId = 0
let drops = []
let width = 0
let height = 0
let reduced = false

function spawnDrop(anywhere) {
  return {
    x: Math.random() * width,
    y: anywhere ? Math.random() * height : -30 - Math.random() * 120,
    speed: 3.2 + Math.random() * 3.2,
    length: 26 + Math.random() * 46,
    stroke: 0.8 + Math.random() * 1.1,
    slant: 0.16 + Math.random() * 0.1,
    green: Math.random() < 0.09,
    ember: Math.random() < 0.16,
    phase: Math.random() * Math.PI * 2
  }
}

function initDrops() {
  const count = Math.min(78, Math.floor((width * height) / 20000) * props.density)
  drops = Array.from({ length: Math.max(44, count) }, () => spawnDrop(true))
}

function draw(time) {
  if (!ctx) return
  ctx.clearRect(0, 0, width, height)
  for (const drop of drops) {
    drop.y += drop.speed
    drop.x += 0.45
    if (drop.y > height + 80) Object.assign(drop, spawnDrop(false))
    if (drop.x > width + 40) drop.x = -24
    const flicker = 0.72 + 0.28 * Math.sin(time * 0.002 + drop.phase)
    const alpha = Math.min(0.82, 0.28 + 0.22 * flicker)
    const color = drop.green ? '126, 196, 150' : '226, 197, 106'
    ctx.save()
    ctx.translate(drop.x, drop.y)
    ctx.rotate(drop.slant)
    ctx.lineCap = 'round'
    ctx.lineWidth = drop.stroke
    const gradient = ctx.createLinearGradient(0, 0, 0, -drop.length)
    gradient.addColorStop(0, `rgba(${color}, 0)`)
    gradient.addColorStop(1, `rgba(${color}, ${alpha})`)
    ctx.strokeStyle = gradient
    ctx.beginPath()
    ctx.moveTo(0, 0)
    ctx.lineTo(0, -drop.length)
    ctx.stroke()
    if (drop.ember) {
      ctx.beginPath()
      ctx.arc(0, -drop.length * 0.62, 1.1 + drop.stroke * 0.6, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(226, 197, 106, ${alpha * 0.5})`
      ctx.fill()
    }
    ctx.restore()
  }
  rafId = requestAnimationFrame(draw)
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
  initDrops()
}

onMounted(() => {
  reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  ctx = canvasRef.value.getContext('2d')
  resize()
  window.addEventListener('resize', resize)
  if (reduced) {
    draw(0)
    cancelAnimationFrame(rafId)
  } else {
    rafId = requestAnimationFrame(draw)
  }
})

onBeforeUnmount(() => {
  cancelAnimationFrame(rafId)
  window.removeEventListener('resize', resize)
})
</script>

<template>
  <canvas ref="canvasRef" class="rune-rain" aria-hidden="true" />
</template>

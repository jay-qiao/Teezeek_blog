<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import defaultSettings from '../../../data/settings.json'

const container = ref(null)
const config = defaultSettings.giscus || {}
const ready = ref(Boolean(config.repoId && config.categoryId))
const state = ref('loading')
let loaded = false
let timer = 0

const loadingText = computed(() => (state.value === 'loading' ? '正在开启评论区...' : ''))

onMounted(() => {
  if (!ready.value) return
  state.value = 'loading'
  const script = document.createElement('script')
  script.src = 'https://giscus.app/client.js'
  script.async = true
  script.setAttribute('data-repo', config.repo || 'jay-qiao/Teezeek_blog')
  script.setAttribute('data-repo-id', config.repoId)
  script.setAttribute('data-category', config.category || 'Announcements')
  script.setAttribute('data-category-id', config.categoryId)
  script.setAttribute('data-mapping', config.mapping || 'pathname')
  script.setAttribute('data-strict', '0')
  script.setAttribute('data-reactions-enabled', '1')
  script.setAttribute('data-emit-metadata', '0')
  script.setAttribute('data-input-position', 'bottom')
  script.setAttribute('data-theme', config.theme || 'dark')
  script.setAttribute('data-lang', config.lang || 'zh-CN')
  script.addEventListener('load', () => {
    window.setTimeout(() => {
      loaded = true
      if (container.value && container.value.querySelector('iframe')) {
        state.value = 'ready'
      }
    }, 800)
  })
  script.addEventListener('error', () => {
    state.value = 'error'
  })
  if (container.value) {
    container.value.innerHTML = ''
    container.value.appendChild(script)
  }
  timer = window.setTimeout(() => {
    if (!loaded && container.value) {
      state.value = 'error'
    }
  }, 12000)
})

onBeforeUnmount(() => {
  window.clearTimeout(timer)
})
</script>

<template>
  <section class="giscus-comments">
    <h2 class="giscus-title">评论</h2>
    <div v-if="ready" ref="container" class="giscus" :class="state" />
    <p v-if="ready && state === 'loading'" class="giscus-note">{{ loadingText }}</p>
    <div v-else-if="!ready" class="giscus-placeholder">
      评论区尚未配置。请在后台的 Giscus 评论中填写 repoId 与 categoryId。
    </div>
    <div v-if="state === 'error'" class="giscus-placeholder">
      评论区加载失败，请刷新页面重试；若仍失败，可稍后回来或到仓库 Discussions 中留言。
    </div>
  </section>
</template>

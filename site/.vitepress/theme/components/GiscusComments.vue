<script setup>
import { onMounted, ref } from 'vue'
import defaultSettings from '../../../data/settings.json'

const container = ref(null)
const config = defaultSettings.giscus || {}
const ready = ref(Boolean(config.repoId && config.categoryId))

onMounted(() => {
  if (!ready.value) return
  const script = document.createElement('script')
  script.src = 'https://giscus.app/client.js'
  script.async = true
  script.crossOrigin = 'anonymous'
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
  script.setAttribute('data-loading', 'lazy')
  if (container.value) {
    container.value.innerHTML = ''
    container.value.appendChild(script)
  }
})
</script>

<template>
  <section class="giscus-comments">
    <h2 class="giscus-title">评论</h2>
    <div v-if="ready" ref="container" class="giscus-frame" />
    <div v-else class="giscus-placeholder">
      评论区尚未配置。请在后台的 Giscus 评论中填写 repoId 与 categoryId。
    </div>
  </section>
</template>

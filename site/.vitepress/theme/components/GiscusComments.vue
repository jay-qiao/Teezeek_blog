<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import defaultSettings from '../../../data/settings.json'

const container = ref(null)
const config = defaultSettings.utterances || {}
const ready = ref(Boolean(config.repo))
const state = ref('loading')
let loaded = false
let timer = 0

onMounted(() => {
  if (!ready.value) return
  const script = document.createElement('script')
  script.src = 'https://utteranc.es/client.js'
  script.async = true
  script.setAttribute('data-repo', config.repo)
  script.setAttribute('data-issue-term', config.issueTerm || 'pathname')
  if (config.label) script.setAttribute('data-label', config.label)
  script.setAttribute('data-theme', config.theme || 'github-dark')
  script.setAttribute('data-lang', config.lang || 'zh-CN')
  script.setAttribute('crossorigin', 'anonymous')
  script.addEventListener('load', () => {
    loaded = true
    window.setTimeout(() => {
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
    <div v-if="ready" ref="container" class="utterances-comments" />
    <p v-if="ready && state === 'loading'" class="giscus-note">正在开启评论区...</p>
    <div v-else-if="!ready" class="giscus-placeholder">
      评论区尚未配置。请在后台的评论设置中填写 Utterances 参数。
    </div>
    <div v-if="state === 'error'" class="giscus-placeholder">
      评论区组件加载失败，可能是网络无法访问评论服务。你可以到仓库 <a :href="'https://github.com/' + (config.repo || 'jay-qiao/Teezeek_blog') + '/issues'" target="_blank" rel="noopener">Issues</a> 中留言。
    </div>
  </section>
</template>

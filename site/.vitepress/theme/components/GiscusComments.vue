<script setup>
import { onMounted, ref } from 'vue'
import defaultSettings from '../../../data/settings.json'

const container = ref(null)
const config = defaultSettings.gitalk || {}
const ready = ref(Boolean(config.clientID && config.clientSecret && config.repo && config.owner))
const state = ref('loading')

const cssHref = 'https://cdn.jsdelivr.net/npm/gitalk@1.8.0/dist/gitalk.css'
const jsSrc = 'https://cdn.jsdelivr.net/npm/gitalk@1.8.0/dist/gitalk.min.js'

function loadScript(src) {
  return new Promise((resolve, reject) => {
    if (window.Gitalk) {
      resolve()
      return
    }
    const script = document.createElement('script')
    script.src = src
    script.async = true
    script.addEventListener('load', resolve)
    script.addEventListener('error', () => reject(new Error('gitalk script load failed')))
    document.head.appendChild(script)
  })
}

onMounted(async () => {
  if (!ready.value) {
    state.value = 'error'
    return
  }
  if (!document.querySelector('link[href="' + cssHref + '"]')) {
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = cssHref
    document.head.appendChild(link)
  }
  try {
    await loadScript(jsSrc)
    const gitalk = new window.Gitalk({
      clientID: config.clientID,
      clientSecret: config.clientSecret,
      repo: config.repo,
      owner: config.owner,
      admin: config.admin && config.admin.length ? config.admin : [config.owner],
      id: location.pathname,
      title: document.title || location.pathname,
      body: '本文评论区：' + location.href,
      labels: config.labels && config.labels.length ? config.labels : ['Teezeek 评论'],
      perPage: 20,
      language: 'zh-CN',
      distractionFreeMode: Boolean(config.distractionFreeMode)
    })
    if (container.value) {
      container.value.innerHTML = ''
      gitalk.render(container.value)
      state.value = 'ready'
    }
  } catch (err) {
    state.value = 'error'
  }
})
</script>

<template>
  <section class="giscus-comments">
    <h2 class="giscus-title">评论</h2>
    <div v-if="ready" ref="container" class="gitalk-comments" />
    <p v-if="ready && state === 'loading'" class="giscus-note">正在开启评论区...</p>
    <div v-else-if="!ready" class="giscus-placeholder">
      评论区尚未配置。请在后台的评论设置中填写 Gitalk 参数。
    </div>
    <div v-if="state === 'error'" class="giscus-placeholder">
      评论区加载失败，请刷新页面重试；若仍失败，可到仓库 Issues 中留言。
    </div>
  </section>
</template>

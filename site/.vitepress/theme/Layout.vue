<script setup>
import { computed } from 'vue'
import { ArrowLeft } from 'lucide-vue-next'
import { useData, useRouter, withBase } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import AshParticles from './components/AshParticles.vue'
import GiscusComments from './components/GiscusComments.vue'
import MouseGlow from './components/MouseGlow.vue'
import RuneRain from './components/RuneRain.vue'

const { Layout } = DefaultTheme
const router = useRouter()
const { page } = useData()

const showBack = computed(() => {
  const rel = (page.value.relativePath || '').replace(/\\/g, '/')
  return !rel.startsWith('index') && !rel.startsWith('admin')
})

const isArticle = computed(() => {
  const rel = (page.value.relativePath || '').replace(/\\/g, '/')
  return rel.startsWith('posts/') && !rel.endsWith('/index.md')
})

function goBack() {
  if (window.history.length > 2) {
    window.history.back()
  } else {
    router.go(withBase('/'))
  }
}
</script>

<template>
  <div class="r-site-shell">
    <AccessGate />
    <AshParticles :count="26" />
    <RuneRain :density="0.85" />
    <MouseGlow />
    <Layout>
      <template #doc-after>
        <GiscusComments v-if="isArticle" />
      </template>
    </Layout>
    <button v-if="showBack" class="back-nav" type="button" aria-label="返回上一页" @click="goBack">
      <ArrowLeft :size="18" />
    </button>
  </div>
</template>

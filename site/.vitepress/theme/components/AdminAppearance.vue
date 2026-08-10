<script setup>
import { onMounted, ref } from 'vue'
import { Check } from 'lucide-vue-next'

const CONFIG_KEY = 'teezeek-letter-config'
const form = ref({
  letterTitle: '欢迎来到\nTeezeek 的卡塞尔图书馆',
  letterBody: '这封信将带你穿过迷雾，抵达属于代码、文字与龙火的站台。请握住火漆封印，展开大厅地图。',
  mapTitle: 'Teezeek 的卡塞尔图书馆',
  mapSubtitle: '记录代码与生活的暗黑奇幻站台'
})
const saved = ref(false)

onMounted(() => {
  const stored = localStorage.getItem(CONFIG_KEY)
  if (!stored) return
  try {
    const config = JSON.parse(stored)
    form.value = {
      letterTitle: config.letter?.title || form.value.letterTitle,
      letterBody: config.letter?.body || form.value.letterBody,
      mapTitle: config.map?.title || form.value.mapTitle,
      mapSubtitle: config.map?.subtitle || form.value.mapSubtitle
    }
  } catch {
    // ignore invalid stored config
  }
})

function save() {
  localStorage.setItem(
    CONFIG_KEY,
    JSON.stringify({
      letter: { title: form.value.letterTitle, body: form.value.letterBody },
      map: { title: form.value.mapTitle, subtitle: form.value.mapSubtitle }
    })
  )
  saved.value = true
  window.setTimeout(() => {
    saved.value = false
  }, 1800)
}
</script>

<template>
  <AdminShell active="appearance">
    <div class="admin-page-head">
      <div>
        <h1 class="admin-page-title">外观设置</h1>
        <p class="admin-page-lead">编辑首页信卷与地图内容，保存后首页会读取这里的配置。</p>
      </div>
      <span v-if="saved" class="admin-save-tip"><Check :size="14" /> 已保存到本地</span>
    </div>

    <form class="admin-form admin-appearance" @submit.prevent="save">
      <section class="admin-panel">
        <h2>羊皮纸信卷</h2>
        <label>信卷标题<input v-model="form.letterTitle" type="text" /></label>
        <label>信卷正文<textarea v-model="form.letterBody" rows="4" /></label>
      </section>

      <section class="admin-panel">
        <h2>大厅地图</h2>
        <label>地图主标题<input v-model="form.mapTitle" type="text" /></label>
        <label>地图副标题<input v-model="form.mapSubtitle" type="text" /></label>
      </section>

      <div class="admin-form-actions">
        <button class="btn btn-gold" type="submit">保存并生效</button>
      </div>
    </form>
  </AdminShell>
</template>

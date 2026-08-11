<script setup>
import { onMounted, ref } from 'vue'
import { Check } from 'lucide-vue-next'
import { isConnected, readTextFile, writeTextFile } from '../admin/github.js'

const CONFIG_KEY = 'teezeek-letter-config'
const form = ref({
  letterTitle: '欢迎来到\nTeezeek 的卡塞尔图书馆',
  letterBody: '这封信将带你穿过迷雾，抵达属于代码、文字与龙火的站台。请握住火漆封印，展开大厅地图。',
  mapTitle: 'Teezeek 的卡塞尔图书馆',
  mapSubtitle: '记录代码与生活的暗黑奇幻站台'
})
const saved = ref(false)
const connected = ref(false)
const busy = ref(false)
const error = ref('')

async function load() {
  if (!isConnected()) return
  connected.value = true
  try {
    const file = await readTextFile('site/data/appearance.json')
    const config = JSON.parse(file.content)
    form.value = {
      letterTitle: config.letter?.title || form.value.letterTitle,
      letterBody: config.letter?.body || form.value.letterBody,
      mapTitle: config.map?.title || form.value.mapTitle,
      mapSubtitle: config.map?.subtitle || form.value.mapSubtitle
    }
  } catch (err) {
    error.value = err.message
  }
}

async function save() {
  busy.value = true
  error.value = ''
  try {
    const appearance = {
      letter: { title: form.value.letterTitle, body: form.value.letterBody },
      map: { title: form.value.mapTitle, subtitle: form.value.mapSubtitle }
    }
    await writeTextFile(
      'site/data/appearance.json',
      JSON.stringify(appearance, null, 2) + '\n',
      'chore: update appearance'
    )
    localStorage.setItem(CONFIG_KEY, JSON.stringify(appearance))
    saved.value = true
    window.setTimeout(() => {
      saved.value = false
    }, 1800)
  } catch (err) {
    error.value = err.message
  } finally {
    busy.value = false
  }
}

onMounted(load)
</script>

<template>
  <AdminShell active="appearance">
    <div class="admin-page-head">
      <div>
        <h1 class="admin-page-title">外观设置</h1>
        <p class="admin-page-lead">编辑首页信卷与地图内容，保存后写入仓库并自动上线。</p>
      </div>
      <span v-if="saved" class="admin-save-tip"><Check :size="14" /> 已保存到仓库</span>
    </div>

    <p v-if="error" class="admin-login-error">{{ error }}</p>
    <div v-if="!connected" class="admin-login-empty">
      请先连接 GitHub Token，再修改外观设置。
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
        <button class="btn btn-gold" type="submit" :disabled="busy">{{ busy ? '保存中...' : '保存并生效' }}</button>
      </div>
    </form>
  </AdminShell>
</template>

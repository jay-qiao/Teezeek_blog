<script setup>
import { computed, onMounted, ref } from 'vue'
import { Check, ExternalLink, Save } from 'lucide-vue-next'
import { isConnected, readTextFile, writeTextFile } from '../admin/github.js'

const form = ref({
  repo: 'jay-qiao/Teezeek_blog',
  repoId: '',
  category: 'Announcements',
  categoryId: '',
  mapping: 'pathname',
  theme: 'dark',
  lang: 'zh-CN'
})
const connected = ref(false)
const busy = ref(false)
const error = ref('')
const saved = ref(false)

const configured = computed(() => Boolean(form.value.repoId && form.value.categoryId))

async function load() {
  if (!isConnected()) return
  connected.value = true
  try {
    const file = await readTextFile('site/data/settings.json')
    const settings = JSON.parse(file.content)
    form.value = { ...form.value, ...(settings.giscus || {}) }
  } catch (err) {
    error.value = err.message
  }
}

async function save() {
  busy.value = true
  error.value = ''
  try {
    const file = await readTextFile('site/data/settings.json')
    const settings = JSON.parse(file.content)
    settings.giscus = { ...form.value }
    await writeTextFile(
      'site/data/settings.json',
      JSON.stringify(settings, null, 2) + '\n',
      'chore: update giscus config'
    )
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
  <AdminShell active="comments">
    <div class="admin-page-head">
      <div>
        <h1 class="admin-page-title">Giscus 评论</h1>
        <p class="admin-page-lead">配置 GitHub Discussions 驱动的评论系统，无需自建服务器。</p>
      </div>
      <span v-if="saved" class="admin-save-tip"><Check :size="14" /> 已保存到仓库</span>
    </div>

    <p v-if="error" class="admin-login-error">{{ error }}</p>
    <div v-if="!connected" class="admin-login-empty">
      请先连接 GitHub Token，再配置 Giscus。
    </div>

    <section v-if="connected" class="admin-panel">
      <h2><Check :size="16" /> 配置状态</h2>
      <p class="admin-giscus-status" :class="configured ? 'is-ready' : 'is-empty'">
        {{ configured ? 'Giscus 已配置，文章页会显示评论区。' : '尚未配置完整，需要 repoId 和 categoryId。' }}
      </p>
      <a class="social-link" href="https://giscus.app/zh-CN" target="_blank" rel="noopener">
        <ExternalLink :size="15" /> 打开 Giscus 配置向导
      </a>
    </section>

    <form v-if="connected" class="admin-form admin-settings" @submit.prevent="save">
      <section class="admin-panel">
        <h2>仓库信息</h2>
        <label>仓库<code>{{ form.repo }}</code></label>
        <label>repoId<input v-model="form.repoId" type="text" placeholder="例如 R_kgDO..." /></label>
        <label>分类名称<input v-model="form.category" type="text" /></label>
        <label>categoryId<input v-model="form.categoryId" type="text" placeholder="例如 DIC_kwDO..." /></label>
      </section>

      <section class="admin-panel">
        <h2>展示设置</h2>
        <label>
          映射方式
          <select v-model="form.mapping">
            <option value="pathname">页面路径 pathname</option>
            <option value="url">完整 URL</option>
            <option value="title">页面标题</option>
            <option value="og:title">OG 标题</option>
          </select>
        </label>
        <label>
          主题
          <select v-model="form.theme">
            <option value="dark">dark</option>
            <option value="dark_dimmed">dark_dimmed</option>
            <option value="transparent_dark">transparent_dark</option>
            <option value="preferred_color_scheme">跟随系统</option>
          </select>
        </label>
        <label>
          语言
          <select v-model="form.lang">
            <option value="zh-CN">简体中文</option>
            <option value="en">English</option>
          </select>
        </label>
      </section>

      <div class="admin-form-actions">
        <button class="btn btn-gold" type="submit" :disabled="busy">
          <Save :size="15" /> {{ busy ? '保存中...' : '保存 Giscus 配置' }}
        </button>
      </div>
    </form>
  </AdminShell>
</template>

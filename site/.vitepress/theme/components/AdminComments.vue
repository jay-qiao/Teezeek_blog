<script setup>
import { computed, onMounted, ref } from 'vue'
import { Check, ExternalLink, Save } from 'lucide-vue-next'
import { isConnected, readTextFile, writeTextFile } from '../admin/github.js'

const form = ref({
  repo: 'jay-qiao/Teezeek_blog',
  issueTerm: 'pathname',
  label: 'Teezeek 评论',
  theme: 'github-dark',
  lang: 'zh-CN'
})
const connected = ref(false)
const busy = ref(false)
const error = ref('')
const saved = ref(false)

const configured = computed(() => Boolean(form.value.repo))

async function load() {
  if (!isConnected()) return
  connected.value = true
  try {
    const file = await readTextFile('site/data/settings.json')
    const settings = JSON.parse(file.content)
    form.value = { ...form.value, ...(settings.utterances || {}) }
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
    settings.utterances = {
      repo: form.value.repo.trim(),
      issueTerm: form.value.issueTerm,
      label: form.value.label.trim(),
      theme: form.value.theme,
      lang: form.value.lang
    }
    await writeTextFile(
      'site/data/settings.json',
      JSON.stringify(settings, null, 2) + '\n',
      'chore: update utterances config'
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
        <h1 class="admin-page-title">评论配置</h1>
        <p class="admin-page-lead">配置基于 GitHub Issues 的 Utterances 评论系统，无服务器、免费。</p>
      </div>
      <span v-if="saved" class="admin-save-tip"><Check :size="14" /> 已保存到仓库</span>
    </div>

    <p v-if="error" class="admin-login-error">{{ error }}</p>
    <div v-if="!connected" class="admin-login-empty">
      请先连接 GitHub Token，再配置评论。
    </div>

    <section v-if="connected" class="admin-panel">
      <h2><Check :size="16" /> 当前状态</h2>
      <p class="admin-giscus-status" :class="configured ? 'is-ready' : 'is-empty'">
        {{ configured ? 'Utterances 已配置，文章页会显示评论区。' : '尚未配置完整，需要仓库名称。' }}
      </p>
      <a class="social-link" href="https://github.com/apps/utterances" target="_blank" rel="noopener">
        <ExternalLink :size="15" /> 安装 Utterances GitHub App
      </a>
    </section>

    <form v-if="connected" class="admin-form admin-settings" @submit.prevent="save">
      <section class="admin-panel">
        <h2>Utterances 参数</h2>
        <label>仓库<input v-model="form.repo" type="text" placeholder="owner/repo" /></label>
        <label>
          评论归属
          <select v-model="form.issueTerm">
            <option value="pathname">页面路径 pathname</option>
            <option value="url">完整 URL</option>
            <option value="title">页面标题</option>
            <option value="og:title">OG 标题</option>
          </select>
        </label>
        <label>标签<input v-model="form.label" type="text" placeholder="Teezeek 评论" /></label>
        <label>
          主题
          <select v-model="form.theme">
            <option value="github-dark">github-dark</option>
            <option value="dark-blue">dark-blue</option>
            <option value="photon-dark">photon-dark</option>
            <option value="preferred-color-scheme">跟随系统</option>
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
          <Save :size="15" /> {{ busy ? '保存中...' : '保存评论配置' }}
        </button>
      </div>
    </form>
  </AdminShell>
</template>

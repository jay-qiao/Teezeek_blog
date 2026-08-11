<script setup>
import { computed, onMounted, ref } from 'vue'
import { Check, ExternalLink, Save } from 'lucide-vue-next'
import { isConnected, readTextFile, writeTextFile } from '../admin/github.js'

const form = ref({
  clientID: '',
  clientSecret: '',
  repo: 'Teezeek_blog',
  owner: 'jay-qiao',
  admin: 'jay-qiao',
  labels: 'Teezeek 评论'
})
const connected = ref(false)
const busy = ref(false)
const error = ref('')
const saved = ref(false)

const configured = computed(() => Boolean(form.value.clientID && form.value.clientSecret && form.value.repo && form.value.owner))

async function load() {
  if (!isConnected()) return
  connected.value = true
  try {
    const file = await readTextFile('site/data/settings.json')
    const settings = JSON.parse(file.content)
    const gitalk = settings.gitalk || {}
    form.value = {
      ...form.value,
      ...gitalk,
      admin: Array.isArray(gitalk.admin) ? gitalk.admin.join(', ') : gitalk.admin || form.value.admin,
      labels: Array.isArray(gitalk.labels) ? gitalk.labels.join(', ') : gitalk.labels || form.value.labels
    }
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
    settings.gitalk = {
      clientID: form.value.clientID.trim(),
      clientSecret: form.value.clientSecret.trim(),
      repo: form.value.repo.trim(),
      owner: form.value.owner.trim(),
      admin: form.value.admin.split(/[,，\s]+/).map((s) => s.trim()).filter(Boolean),
      labels: form.value.labels.split(/[,，\s]+/).map((s) => s.trim()).filter(Boolean),
      distractionFreeMode: false
    }
    await writeTextFile(
      'site/data/settings.json',
      JSON.stringify(settings, null, 2) + '\n',
      'chore: update gitalk config'
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
        <p class="admin-page-lead">配置基于 GitHub Issues 的 Gitalk 评论系统，无服务器、免费。</p>
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
        {{ configured ? 'Gitalk 已配置，文章页会显示评论区。' : '尚未配置完整，需要 clientID 与 clientSecret。' }}
      </p>
      <a class="social-link" href="https://github.com/settings/developers" target="_blank" rel="noopener">
        <ExternalLink :size="15" /> 打开 GitHub OAuth Apps
      </a>
    </section>

    <form v-if="connected" class="admin-form admin-settings" @submit.prevent="save">
      <section class="admin-panel">
        <h2>Gitalk 参数</h2>
        <label>clientID<input v-model="form.clientID" type="text" placeholder="GitHub OAuth App Client ID" /></label>
        <label>clientSecret<input v-model="form.clientSecret" type="password" placeholder="GitHub OAuth App Client Secret" /></label>
        <label>仓库名<input v-model="form.repo" type="text" /></label>
        <label>所有者<input v-model="form.owner" type="text" /></label>
        <label>管理员（逗号分隔）<input v-model="form.admin" type="text" /></label>
        <label>标签（逗号分隔）<input v-model="form.labels" type="text" /></label>
        <p class="admin-form-hint">clientSecret 会随静态站点公开可见，请使用权限有限的专用 OAuth App。</p>
      </section>

      <div class="admin-form-actions">
        <button class="btn btn-gold" type="submit" :disabled="busy">
          <Save :size="15" /> {{ busy ? '保存中...' : '保存评论配置' }}
        </button>
      </div>
    </form>
  </AdminShell>
</template>

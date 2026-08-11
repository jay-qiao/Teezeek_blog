<script setup>
import { ref } from 'vue'
import { Database, Download, Upload } from 'lucide-vue-next'
import {
  isConnected,
  listPosts,
  readTextFile,
  writeTextFile
} from '../admin/github.js'

const connected = ref(false)
const busy = ref(false)
const error = ref('')
const notice = ref('')

async function ensureConnected() {
  if (!isConnected()) {
    error.value = '请先连接 GitHub Token'
    return false
  }
  connected.value = true
  return true
}

async function exportBackup() {
  if (!(await ensureConnected())) return
  busy.value = true
  error.value = ''
  try {
    const files = await listPosts()
    const posts = []
    for (const file of files) {
      const text = await readTextFile(file.path)
      posts.push({ path: file.path, content: text.content })
    }
    const settings = await readTextFile('site/data/settings.json')
    const appearance = await readTextFile('site/data/appearance.json')
    const taxonomy = await readTextFile('site/data/taxonomy.json')
    const backup = {
      version: 1,
      exportedAt: new Date().toISOString(),
      posts,
      data: {
        settings: settings.content,
        appearance: appearance.content,
        taxonomy: taxonomy.content
      }
    }
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `teezeek-backup-${new Date().toISOString().slice(0, 10)}.json`
    link.click()
    URL.revokeObjectURL(url)
    notice.value = '备份已导出'
  } catch (err) {
    error.value = err.message
  } finally {
    busy.value = false
  }
}

async function restoreBackup(event) {
  const file = event.target.files?.[0]
  event.target.value = ''
  if (!file) return
  if (!(await ensureConnected())) return
  busy.value = true
  error.value = ''
  try {
    const backup = JSON.parse(await file.text())
    for (const post of backup.posts || []) {
      await writeTextFile(post.path, post.content, `chore: restore ${post.path}`)
    }
    for (const [name, content] of Object.entries(backup.data || {})) {
      await writeTextFile(`site/data/${name}.json`, content, `chore: restore ${name}.json`)
    }
    notice.value = '备份已恢复并提交到仓库'
  } catch (err) {
    error.value = err.message
  } finally {
    busy.value = false
  }
}
</script>

<template>
  <AdminShell active="backup">
    <div class="admin-page-head">
      <div>
        <h1 class="admin-page-title">数据备份</h1>
        <p class="admin-page-lead">导出全部文章与配置，或从备份文件恢复并提交到仓库。</p>
      </div>
      <button class="btn btn-gold" type="button" :disabled="busy" @click="exportBackup">
        <Download :size="15" /> 导出完整备份
      </button>
    </div>

    <p v-if="error" class="admin-login-error">{{ error }}</p>
    <p v-if="notice" class="admin-save-tip">{{ notice }}</p>
    <div v-if="!connected" class="admin-login-empty">
      请先连接 GitHub Token，再使用数据备份。
    </div>

    <section class="admin-panel admin-backup-note">
      <h2><Database :size="16" /> 恢复备份</h2>
      <p>选择之前导出的 JSON 备份文件，系统会把文章和配置写回仓库并触发自动部署。</p>
      <label class="btn btn-ghost">
        <Upload :size="15" /> 选择备份文件
        <input type="file" accept="application/json" style="display: none" @change="restoreBackup" />
      </label>
    </section>
  </AdminShell>
</template>

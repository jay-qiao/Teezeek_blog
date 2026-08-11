<script setup>
import { onMounted, ref } from 'vue'
import { Copy, Plus, Save, Trash2 } from 'lucide-vue-next'
import { isConnected, readTextFile, writeTextFile } from '../admin/github.js'

const connected = ref(false)
const busy = ref(false)
const error = ref('')
const notice = ref('')
const enabled = ref(false)
const codes = ref([])

function randomCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  const rand = () => chars[Math.floor(Math.random() * chars.length)]
  return `TZ-${rand()}${rand()}${rand()}${rand()}-${rand()}${rand()}${rand()}${rand()}`
}

async function load() {
  if (!isConnected()) return
  connected.value = true
  busy.value = true
  error.value = ''
  try {
    const file = await readTextFile('site/data/access.json')
    const data = JSON.parse(file.content)
    enabled.value = Boolean(data.enabled)
    codes.value = data.codes || []
  } catch (err) {
    error.value = err.message
  } finally {
    busy.value = false
  }
}

async function save() {
  busy.value = true
  error.value = ''
  try {
    await writeTextFile(
      'site/data/access.json',
      JSON.stringify({ enabled: enabled.value, codes: codes.value }, null, 2) + '\n',
      'chore: update access codes'
    )
    notice.value = '已保存，新访问码将在自动部署完成后生效（约 1-2 分钟）'
    window.setTimeout(() => {
      notice.value = ''
    }, 3500)
  } catch (err) {
    error.value = err.message
  } finally {
    busy.value = false
  }
}

function addCode() {
  codes.value.push(randomCode())
}

function removeCode(index) {
  codes.value.splice(index, 1)
}

async function copyCode(value) {
  try {
    await navigator.clipboard.writeText(value)
    notice.value = '已复制访问码'
    window.setTimeout(() => {
      notice.value = ''
    }, 1600)
  } catch {
    error.value = '复制失败，请手动选择复制'
  }
}

onMounted(load)
</script>

<template>
  <AdminShell active="access">
    <div class="admin-page-head">
      <div>
        <h1 class="admin-page-title">内测访问码</h1>
        <p class="admin-page-lead">开启后，访客必须输入有效访问码才能进入网站。</p>
      </div>
      <button class="btn btn-gold" type="button" :disabled="busy" @click="save">
        <Save :size="15" /> {{ busy ? '保存中...' : '保存' }}
      </button>
    </div>

    <p v-if="error" class="admin-login-error">{{ error }}</p>
    <p v-if="notice" class="admin-save-tip">{{ notice }}</p>
    <div v-if="!connected" class="admin-login-empty">
      请先连接 GitHub Token，再管理访问码。
    </div>

    <section v-if="connected" class="admin-panel">
      <h2>内测开关</h2>
      <label class="admin-check">
        <input v-model="enabled" type="checkbox" />
        开启内测访问限制
      </label>
      <p class="admin-page-lead">关闭后所有访客可直接进入，无需访问码。</p>
    </section>

    <section v-if="connected" class="admin-panel">
      <div class="admin-page-head">
        <h2>访问码（{{ codes.length }}）</h2>
        <button class="btn btn-ghost" type="button" @click="addCode">
          <Plus :size="14" /> 追加一个
        </button>
      </div>
      <div class="access-code-list">
        <div v-for="(item, index) in codes" :key="item" class="access-code-row">
          <code>{{ item }}</code>
          <button type="button" title="复制" @click="copyCode(item)"><Copy :size="14" /></button>
          <button type="button" class="is-danger" title="作废" @click="removeCode(index)"><Trash2 :size="14" /></button>
        </div>
      </div>
    </section>
  </AdminShell>
</template>

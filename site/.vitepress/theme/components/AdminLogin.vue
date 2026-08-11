<script setup>
import { onMounted, ref } from 'vue'
import { clearToken, connect, getToken, githubApi } from '../admin/github.js'
import AdminModal from './AdminModal.vue'

const emit = defineEmits(['connected', 'disconnected'])

const user = ref(null)
const show = ref(false)
const token = ref('')
const busy = ref(false)
const error = ref('')

async function loadUser() {
  if (!getToken()) return
  try {
    user.value = await githubApi('/user')
  } catch {
    clearToken()
  }
}

async function submit() {
  busy.value = true
  error.value = ''
  try {
    user.value = await connect(token.value)
    show.value = false
    token.value = ''
    emit('connected')
  } catch (err) {
    error.value = err.message
  } finally {
    busy.value = false
  }
}

function disconnect() {
  clearToken()
  user.value = null
  emit('disconnected')
}

onMounted(loadUser)
</script>

<template>
  <div class="admin-login-area">
    <button v-if="!user" class="admin-login-button" type="button" @click="show = true">
      连接 GitHub
    </button>
    <div v-else class="admin-login-state">
      <span class="admin-login-avatar">{{ user.login.slice(0, 1).toUpperCase() }}</span>
      <span>{{ user.login }}</span>
      <button class="btn-link" type="button" @click="disconnect">断开</button>
    </div>

    <AdminModal v-if="show" title="连接 GitHub" @close="show = false">
      <form class="admin-form" @submit.prevent="submit">
        <p class="admin-login-note">
          输入带 <code>repo</code> 权限的 GitHub Token。Token 只保存在当前浏览器，不会写入仓库。
        </p>
        <label>
          Personal Access Token
          <input v-model="token" type="password" required autocomplete="off" />
        </label>
        <p v-if="error" class="admin-login-error">{{ error }}</p>
        <div class="admin-form-actions">
          <button class="btn btn-gold" type="submit" :disabled="busy">
            {{ busy ? '连接中...' : '连接' }}
          </button>
          <button class="btn btn-ghost" type="button" @click="show = false">取消</button>
        </div>
      </form>
    </AdminModal>
  </div>
</template>

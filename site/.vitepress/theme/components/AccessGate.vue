<script setup>
import { computed, ref } from 'vue'
import { KeyRound, Lock, LogIn } from 'lucide-vue-next'
import accessConfig from '../../../data/access.json'

const STORAGE_KEY = 'teezeek-beta-code'
const code = ref('')
const error = ref('')

const enabled = accessConfig.enabled
const allowed = computed(() => {
  if (typeof window === 'undefined') return true
  const saved = window.localStorage.getItem(STORAGE_KEY)
  return Boolean(saved && accessConfig.codes.includes(saved))
})

function submit() {
  const value = code.value.trim().toUpperCase()
  if (accessConfig.codes.includes(value)) {
    window.localStorage.setItem(STORAGE_KEY, value)
    error.value = ''
    window.location.reload()
    return
  }
  error.value = '访问码不正确，请核对后重试。'
}
</script>

<template>
  <div v-if="enabled && !allowed" class="access-gate">
    <div class="access-gate-card">
      <span class="access-gate-seal"><Lock :size="22" /></span>
      <p class="access-gate-kicker">烬土图书馆 · 内测中</p>
      <h1>访客通道暂时封闭</h1>
      <p class="access-gate-lead">这座图书馆正在内测，只有持有馆长签发访问码的旅人才能进入。</p>
      <form class="access-gate-form" @submit.prevent="submit">
        <label>
          <KeyRound :size="15" />
          <input v-model="code" type="text" placeholder="请输入内测访问码" autocomplete="off" spellcheck="false" />
        </label>
        <button class="btn btn-gold" type="submit">
          <LogIn :size="15" /> 进入图书馆
        </button>
      </form>
      <p v-if="error" class="access-gate-error">{{ error }}</p>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { Check } from 'lucide-vue-next'
import { isConnected, readTextFile, writeTextFile } from '../admin/github.js'

const form = ref({
  siteName: 'Teezeek 的卡塞尔图书馆',
  siteDescription: '记录代码与生活的暗黑奇幻个人博客。',
  registration: true,
  allowComments: true,
  commentModeration: true,
  smtpHost: 'smtp.example.com',
  smtpPort: '465',
  smtpUser: 'noreply@example.com',
  smtpPassword: ''
})
const giscus = ref({
  repo: 'jay-qiao/Teezeek_blog',
  repoId: '',
  category: 'Announcements',
  categoryId: '',
  mapping: 'pathname',
  theme: 'dark',
  lang: 'zh-CN'
})
const saved = ref(false)
const connected = ref(false)
const busy = ref(false)
const error = ref('')

async function load() {
  if (!isConnected()) return
  connected.value = true
  try {
    const file = await readTextFile('site/data/settings.json')
    const settings = JSON.parse(file.content)
    form.value = {
      siteName: settings.siteName || form.value.siteName,
      siteDescription: settings.siteDescription || form.value.siteDescription,
      registration: settings.registration ?? form.value.registration,
      allowComments: settings.allowComments ?? form.value.allowComments,
      commentModeration: settings.commentModeration ?? form.value.commentModeration,
      smtpHost: settings.smtp?.host || form.value.smtpHost,
      smtpPort: settings.smtp?.port || form.value.smtpPort,
      smtpUser: settings.smtp?.user || form.value.smtpUser,
      smtpPassword: settings.smtp?.password || form.value.smtpPassword
    }
    giscus.value = { ...giscus.value, ...(settings.giscus || {}) }
  } catch (err) {
    error.value = err.message
  }
}

async function save() {
  busy.value = true
  error.value = ''
  try {
    await writeTextFile(
      'site/data/settings.json',
      JSON.stringify(
        {
          siteName: form.value.siteName,
          siteDescription: form.value.siteDescription,
          registration: form.value.registration,
          allowComments: form.value.allowComments,
          commentModeration: form.value.commentModeration,
          smtp: {
            host: form.value.smtpHost,
            port: form.value.smtpPort,
            user: form.value.smtpUser,
            password: form.value.smtpPassword
          },
          giscus: giscus.value
        },
        null,
        2
      ) + '\n',
      'chore: update site settings'
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
  <AdminShell active="settings">
    <div class="admin-page-head">
      <div>
        <h1 class="admin-page-title">系统设置</h1>
        <p class="admin-page-lead">站点信息、注册开关、评论设置与邮件 SMTP，保存后写入仓库。</p>
      </div>
      <span v-if="saved" class="admin-save-tip"><Check :size="14" /> 已保存到仓库</span>
    </div>

    <p v-if="error" class="admin-login-error">{{ error }}</p>
    <div v-if="!connected" class="admin-login-empty">
      请先连接 GitHub Token，再修改系统设置。
    </div>

    <form class="admin-form admin-settings" @submit.prevent="save">
      <section class="admin-panel">
        <h2>站点信息</h2>
        <label>站点名称<input v-model="form.siteName" type="text" /></label>
        <label>站点描述<input v-model="form.siteDescription" type="text" /></label>
      </section>

      <section class="admin-panel">
        <h2>注册与评论</h2>
        <label class="admin-check"><input v-model="form.registration" type="checkbox" /> 开放用户注册</label>
        <label class="admin-check"><input v-model="form.allowComments" type="checkbox" /> 允许评论</label>
        <label class="admin-check"><input v-model="form.commentModeration" type="checkbox" /> 评论先审后发</label>
      </section>

      <section class="admin-panel">
        <h2>邮件 SMTP</h2>
        <label>SMTP 主机<input v-model="form.smtpHost" type="text" /></label>
        <label>SMTP 端口<input v-model="form.smtpPort" type="text" /></label>
        <label>发件账号<input v-model="form.smtpUser" type="text" /></label>
        <label>密码<input v-model="form.smtpPassword" type="password" placeholder="演示环境不发送邮件" /></label>
      </section>

      <div class="admin-form-actions">
        <button class="btn btn-gold" type="submit" :disabled="busy">{{ busy ? '保存中...' : '保存设置' }}</button>
      </div>
    </form>
  </AdminShell>
</template>

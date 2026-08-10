<script setup>
import { ref } from 'vue'
import { Check } from 'lucide-vue-next'

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
const saved = ref(false)

function save() {
  saved.value = true
  window.setTimeout(() => {
    saved.value = false
  }, 1800)
}
</script>

<template>
  <AdminShell active="settings">
    <div class="admin-page-head">
      <div>
        <h1 class="admin-page-title">系统设置</h1>
        <p class="admin-page-lead">站点信息、注册开关、评论设置与邮件 SMTP。</p>
      </div>
      <span v-if="saved" class="admin-save-tip"><Check :size="14" /> 已保存（本地演示）</span>
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
        <button class="btn btn-gold" type="submit">保存设置</button>
      </div>
    </form>
  </AdminShell>
</template>


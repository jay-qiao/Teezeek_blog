<script setup>
import { ref } from 'vue'
import { ExternalLink } from 'lucide-vue-next'

const title = ref('')
const content = ref('')
const contact = ref('')

const REPO = 'jay-qiao/Teezeek_blog'

function buildUrl() {
  const body = [
    content.value.trim(),
    '',
    '---',
    '联系方式：' + (contact.value.trim() || '未填写')
  ].join('\n')
  const params = new URLSearchParams({
    title: title.value.trim() || '未命名投稿',
    body,
    labels: '投稿申请'
  })
  return `https://github.com/${REPO}/issues/new?${params.toString()}`
}
</script>

<template>
  <section class="submit-post">
    <div class="page-kicker">访客投稿</div>
    <h1 class="page-title">向烬土图书馆投稿</h1>
    <p class="page-lead">写下你的文章草稿，提交后会进入审核队列。只有经过馆长同意，才会正式发布并计入屠龙榜。</p>

    <div class="admin-panel">
      <h2>投稿须知</h2>
      <ul class="submit-rules">
        <li>投稿需要 GitHub 账号；提交后文章只是申请，不会立即出现在博客中。</li>
        <li>审核通过后我们会发布到文章站台，并为你累计屠龙榜贡献分。</li>
        <li>请勿提交侵权、广告或与主题无关的内容。</li>
      </ul>
    </div>

    <form class="admin-panel admin-form" @submit.prevent>
      <h2>稿件内容</h2>
      <label>
        文章标题
        <input v-model="title" type="text" placeholder="给文章起个名字" required />
      </label>
      <label>
        正文（Markdown）
        <textarea v-model="content" rows="14" placeholder="在这里写下正文，支持 Markdown 语法" required />
      </label>
      <label>
        联系方式
        <input v-model="contact" type="text" placeholder="邮箱或社交账号，便于审核通过后联系你" />
      </label>
      <div class="admin-form-actions">
        <a class="btn btn-gold" :href="buildUrl()" target="_blank" rel="noopener">
          <ExternalLink :size="15" /> 提交投稿
        </a>
      </div>
    </form>
  </section>
</template>

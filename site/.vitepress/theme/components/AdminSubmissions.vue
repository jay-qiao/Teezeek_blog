<script setup>
import { onMounted, ref } from 'vue'
import { Check, ExternalLink, X } from 'lucide-vue-next'
import {
  createIssueComment,
  isConnected,
  listIssuesByLabel,
  slugify,
  updateIssue,
  writeTextFile
} from '../admin/github.js'

const SUBMIT_LABEL = '投稿申请'
const submissions = ref([])
const connected = ref(false)
const busy = ref(false)
const error = ref('')
const notice = ref('')

async function load() {
  if (!isConnected()) return
  connected.value = true
  busy.value = true
  error.value = ''
  try {
    const issues = await listIssuesByLabel(SUBMIT_LABEL)
    submissions.value = issues.map((issue) => ({
      number: issue.number,
      title: issue.title,
      body: issue.body || '',
      user: issue.user?.login || 'unknown',
      state: issue.state,
      created: issue.created_at,
      htmlUrl: issue.html_url
    }))
  } catch (err) {
    error.value = err.message
  } finally {
    busy.value = false
  }
}

function extractContact(body) {
  const match = String(body).match(/---\s*联系方式：\s*(.+)\s*$/)
  return match ? match[1].trim() : ''
}

async function approve(item) {
  if (!window.confirm(`确认通过《${item.title}》并发布为文章？`)) return
  busy.value = true
  error.value = ''
  try {
    const contact = extractContact(item.body)
    const content = String(item.body)
      .replace(/\n?---\s*联系方式：\s*.+\s*$/, '')
      .trim()
    const file = `${slugify(item.title)}.md`
    const frontmatter = [
      '---',
      `title: ${JSON.stringify(item.title)}`,
      `description: 访客投稿《${item.title}》`,
      `date: ${new Date().toISOString().slice(0, 10)}`,
      'category: 随笔',
      'tags: ["访客投稿"]',
      `author: ${JSON.stringify(item.user)}`,
      '---',
      '',
      content,
      ''
    ].join('\n')
    await writeTextFile(`site/posts/${file}`, frontmatter, `feat: accept submission ${item.title}`)
    await createIssueComment(item.number, `已通过审核并发布为文章：[${item.title}](/posts/${file.replace(/\.md$/, '')}/)${contact ? `\n\n我们会通过 ${contact} 联系你。` : ''}`)
    await updateIssue(item.number, { state: 'closed' })
    notice.value = `已发布《${item.title}》`
    await load()
  } catch (err) {
    error.value = err.message
  } finally {
    busy.value = false
  }
}

async function reject(item) {
  if (!window.confirm(`确认拒绝《${item.title}》？`)) return
  busy.value = true
  error.value = ''
  try {
    await createIssueComment(item.number, '很抱歉，这篇投稿未通过审核。感谢你的心意，欢迎继续书写。')
    await updateIssue(item.number, { state: 'closed' })
    notice.value = `已拒绝《${item.title}》`
    await load()
  } catch (err) {
    error.value = err.message
  } finally {
    busy.value = false
  }
}

onMounted(load)
</script>

<template>
  <AdminShell active="submissions">
    <div class="admin-page-head">
      <div>
        <h1 class="admin-page-title">投稿审核</h1>
        <p class="admin-page-lead">访客投稿以 GitHub Issue 形式进入审核队列，通过后才发布为文章。</p>
      </div>
    </div>

    <p v-if="error" class="admin-login-error">{{ error }}</p>
    <p v-if="notice" class="admin-save-tip">{{ notice }}</p>
    <div v-if="!connected" class="admin-login-empty">
      请先连接 GitHub Token，再审核投稿。
    </div>

    <div v-if="connected" class="admin-table-wrap">
      <table class="admin-table">
        <thead>
          <tr>
            <th>状态</th>
            <th>标题</th>
            <th>作者</th>
            <th>提交时间</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="!submissions.length">
            <td colspan="5" class="admin-empty-cell">暂无投稿。</td>
          </tr>
          <tr v-for="item in submissions" :key="item.number">
            <td>
              <span class="admin-status" :class="item.state === 'open' ? 'status-ok' : 'status-draft'">
                {{ item.state === 'open' ? '待审核' : '已处理' }}
              </span>
            </td>
            <td>
              <strong>{{ item.title }}</strong>
              <a class="admin-sub-link" :href="item.htmlUrl" target="_blank" rel="noopener">
                Issue #{{ item.number }} <ExternalLink :size="12" />
              </a>
            </td>
            <td>{{ item.user }}</td>
            <td>{{ new Date(item.created).toLocaleString('zh-CN') }}</td>
            <td class="admin-actions">
              <template v-if="item.state === 'open'">
                <button type="button" class="is-ok" :disabled="busy" title="通过并发布" @click="approve(item)">
                  <Check :size="15" /> 通过
                </button>
                <button type="button" class="is-danger" :disabled="busy" title="拒绝" @click="reject(item)">
                  <X :size="15" /> 拒绝
                </button>
              </template>
              <span v-else class="admin-sub-text">已处理</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </AdminShell>
</template>

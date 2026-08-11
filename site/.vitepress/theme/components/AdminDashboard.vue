<script setup>
import { onMounted, ref } from 'vue'
import { withBase } from 'vitepress'
import { FileText, Tags, Users } from 'lucide-vue-next'
import { isConnected, listPosts, readTextFile, repoApi } from '../admin/github.js'

const stats = ref([])
const activities = ref([])
const connected = ref(false)
const error = ref('')

async function load() {
  if (!isConnected()) return
  connected.value = true
  error.value = ''
  try {
    const posts = await listPosts()
    const taxonomyFile = await readTextFile('site/data/taxonomy.json')
    const taxonomy = JSON.parse(taxonomyFile.content)
    const collaborators = await repoApi('/collaborators?per_page=100')
    const commits = await repoApi('/commits?per_page=5')
    stats.value = [
      { label: '文章总数', value: String(posts.length), icon: FileText, tone: 'gold' },
      { label: '分类总数', value: String(taxonomy.categories.length), icon: Tags, tone: 'purple' },
      { label: '标签总数', value: String(taxonomy.tags.length), icon: Tags, tone: 'green' },
      { label: '协作者', value: String(collaborators.length), icon: Users, tone: 'red' }
    ]
    activities.value = commits.map((commit) => ({
      time: new Date(commit.commit.author.date).toLocaleString('zh-CN', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      text: commit.commit.message.split('\n')[0]
    }))
  } catch (err) {
    error.value = err.message
  }
}

const quickLinks = [
  { label: '文章管理', link: '/admin/posts' },
  { label: 'Giscus 评论', link: '/admin/comments' },
  { label: '外观设置', link: '/admin/appearance' },
  { label: '数据备份', link: '/admin/backup' }
]

onMounted(load)
</script>

<template>
  <AdminShell active="dashboard">
    <h1 class="admin-page-title">仪表盘</h1>
    <p class="admin-page-lead">连接 GitHub 后显示仓库真实数据。</p>

    <p v-if="error" class="admin-login-error">{{ error }}</p>
    <div v-if="!connected" class="admin-login-empty">
      请先在右上角连接 GitHub Token，再查看站点仪表盘。
    </div>

    <div v-if="stats.length" class="admin-stats">
      <article v-for="stat in stats" :key="stat.label" class="admin-stat-card" :class="`tone-${stat.tone}`">
        <span class="admin-stat-icon"><component :is="stat.icon" :size="20" /></span>
        <div>
          <strong>{{ stat.value }}</strong>
          <span>{{ stat.label }}</span>
        </div>
      </article>
    </div>

    <div v-if="stats.length" class="admin-panels">
      <section class="admin-panel">
        <h2>最近动态</h2>
        <ul class="activity-list">
          <li v-for="item in activities" :key="`${item.time}-${item.text}`">
            <time>{{ item.time }}</time>
            <span>{{ item.text }}</span>
          </li>
        </ul>
      </section>

      <section class="admin-panel">
        <h2>快捷入口</h2>
        <div class="quick-links">
          <a v-for="link in quickLinks" :key="link.link" :href="withBase(link.link)">
            {{ link.label }}
          </a>
        </div>
      </section>
    </div>
  </AdminShell>
</template>

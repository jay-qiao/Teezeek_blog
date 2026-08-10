<script setup>
import { withBase } from 'vitepress'
import { FileText, MessageSquare, ShieldCheck, Users } from 'lucide-vue-next'

const stats = [
  { label: '文章总数', value: '12', icon: FileText, tone: 'gold' },
  { label: '评论总数', value: '86', icon: MessageSquare, tone: 'green' },
  { label: '注册用户', value: '328', icon: Users, tone: 'purple' },
  { label: '待审核评论', value: '7', icon: ShieldCheck, tone: 'red' }
]

const activities = [
  { time: '10:42', text: '《龙文与前端字体的炼金日志》被置顶' },
  { time: '09:18', text: '新用户“北境旅人”完成注册' },
  { time: '昨天', text: '评论“欢迎开馆！”等待审核' },
  { time: '昨天', text: '站点备份自动完成' }
]

const quickLinks = [
  { label: '文章管理', link: '/admin/posts' },
  { label: '评论审核', link: '/admin/comments' },
  { label: '外观设置', link: '/admin/appearance' },
  { label: '数据备份', link: '/admin/backup' }
]
</script>

<template>
  <AdminShell active="dashboard">
    <h1 class="admin-page-title">仪表盘</h1>
    <p class="admin-page-lead">站点运行概览与最近动态。</p>

    <div class="admin-stats">
      <article v-for="stat in stats" :key="stat.label" class="admin-stat-card" :class="`tone-${stat.tone}`">
        <span class="admin-stat-icon"><component :is="stat.icon" :size="20" /></span>
        <div>
          <strong>{{ stat.value }}</strong>
          <span>{{ stat.label }}</span>
        </div>
      </article>
    </div>

    <div class="admin-panels">
      <section class="admin-panel">
        <h2>最近动态</h2>
        <ul class="activity-list">
          <li v-for="item in activities" :key="item.text">
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


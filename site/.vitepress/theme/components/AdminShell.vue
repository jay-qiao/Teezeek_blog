<script setup>
import { ref } from 'vue'
import { withBase } from 'vitepress'
import {
  ArrowLeft,
  BarChart3,
  BookOpen,
  Database,
  Menu,
  MessageSquare,
  Palette,
  Settings,
  Tags,
  Users,
  X
} from 'lucide-vue-next'
import AdminLogin from './AdminLogin.vue'

defineProps({
  active: { type: String, required: true }
})

const open = ref(false)

const links = [
  { key: 'dashboard', label: '仪表盘', link: '/admin', icon: BarChart3 },
  { key: 'posts', label: '文章管理', link: '/admin/posts', icon: BookOpen },
  { key: 'taxonomy', label: '分类标签', link: '/admin/taxonomy', icon: Tags },
  { key: 'comments', label: '评论配置', link: '/admin/comments', icon: MessageSquare },
  { key: 'users', label: '协作者管理', link: '/admin/users', icon: Users },
  { key: 'settings', label: '系统设置', link: '/admin/settings', icon: Settings },
  { key: 'appearance', label: '外观设置', link: '/admin/appearance', icon: Palette },
  { key: 'backup', label: '数据备份', link: '/admin/backup', icon: Database }
]
</script>

<template>
  <div class="admin-shell">
    <aside class="admin-sidebar" :class="{ 'is-open': open }">
      <div class="admin-brand">
        <span class="admin-brand-seal">T</span>
        <div>
          <strong>烬土后台</strong>
          <small>GitHub 工作台</small>
        </div>
        <button class="admin-sidebar-close" type="button" aria-label="关闭菜单" @click="open = false">
          <X :size="16" />
        </button>
      </div>

      <nav class="admin-nav" aria-label="后台导航">
        <a
          v-for="item in links"
          :key="item.key"
          class="admin-nav-item"
          :class="{ 'is-active': active === item.key }"
          :href="withBase(item.link)"
          @click="open = false"
        >
          <component :is="item.icon" :size="16" />
          {{ item.label }}
        </a>
      </nav>

      <a class="admin-back" :href="withBase('/')">
        <ArrowLeft :size="15" />
        返回博客
      </a>
    </aside>

    <div class="admin-main" @click="open = false">
      <header class="admin-topbar">
        <button class="admin-menu-button" type="button" aria-label="打开菜单" @click.stop="open = true">
          <Menu :size="18" />
        </button>
        <div class="admin-topbar-title">管理员工作台 · GitHub 工作台</div>
        <AdminLogin />
      </header>
      <div class="admin-content">
        <slot />
      </div>
    </div>
  </div>
</template>

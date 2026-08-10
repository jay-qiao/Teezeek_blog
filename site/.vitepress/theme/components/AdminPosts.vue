<script setup>
import { ref } from 'vue'
import { Pencil, Pin, Plus, Star, Trash2 } from 'lucide-vue-next'

const posts = ref([
  { id: 1, title: '欢迎来到卡塞尔图书馆', category: '指南', tags: ['博客', '指南'], status: '已发布', pinned: true, featured: true },
  { id: 2, title: '用 VitePress 与 GitHub Pages 部署魔法站台', category: '技术', tags: ['VitePress', 'GitHub Pages'], status: '已发布', pinned: false, featured: true },
  { id: 3, title: '龙文与前端字体的炼金日志', category: '前端', tags: ['字体', '前端'], status: '草稿', pinned: false, featured: false },
  { id: 4, title: '《龙族》重读手记', category: '随笔', tags: ['读书', '随笔'], status: '已发布', pinned: false, featured: false }
])

const showModal = ref(false)
const editing = ref({ id: null, title: '', category: '', tags: '', status: '草稿' })

function openEdit(post = {}) {
  editing.value = {
    id: post.id || null,
    title: post.title || '',
    category: post.category || '技术',
    tags: (post.tags || []).join(', '),
    status: post.status || '草稿'
  }
  showModal.value = true
}

function savePost() {
  const tags = editing.value.tags
    .split(/[,，\s]+/)
    .filter(Boolean)
  if (editing.value.id) {
    const target = posts.value.find((post) => post.id === editing.value.id)
    Object.assign(target, {
      title: editing.value.title,
      category: editing.value.category,
      tags,
      status: editing.value.status
    })
  } else {
    posts.value.unshift({
      id: Date.now(),
      title: editing.value.title,
      category: editing.value.category,
      tags,
      status: editing.value.status,
      pinned: false,
      featured: false
    })
  }
  showModal.value = false
}

function removePost(id) {
  posts.value = posts.value.filter((post) => post.id !== id)
}

function toggleFlag(key, id) {
  const post = posts.value.find((item) => item.id === id)
  if (post) post[key] = !post[key]
}
</script>

<template>
  <AdminShell active="posts">
    <div class="admin-page-head">
      <div>
        <h1 class="admin-page-title">文章管理</h1>
        <p class="admin-page-lead">增删改查、置顶与加精均为本地演示。</p>
      </div>
      <button class="btn btn-gold" type="button" @click="openEdit()">
        <Plus :size="15" /> 新增文章
      </button>
    </div>

    <div class="admin-table-wrap">
      <table class="admin-table">
        <thead>
          <tr>
            <th>标题</th>
            <th>分类</th>
            <th>标签</th>
            <th>状态</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="post in posts" :key="post.id">
            <td class="admin-title-cell">
              <strong>{{ post.title }}</strong>
              <span class="admin-flag" :class="{ 'is-on': post.pinned }">
                <Pin :size="13" /> 置顶
              </span>
              <span class="admin-flag" :class="{ 'is-on': post.featured }">
                <Star :size="13" /> 加精
              </span>
            </td>
            <td>{{ post.category }}</td>
            <td class="admin-tag-cell">
              <span v-for="tag in post.tags" :key="tag" class="post-tag">{{ tag }}</span>
            </td>
            <td><span class="admin-status" :class="`status-${post.status === '已发布' ? 'ok' : 'draft'}`">{{ post.status }}</span></td>
            <td class="admin-actions">
              <button type="button" title="置顶" @click="toggleFlag('pinned', post.id)"><Pin :size="15" /></button>
              <button type="button" title="加精" @click="toggleFlag('featured', post.id)"><Star :size="15" /></button>
              <button type="button" title="编辑" @click="openEdit(post)"><Pencil :size="15" /></button>
              <button type="button" title="删除" @click="removePost(post.id)"><Trash2 :size="15" /></button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <AdminModal v-if="showModal" title="编辑文章" @close="showModal = false">
      <form class="admin-form" @submit.prevent="savePost">
        <label>
          标题
          <input v-model="editing.title" type="text" required />
        </label>
        <label>
          分类
          <select v-model="editing.category">
            <option>技术</option>
            <option>前端</option>
            <option>指南</option>
            <option>随笔</option>
          </select>
        </label>
        <label>
          标签（逗号分隔）
          <input v-model="editing.tags" type="text" />
        </label>
        <label>
          状态
          <select v-model="editing.status">
            <option>草稿</option>
            <option>已发布</option>
          </select>
        </label>
        <div class="admin-form-actions">
          <button class="btn btn-gold" type="submit">保存</button>
          <button class="btn btn-ghost" type="button" @click="showModal = false">取消</button>
        </div>
      </form>
    </AdminModal>
  </AdminShell>
</template>


<script setup>
import { onMounted, ref } from 'vue'
import { Pencil, Pin, Plus, Star, Trash2 } from 'lucide-vue-next'
import {
  deleteFile,
  isConnected,
  listPosts,
  readTextFile,
  slugify,
  splitFrontmatter,
  writeTextFile
} from '../admin/github.js'

const posts = ref([])
const showModal = ref(false)
const busy = ref(false)
const connected = ref(false)
const error = ref('')
const editing = ref({
  path: '',
  file: '',
  title: '',
  description: '',
  date: '',
  category: '技术',
  tags: '',
  status: '已发布',
  pinned: false,
  featured: false,
  content: ''
})

function parseFrontmatter(raw) {
  const { frontmatter } = splitFrontmatter(raw)
  const data = {}
  const lines = frontmatter.split(/\r?\n/)
  let key = ''
  for (const line of lines) {
    const match = line.match(/^([\w-]+):\s*(.*)$/)
    if (match) {
      key = match[1]
      data[key] = parseScalar(match[2])
    } else if (key === 'tags' && line.trim().startsWith('- ')) {
      data.tags ||= []
      data.tags.push(line.trim().slice(2).replace(/^["']|["']$/g, ''))
    }
  }
  return data
}

function parseScalar(value) {
  const text = String(value || '').trim()
  if (text === 'true') return true
  if (text === 'false') return false
  if (
    (text.startsWith('"') && text.endsWith('"')) ||
    (text.startsWith("'") && text.endsWith("'"))
  ) {
    return text.slice(1, -1)
  }
  if (text.startsWith('[') && text.endsWith(']')) {
    return text
      .slice(1, -1)
      .split(',')
      .map((item) => item.trim().replace(/^["']|["']$/g, ''))
      .filter(Boolean)
  }
  return text
}

function buildFrontmatter(post) {
  return [
    '---',
    `title: ${JSON.stringify(post.title)}`,
    `description: ${JSON.stringify(post.description || '')}`,
    `date: ${post.date || new Date().toISOString().slice(0, 10)}`,
    `category: ${JSON.stringify(post.category)}`,
    `tags: ${JSON.stringify(post.tags)}`,
    `draft: ${post.status === '草稿'}`,
    `pinned: ${Boolean(post.pinned)}`,
    `featured: ${Boolean(post.featured)}`,
    '---',
    '',
    post.content || ''
  ].join('\n') + '\n'
}

async function load() {
  if (!isConnected()) return
  connected.value = true
  busy.value = true
  error.value = ''
  try {
    const files = await listPosts()
    const items = []
    for (const file of files) {
      const text = await readTextFile(file.path)
      const frontmatter = parseFrontmatter(text.content)
      items.push({
        path: file.path,
        file: file.name,
        title: frontmatter.title || file.name,
        description: frontmatter.description || '',
        date: frontmatter.date || '',
        category: frontmatter.category || '未分类',
        tags: frontmatter.tags || [],
        status: frontmatter.draft ? '草稿' : '已发布',
        pinned: Boolean(frontmatter.pinned),
        featured: Boolean(frontmatter.featured),
        content: splitFrontmatter(text.content).body.trimStart()
      })
    }
    posts.value = items
  } catch (err) {
    error.value = err.message
  } finally {
    busy.value = false
  }
}

function openEdit(post = {}) {
  editing.value = {
    path: post.path || '',
    file: post.file || '',
    title: post.title || '',
    description: post.description || '',
    date: post.date || new Date().toISOString().slice(0, 10),
    category: post.category || '技术',
    tags: (post.tags || []).join(', '),
    status: post.status || '已发布',
    pinned: Boolean(post.pinned),
    featured: Boolean(post.featured),
    content: post.content || ''
  }
  showModal.value = true
}

async function savePost() {
  const tags = editing.value.tags
    .split(/[,，\s]+/)
    .filter(Boolean)
  busy.value = true
  error.value = ''
  try {
    const file = editing.value.file || `${slugify(editing.value.title)}.md`
    const path = editing.value.path || `site/posts/${file}`
    const message = editing.value.path
      ? `feat: update ${file}`
      : `feat: create ${file}`
    await writeTextFile(
      path,
      buildFrontmatter({ ...editing.value, tags }),
      message
    )
    showModal.value = false
    await load()
  } catch (err) {
    error.value = err.message
  } finally {
    busy.value = false
  }
}

async function removePost(post) {
  if (!window.confirm(`确认删除《${post.title}》？`)) return
  busy.value = true
  error.value = ''
  try {
    await deleteFile(post.path, `chore: delete ${post.file}`)
    await load()
  } catch (err) {
    error.value = err.message
  } finally {
    busy.value = false
  }
}

async function toggleFlag(key, post) {
  busy.value = true
  error.value = ''
  try {
    const message = key === 'pinned' ? `feat: pin ${post.file}` : `feat: feature ${post.file}`
    await writeTextFile(
      post.path,
      buildFrontmatter({ ...post, [key]: !post[key], status: post.status === '草稿' ? '草稿' : '已发布' }),
      message
    )
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
  <AdminShell active="posts">
    <div class="admin-page-head">
      <div>
        <h1 class="admin-page-title">文章管理</h1>
        <p class="admin-page-lead">真实读写仓库中的 Markdown 文章。</p>
      </div>
      <button class="btn btn-gold" type="button" @click="openEdit()">
        <Plus :size="15" /> 新增文章
      </button>
    </div>

    <p v-if="error" class="admin-login-error">{{ error }}</p>
    <div v-if="!connected" class="admin-login-empty">
      请先连接 GitHub Token，再加载仓库文章。
    </div>

    <div v-if="connected" class="admin-table-wrap">
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
          <tr v-for="post in posts" :key="post.path">
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
              <button type="button" title="置顶" @click="toggleFlag('pinned', post)"><Pin :size="15" /></button>
              <button type="button" title="加精" @click="toggleFlag('featured', post)"><Star :size="15" /></button>
              <button type="button" title="编辑" @click="openEdit(post)"><Pencil :size="15" /></button>
              <button type="button" title="删除" @click="removePost(post)"><Trash2 :size="15" /></button>
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
          描述
          <input v-model="editing.description" type="text" />
        </label>
        <label>
          日期
          <input v-model="editing.date" type="date" required />
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
        <label class="admin-check">
          <input v-model="editing.pinned" type="checkbox" />
          置顶
        </label>
        <label class="admin-check">
          <input v-model="editing.featured" type="checkbox" />
          加精
        </label>
        <label>
          正文 Markdown
          <textarea v-model="editing.content" rows="12" />
        </label>
        <div class="admin-form-actions">
          <button class="btn btn-gold" type="submit" :disabled="busy">{{ busy ? '保存中...' : '保存' }}</button>
          <button class="btn btn-ghost" type="button" @click="showModal = false">取消</button>
        </div>
      </form>
    </AdminModal>
  </AdminShell>
</template>

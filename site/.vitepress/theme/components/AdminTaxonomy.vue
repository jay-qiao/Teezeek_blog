<script setup>
import { onMounted, ref } from 'vue'
import { Plus, Trash2 } from 'lucide-vue-next'
import {
  isConnected,
  listPosts,
  readTextFile,
  writeTextFile
} from '../admin/github.js'

const categories = ref([])
const tags = ref([])
const newCategory = ref('')
const newTag = ref('')
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
    const taxonomyFile = await readTextFile('site/data/taxonomy.json')
    const taxonomy = JSON.parse(taxonomyFile.content)
    categories.value = [...taxonomy.categories]
    tags.value = [...taxonomy.tags]
    const files = await listPosts()
    for (const file of files) {
      const text = await readTextFile(file.path)
      const frontmatter = parseFrontmatter(text.content)
      if (frontmatter.category && !categories.value.includes(frontmatter.category)) {
        categories.value.push(frontmatter.category)
      }
      for (const tag of frontmatter.tags || []) {
        if (!tags.value.includes(tag)) tags.value.push(tag)
      }
    }
  } catch (err) {
    error.value = err.message
  } finally {
    busy.value = false
  }
}

function parseFrontmatter(raw) {
  const match = String(raw).match(/^---\r?\n([\s\S]*?)\r?\n---/)
  if (!match) return {}
  const data = {}
  let key = ''
  for (const line of match[1].split(/\r?\n/)) {
    const field = line.match(/^([\w-]+):\s*(.*)$/)
    if (field) {
      key = field[1]
      data[key] = parseScalar(field[2])
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
  if ((text.startsWith('"') && text.endsWith('"')) || (text.startsWith("'") && text.endsWith("'"))) {
    return text.slice(1, -1)
  }
  if (text.startsWith('[') && text.endsWith(']')) {
    return text.slice(1, -1).split(',').map((item) => item.trim().replace(/^["']|["']$/g, '')).filter(Boolean)
  }
  return text
}

async function save() {
  busy.value = true
  error.value = ''
  try {
    await writeTextFile(
      'site/data/taxonomy.json',
      JSON.stringify({ categories: categories.value, tags: tags.value }, null, 2) + '\n',
      'chore: update taxonomy'
    )
    notice.value = '分类标签已保存到仓库'
    window.setTimeout(() => {
      notice.value = ''
    }, 1800)
  } catch (err) {
    error.value = err.message
  } finally {
    busy.value = false
  }
}

async function addCategory() {
  const value = newCategory.value.trim()
  if (value && !categories.value.includes(value)) categories.value.push(value)
  newCategory.value = ''
  await save()
}

async function addTag() {
  const value = newTag.value.trim()
  if (value && !tags.value.includes(value)) tags.value.push(value)
  newTag.value = ''
  await save()
}

async function removeCategory(item) {
  categories.value = categories.value.filter((category) => category !== item)
  await save()
}

async function removeTag(item) {
  tags.value = tags.value.filter((tag) => tag !== item)
  await save()
}

onMounted(load)
</script>

<template>
  <AdminShell active="taxonomy">
    <h1 class="admin-page-title">分类标签</h1>
    <p class="admin-page-lead">管理文章分类与标签，保存后写入仓库并触发自动部署。</p>

    <p v-if="error" class="admin-login-error">{{ error }}</p>
    <p v-if="notice" class="admin-save-tip">{{ notice }}</p>
    <div v-if="!connected" class="admin-login-empty">
      请先连接 GitHub Token，再管理分类标签。
    </div>

    <div v-if="connected" class="admin-panels">
      <section class="admin-panel">
        <h2>分类</h2>
        <form class="admin-inline-form" @submit.prevent="addCategory">
          <input v-model="newCategory" type="text" placeholder="新分类名称" />
          <button class="btn btn-ghost" type="submit" :disabled="busy"><Plus :size="14" /> 添加</button>
        </form>
        <div class="taxonomy-list">
          <span v-for="item in categories" :key="item" class="taxonomy-item">
            {{ item }}
            <button type="button" aria-label="删除" @click="removeCategory(item)">
              <Trash2 :size="13" />
            </button>
          </span>
        </div>
      </section>

      <section class="admin-panel">
        <h2>标签</h2>
        <form class="admin-inline-form" @submit.prevent="addTag">
          <input v-model="newTag" type="text" placeholder="新标签名称" />
          <button class="btn btn-ghost" type="submit" :disabled="busy"><Plus :size="14" /> 添加</button>
        </form>
        <div class="taxonomy-list">
          <span v-for="item in tags" :key="item" class="taxonomy-item">
            {{ item }}
            <button type="button" aria-label="删除" @click="removeTag(item)">
              <Trash2 :size="13" />
            </button>
          </span>
        </div>
      </section>
    </div>
  </AdminShell>
</template>

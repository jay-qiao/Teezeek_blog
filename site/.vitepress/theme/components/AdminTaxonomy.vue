<script setup>
import { ref } from 'vue'
import { Plus, Trash2 } from 'lucide-vue-next'

const categories = ref(['技术', '前端', '指南', '随笔', '公告'])
const tags = ref(['VitePress', 'GitHub Pages', '字体', '博客', '读书', '工具'])
const newCategory = ref('')
const newTag = ref('')

function addCategory() {
  const value = newCategory.value.trim()
  if (value && !categories.value.includes(value)) categories.value.push(value)
  newCategory.value = ''
}

function addTag() {
  const value = newTag.value.trim()
  if (value && !tags.value.includes(value)) tags.value.push(value)
  newTag.value = ''
}
</script>

<template>
  <AdminShell active="taxonomy">
    <h1 class="admin-page-title">分类标签</h1>
    <p class="admin-page-lead">管理文章分类与标签，所有修改仅保留在当前页面。</p>

    <div class="admin-panels">
      <section class="admin-panel">
        <h2>分类</h2>
        <form class="admin-inline-form" @submit.prevent="addCategory">
          <input v-model="newCategory" type="text" placeholder="新分类名称" />
          <button class="btn btn-ghost" type="submit"><Plus :size="14" /> 添加</button>
        </form>
        <div class="taxonomy-list">
          <span v-for="item in categories" :key="item" class="taxonomy-item">
            {{ item }}
            <button type="button" aria-label="删除" @click="categories = categories.filter((c) => c !== item)">
              <Trash2 :size="13" />
            </button>
          </span>
        </div>
      </section>

      <section class="admin-panel">
        <h2>标签</h2>
        <form class="admin-inline-form" @submit.prevent="addTag">
          <input v-model="newTag" type="text" placeholder="新标签名称" />
          <button class="btn btn-ghost" type="submit"><Plus :size="14" /> 添加</button>
        </form>
        <div class="taxonomy-list">
          <span v-for="item in tags" :key="item" class="taxonomy-item">
            {{ item }}
            <button type="button" aria-label="删除" @click="tags = tags.filter((t) => t !== item)">
              <Trash2 :size="13" />
            </button>
          </span>
        </div>
      </section>
    </div>
  </AdminShell>
</template>


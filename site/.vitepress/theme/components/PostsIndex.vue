<script setup>
import { computed, ref } from 'vue'
import { ArrowRight } from 'lucide-vue-next'
import { data as posts } from '../../../posts.data.js'

const activeTag = ref('全部')
const activeCategory = ref('全部')

const categories = computed(() => {
  const set = new Set(posts.map((post) => post.frontmatter.category).filter(Boolean))
  return ['全部', ...set]
})

const tags = computed(() => {
  const set = new Set(posts.flatMap((post) => post.frontmatter.tags || []))
  return ['全部', ...set]
})

const visiblePosts = computed(() => {
  return posts.filter((post) => {
    const categoryOk =
      activeCategory.value === '全部' || post.frontmatter.category === activeCategory.value
    const tagOk =
      activeTag.value === '全部' || (post.frontmatter.tags || []).includes(activeTag.value)
    return categoryOk && tagOk
  })
})

function formatDate(value) {
  if (!value) return ''
  return new Date(value).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
</script>

<template>
  <section class="posts-index">
    <div class="page-kicker">九又四分之三站台</div>
    <h1 class="page-title">文章</h1>
    <p class="page-lead">从卡塞尔出发的每一篇笔记，都通向一个站台。</p>

    <div class="tag-bar" aria-label="按分类筛选">
      <button
        v-for="category in categories"
        :key="category"
        type="button"
        class="tag-chip category-chip"
        :class="{ 'is-active': activeCategory === category }"
        @click="activeCategory = category"
      >
        {{ category }}
      </button>
    </div>

    <div class="tag-bar" aria-label="按标签筛选">
      <button
        v-for="tag in tags"
        :key="tag"
        type="button"
        class="tag-chip"
        :class="{ 'is-active': activeTag === tag }"
        @click="activeTag = tag"
      >
        {{ tag }}
      </button>
    </div>

    <div class="post-list">
      <article v-for="post in visiblePosts" :key="post.url" class="post-card">
        <div class="post-card-meta">
          <time :datetime="post.frontmatter.date">{{ formatDate(post.frontmatter.date) }}</time>
          <span v-for="tag in post.frontmatter.tags" :key="tag" class="post-tag">{{ tag }}</span>
        </div>
        <h2 class="post-card-title">
          <a :href="post.url">{{ post.frontmatter.title }}</a>
        </h2>
        <p class="post-card-desc">{{ post.frontmatter.description }}</p>
        <a class="post-more" :href="post.url">
          继续阅读
          <ArrowRight :size="14" />
        </a>
      </article>
    </div>
  </section>
</template>

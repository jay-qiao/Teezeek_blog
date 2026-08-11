<script setup>
import { withBase } from 'vitepress'
import { data as updates } from '../../../updates.data.js'

function formatDate(value) {
  return new Date(value).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
</script>

<template>
  <section class="posts-index">
    <div class="page-kicker">公告栏</div>
    <h1 class="page-title">公告</h1>
    <p class="page-lead">关于这座图书馆的消息，都会张贴在这里。</p>

    <div class="post-list">
      <article v-for="post in updates" :key="post.url" class="post-card">
        <div class="post-card-meta">
          <time :datetime="post.frontmatter.date">{{ formatDate(post.frontmatter.date) }}</time>
          <span v-for="tag in post.frontmatter.tags" :key="tag" class="post-tag">{{ tag }}</span>
        </div>
        <h2 class="post-card-title">
          <a :href="withBase(post.url)">{{ post.frontmatter.title }}</a>
        </h2>
        <p class="post-card-desc">{{ post.frontmatter.description }}</p>
      </article>
    </div>
  </section>
</template>

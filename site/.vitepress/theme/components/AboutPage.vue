<script setup>
import { Github, Mail, Rss } from 'lucide-vue-next'

const skills = ['Vue 3', 'VitePress', 'ES Module', 'npm', 'GitHub Pages', 'Markdown']
</script>

<template>
  <section class="about-page">
    <div class="about-hero">
      <div class="about-seal" aria-hidden="true">
        <span>T</span>
      </div>
      <div class="about-copy">
        <p class="page-kicker">有求必应屋</p>
        <h1 class="page-title">关于 Teezeek</h1>
        <p class="page-lead">
          一个在代码与文字之间来回穿梭的旅人。这座图书馆里存放着我读过的书、写过的代码，
          以及那些不想被遗忘的想法。
        </p>
        <div class="about-social">
          <a class="social-link" href="https://github.com/jay-qiao" target="_blank" rel="noreferrer">
            <Github :size="16" /> GitHub
          </a>
          <a class="social-link" href="mailto:hello@teezeek.dev">
            <Mail :size="16" /> 写信给我
          </a>
          <a class="social-link" href="/Teezeek_blog/feed.xml">
            <Rss :size="16" /> RSS
          </a>
        </div>
      </div>
    </div>

    <div class="about-section">
      <h2>技术栈</h2>
      <div class="skill-list">
        <span v-for="skill in skills" :key="skill" class="skill-chip">{{ skill }}</span>
      </div>
    </div>

    <div class="about-section">
      <h2>这座图书馆</h2>
      <p>
        本站基于 VitePress 1.6.4 与 Vue 3 构建，使用 ES Module 与 npm 管理，
        部署在 GitHub Pages。内容全部以 Markdown 维护，发布即一次 `git push`。
      </p>
    </div>
  </section>
</template>


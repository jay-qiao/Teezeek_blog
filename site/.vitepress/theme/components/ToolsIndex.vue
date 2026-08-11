<script setup>
import { BookMarked, Code2, Feather, FlaskConical, PenLine, Terminal } from 'lucide-vue-next'
import { withBase } from 'vitepress'

const tools = [
  {
    name: 'Markdown 工作台',
    desc: '在浏览器中写作与预览 Markdown，适合快速起草。',
    link: '/admin',
    icon: PenLine
  },
  {
    name: '龙文排版器',
    desc: '用一段文字生成装饰性的符文序列。',
    link: '/tools/rune-typesetter',
    icon: Feather
  },
  {
    name: '咒语速查表',
    desc: '常用命令、快捷键与配置片段速查。',
    link: '/tools/spellbook',
    icon: Terminal
  },
  {
    name: '炼金试验场',
    desc: '存放实验中的小工具与临时脚本。',
    link: '/tools/lab',
    icon: FlaskConical
  },
  {
    name: '藏书目录',
    desc: '最近阅读的书与读书摘记。',
    link: '/tools/bookshelf',
    icon: BookMarked
  },
  {
    name: '代码符石',
    desc: '精选代码片段与运行示例。',
    link: '/tools/code-stones',
    icon: Code2
  }
]
</script>

<template>
  <section class="tools-index">
    <div class="page-kicker">奥利凡德魔杖店</div>
    <h1 class="page-title">工具</h1>
    <p class="page-lead">每件工具都该被认真挑选，就像每一根魔杖都会选择它的主人。</p>

    <div class="tools-board">
      <div class="tools-board-inner">
        <a
          v-for="(tool, index) in tools"
          :key="tool.link"
          class="tool-post"
          :class="`post-${(index % 4) + 1}`"
          :href="withBase(tool.link)"
        >
          <span class="tool-post-pin" aria-hidden="true" />
          <span class="tool-post-ribbon">悬赏令</span>
          <span class="tool-post-stamp">奥利凡德</span>
          <span class="tool-icon"><component :is="tool.icon" :size="22" /></span>
          <h2>{{ tool.name }}</h2>
          <p>{{ tool.desc }}</p>
          <span class="tool-post-action">接下悬赏</span>
        </a>
      </div>
    </div>
  </section>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import {
  ArrowRight,
  Bell,
  BookOpen,
  Compass,
  Home,
  Mail,
  ScrollText,
  Trophy,
  User,
  Wand2
} from 'lucide-vue-next'
import { withBase } from 'vitepress'
import defaultAppearance from '../../../data/appearance.json'

const STORAGE_KEY = 'teezeek-gate-seen'
const CONFIG_KEY = 'teezeek-letter-config'
const LOADING_DURATION = 1500

const DEFAULT_LETTER = defaultAppearance.letter
const DEFAULT_MAP = defaultAppearance.map

const stage = ref('loading')
const opening = ref(false)
const sealBreaking = ref(false)
const progress = ref(0)
const letter = ref({ ...DEFAULT_LETTER })
const map = ref({ ...DEFAULT_MAP })
let loadTimer = 0
let progressRaf = 0

const departments = [
  { title: '公告栏', en: 'Bulletin Board', desc: '最新动态与热门文章，都张贴在这里。', link: '/updates/', icon: Bell, x: 18, y: 18 },
  { title: '文章站台', en: 'Post Platform', desc: '文章与笔记，支持分类和标签筛选。', link: '/posts/', icon: BookOpen, x: 38, y: 48 },
  { title: '工具屋', en: 'Tools House', desc: '趁手的工具、代码符石与资源收藏。', link: '/tools/', icon: Wand2, x: 65, y: 22 },
  { title: '屠龙勇士榜', en: 'Heroes Ranking', desc: '为这座图书馆贡献力量的勇士排行。', link: '/leaderboard', icon: Trophy, x: 75, y: 62 },
  { title: '议事厅', en: 'Meeting Hall', desc: '关于我、联系方式与社交链接。', link: '/about', icon: User, x: 28, y: 74 }
]

function openLetter() {
  if (opening.value) return
  opening.value = true
  sealBreaking.value = true
  sessionStorage.setItem(STORAGE_KEY, '1')
  clearTimeout(loadTimer)
  loadTimer = window.setTimeout(() => {
    stage.value = 'loading'
    opening.value = false
    sealBreaking.value = false
    progress.value = 0
    const startAt = performance.now()
    const tick = (now) => {
      progress.value = Math.min(100, Math.floor(((now - startAt) / LOADING_DURATION) * 100))
      if (progress.value < 100) progressRaf = requestAnimationFrame(tick)
    }
    progressRaf = requestAnimationFrame(tick)
    loadTimer = window.setTimeout(() => {
      stage.value = 'map'
      cancelAnimationFrame(progressRaf)
      progress.value = 0
    }, LOADING_DURATION)
  }, 520)
}

function skipLetter() {
  cancelAnimationFrame(progressRaf)
  progress.value = 0
  sessionStorage.setItem(STORAGE_KEY, '1')
  stage.value = 'map'
}

function rereadLetter() {
  cancelAnimationFrame(progressRaf)
  progress.value = 0
  sessionStorage.removeItem(STORAGE_KEY)
  opening.value = false
  sealBreaking.value = false
  stage.value = 'letter'
}

onMounted(() => {
  const stored = localStorage.getItem(CONFIG_KEY)
  if (stored) {
    try {
      const config = JSON.parse(stored)
      letter.value = { ...DEFAULT_LETTER, ...(config.letter || {}) }
      map.value = { ...DEFAULT_MAP, ...(config.map || {}) }
    } catch {
      // keep defaults when stored config is invalid
    }
  }

  stage.value = sessionStorage.getItem(STORAGE_KEY) === '1' ? 'map' : 'letter'
})

onBeforeUnmount(() => {
  clearTimeout(loadTimer)
  cancelAnimationFrame(progressRaf)
})
</script>

<template>
  <main class="parchment-gate">
    <RuneRain :density="1.1" />
    <MouseGlow />

    <Transition name="gate-stage">
      <section v-if="stage === 'loading'" key="loading" class="gate-loading">
        <div class="rune-loader" aria-hidden="true">
          <div class="rune-loader-ring">ᚱ ᚨ ᚷ ᚾ ᚨ ᚱ</div>
          <div class="rune-loader-core">T</div>
        </div>
        <h2>烬土学院正在苏醒</h2>
        <p>信卷正在穿过迷雾，请稍候。</p>
        <div class="rune-loader-progress" aria-hidden="true"><span :style="{ width: `${progress}%` }" /></div>
        <div class="rune-loader-meta">
          <span>{{ progress }}%</span>
          <span>学院入口校准中</span>
        </div>
      </section>

      <section v-else-if="stage === 'letter'" key="letter" class="gate-letter" :class="{ 'is-opening': opening }">
        <div class="letter-sheet" :class="{ 'is-unfolding': opening }">
          <div class="letter-runes" aria-hidden="true">ᚱ ᚨ ᚷ ᚾ ᚨ ᚱ</div>
          <div class="wax-seal" :class="{ 'is-breaking': sealBreaking }" aria-hidden="true">
            <span>T</span>
          </div>
          <p class="letter-greeting">入学通知</p>
          <h1 class="letter-title">{{ letter.title }}</h1>
          <p class="letter-body">{{ letter.body }}</p>
          <div class="letter-actions">
            <button class="btn btn-gold" type="button" @click="openLetter">
              确定进入
              <ArrowRight :size="16" />
            </button>
            <button class="btn btn-ghost" type="button" @click="skipLetter">跳过，直达大厅</button>
          </div>
        </div>
      </section>

      <section v-else key="map" class="gate-map">
        <header class="gate-header">
          <p class="gate-kicker"><ScrollText :size="14" /> 烬土学院 · 入学指引</p>
          <h1 class="gate-title">{{ map.title }}</h1>
          <p class="gate-subtitle">{{ map.subtitle }}</p>
          <div class="gate-runes" aria-hidden="true">ᚱᚨᚷᚾᚨᚱ · ᚨᛊᚺᛚᚨᚾᛞᛊ · ᛏᛖᛖᛉᛖᛖᚲ</div>
        </header>

        <div class="map-parchment">
          <span class="map-texture" aria-hidden="true" />
          <span class="map-aging" aria-hidden="true" />
          <svg class="map-lines" viewBox="0 0 1000 620" preserveAspectRatio="none" aria-hidden="true">
            <path d="M180 112 C 250 160, 300 220, 380 298 M380 298 C 340 340, 300 410, 280 458 M650 136 C 690 190, 720 300, 750 384 M380 298 C 500 320, 640 330, 750 384 M280 458 C 420 470, 620 460, 750 384" />
            <circle cx="180" cy="112" r="6" />
            <circle cx="380" cy="298" r="6" />
            <circle cx="650" cy="136" r="6" />
            <circle cx="750" cy="384" r="6" />
            <circle cx="280" cy="458" r="6" />
            <text x="78" y="520" class="map-rune-text">ᚱᚨᚷᚾᚨᚱ</text>
            <g class="map-compass">
              <circle cx="870" cy="86" r="38" />
              <path d="M870 58 L880 86 L870 114 L860 86 Z" />
              <text x="870" y="48">N</text>
            </g>
          </svg>

          <a
            v-for="item in departments"
            :key="item.link"
            class="map-landmark"
            :class="`landmark-${item.link.replace(/[^a-z0-9]/gi, '').toLowerCase()}`"
            :style="{ left: `${item.x}%`, top: `${item.y}%` }"
            :href="withBase(item.link)"
          >
            <span class="map-pin"><component :is="item.icon" :size="20" /></span>
            <span class="map-copy">
              <span class="map-name">{{ item.title }}</span>
              <span class="map-en">{{ item.en }}</span>
              <span class="map-desc">{{ item.desc }}</span>
            </span>
          </a>
        </div>

        <footer class="gate-footer">
          <a class="gate-admin" :href="withBase('/admin')"><Compass :size="15" /> 管理员入口（演示）</a>
          <button class="btn-link" type="button" @click="rereadLetter"><Mail :size="14" /> 重读来信</button>
          <a class="gate-home" :href="withBase('/')"><Home :size="15" /> 返回大厅</a>
        </footer>
      </section>
    </Transition>
  </main>
</template>

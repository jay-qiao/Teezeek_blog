<script setup>
import { onMounted, ref } from 'vue'
import { ArrowDown, ArrowUp, Calculator, Pencil, Plus, Save, Trash2 } from 'lucide-vue-next'
import {
  isConnected,
  listIssueComments,
  listIssuesByLabel,
  listPosts,
  readTextFile,
  writeTextFile
} from '../admin/github.js'
import AdminModal from './AdminModal.vue'

const POST_POINTS = 100
const COMMENT_POINTS = 10
const COMMENT_LABEL = 'Teezeek 评论'

const heroes = ref([])
const candidates = ref([])
const scoring = ref(false)
const connected = ref(false)
const busy = ref(false)
const error = ref('')
const saved = ref(false)
const showModal = ref(false)
const editing = ref(null)

function blankHero() {
  return {
    rank: heroes.value.length + 1,
    name: '',
    username: '',
    title: '',
    points: 0,
    posts: 0,
    badge: '',
    tier: '',
    icon: 'trophy',
    approved: false
  }
}

async function load() {
  if (!isConnected()) return
  connected.value = true
  busy.value = true
  error.value = ''
  try {
    const file = await readTextFile('site/data/leaderboard.json')
    const data = JSON.parse(file.content)
    heroes.value = (data.heroes || []).slice().sort((a, b) => Number(a.rank) - Number(b.rank))
  } catch (err) {
    error.value = err.message
  } finally {
    busy.value = false
  }
}

async function save() {
  busy.value = true
  error.value = ''
  try {
    const payload = {
      heroes: heroes.value
        .filter((hero) => hero.approved)
        .map((hero, index) => ({ ...hero, rank: index + 1 }))
        .sort((a, b) => Number(a.rank) - Number(b.rank))
    }
    await writeTextFile(
      'site/data/leaderboard.json',
      JSON.stringify(payload, null, 2) + '\n',
      'chore: update leaderboard'
    )
    saved.value = true
    window.setTimeout(() => {
      saved.value = false
    }, 1800)
    await load()
  } catch (err) {
    error.value = err.message
  } finally {
    busy.value = false
  }
}

async function computeScores() {
  scoring.value = true
  error.value = ''
  try {
    const files = await listPosts()
    const postAuthors = {}
    for (const file of files) {
      const text = await readTextFile(file.path)
      const match = String(text.content).match(/^---\r?\n([\s\S]*?)\r?\n---/)
      if (!match) continue
      const author = match[1].match(/^author:\s*(.*)$/m)
      const username = author ? author[1].trim().replace(/^["']|["']$/g, '') : ''
      if (username) postAuthors[username] = (postAuthors[username] || 0) + 1
    }

    const comments = {}
    const issues = await listIssuesByLabel(COMMENT_LABEL)
    for (const issue of issues) {
      const items = await listIssueComments(issue.number)
      for (const comment of items) {
        const login = comment.user?.login
        if (!login) continue
        comments[login] = (comments[login] || 0) + 1
      }
    }

    const usernames = new Set([
      ...Object.keys(postAuthors),
      ...Object.keys(comments)
    ])
    candidates.value = Array.from(usernames)
      .map((username) => {
        const posts = postAuthors[username] || 0
        const commentCount = comments[username] || 0
        return {
          username,
          name: username,
          title: '贡献者',
          points: posts * POST_POINTS + commentCount * COMMENT_POINTS,
          posts,
          comments: commentCount,
          badge: commentCount ? '龙语记录者' : '书页撰稿人',
          tier: posts ? '执笔者' : '回声者',
          icon: 'star',
          approved: heroes.value.some((hero) => hero.username === username && hero.approved)
        }
      })
      .sort((a, b) => b.points - a.points)
  } catch (err) {
    error.value = err.message
  } finally {
    scoring.value = false
  }
}

function applyCandidates() {
  for (const candidate of candidates.value) {
    const existing = heroes.value.find((hero) => hero.username === candidate.username)
    if (existing) {
      Object.assign(existing, {
        name: candidate.name || existing.name,
        title: candidate.title || existing.title,
        points: candidate.points,
        posts: candidate.posts,
        badge: candidate.badge || existing.badge,
        tier: candidate.tier || existing.tier,
        approved: candidate.approved
      })
    } else if (candidate.approved) {
      heroes.value.push({ ...candidate, rank: heroes.value.length + 1 })
    }
  }
  heroes.value = heroes.value
    .slice()
    .sort((a, b) => Number(b.points) - Number(a.points))
    .map((hero, i) => ({ ...hero, rank: i + 1 }))
}

function openEdit(hero) {
  editing.value = hero ? { ...hero } : blankHero()
  showModal.value = true
}

function saveEdit() {
  if (!editing.value) return
  const index = heroes.value.findIndex((hero) => hero === editing.value)
  if (index >= 0) {
    heroes.value[index] = { ...editing.value }
  } else {
    heroes.value.push({ ...editing.value })
  }
  heroes.value = heroes.value
    .slice()
    .sort((a, b) => Number(a.rank) - Number(b.rank))
    .map((hero, i) => ({ ...hero, rank: i + 1 }))
  showModal.value = false
}

function removeHero(hero) {
  if (!window.confirm(`确认移除 ${hero.name || '该勇士'}？`)) return
  heroes.value = heroes.value
    .filter((item) => item !== hero)
    .map((item, i) => ({ ...item, rank: i + 1 }))
}

function moveHero(hero, direction) {
  const index = heroes.value.indexOf(hero)
  const target = index + direction
  if (target < 0 || target >= heroes.value.length) return
  const next = heroes.value.slice()
  ;[next[index], next[target]] = [next[target], next[index]]
  heroes.value = next.map((item, i) => ({ ...item, rank: i + 1 }))
}

onMounted(load)
</script>

<template>
  <AdminShell active="leaderboard">
    <div class="admin-page-head">
      <div>
        <h1 class="admin-page-title">屠龙榜管理</h1>
        <p class="admin-page-lead">维护勇士排行数据，保存后写入仓库并自动上线。</p>
      </div>
      <div class="admin-head-actions">
        <button class="btn btn-ghost" type="button" :disabled="busy || scoring" @click="computeScores">
          <Calculator :size="15" /> {{ scoring ? '计分中...' : '自动计分' }}
        </button>
        <button class="btn btn-ghost" type="button" :disabled="busy" @click="save">
          <Save :size="15" /> {{ busy ? '保存中...' : '保存排行' }}
        </button>
        <button class="btn btn-gold" type="button" @click="openEdit()">
          <Plus :size="15" /> 新增勇士
        </button>
      </div>
    </div>

    <p v-if="error" class="admin-login-error">{{ error }}</p>
    <p v-if="saved" class="admin-save-tip">已保存到仓库</p>
    <div v-if="!connected" class="admin-login-empty">
      请先连接 GitHub Token，再管理屠龙榜。
    </div>

    <section v-if="connected && candidates.length" class="admin-panel">
      <h2>自动计分结果</h2>
      <p class="admin-page-lead">按「文章 100 分 / 评论 10 分」计算，勾选后才会收录进榜单。</p>
      <div class="admin-table-wrap">
        <table class="admin-table">
          <thead>
            <tr>
              <th>收录</th>
              <th>GitHub 用户</th>
              <th>文章</th>
              <th>评论</th>
              <th>贡献分</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="candidate in candidates" :key="candidate.username">
              <td>
                <input v-model="candidate.approved" type="checkbox" />
              </td>
              <td><strong>{{ candidate.username }}</strong></td>
              <td>{{ candidate.posts }}</td>
              <td>{{ candidate.comments }}</td>
              <td>{{ candidate.points }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="admin-form-actions">
        <button class="btn btn-gold" type="button" :disabled="busy" @click="applyCandidates">
          按勾选收录并保存
        </button>
      </div>
    </section>

    <div v-if="connected" class="admin-table-wrap">
      <table class="admin-table">
        <thead>
          <tr>
            <th>排名</th>
            <th>勇士</th>
            <th>GitHub</th>
            <th>称号</th>
            <th>贡献</th>
            <th>文章</th>
            <th>徽章</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(hero, index) in heroes" :key="hero.name || index">
            <td>#{{ hero.rank }}</td>
            <td>
              <strong>{{ hero.name }}</strong>
              <span class="admin-sub-text">{{ hero.tier }}</span>
            </td>
            <td>{{ hero.username || '-' }}</td>
            <td>{{ hero.title }}</td>
            <td>{{ hero.points }}</td>
            <td>{{ hero.posts }} 篇</td>
            <td>{{ hero.badge }}</td>
            <td class="admin-actions">
              <button type="button" title="上移" :disabled="index === 0" @click="moveHero(hero, -1)"><ArrowUp :size="15" /></button>
              <button type="button" title="下移" :disabled="index === heroes.length - 1" @click="moveHero(hero, 1)"><ArrowDown :size="15" /></button>
              <button type="button" title="编辑" @click="openEdit(hero)"><Pencil :size="15" /></button>
              <button type="button" class="is-danger" title="删除" @click="removeHero(hero)"><Trash2 :size="15" /></button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <AdminModal v-if="showModal" title="编辑勇士" @close="showModal = false">
      <form class="admin-form" @submit.prevent="saveEdit">
        <label>名字<input v-model="editing.name" type="text" required /></label>
        <label>GitHub 用户名<input v-model="editing.username" type="text" placeholder="用于自动计分匹配" /></label>
        <label>称号<input v-model="editing.title" type="text" /></label>
        <label>头衔<input v-model="editing.tier" type="text" /></label>
        <label>徽章<input v-model="editing.badge" type="text" /></label>
        <label>贡献积分<input v-model.number="editing.points" type="number" min="0" /></label>
        <label>文章数<input v-model.number="editing.posts" type="number" min="0" /></label>
        <label>
          图标
          <select v-model="editing.icon">
            <option value="crown">王冠</option>
            <option value="medal">奖章</option>
            <option value="star">星芒</option>
            <option value="flame">火焰</option>
            <option value="trophy">奖杯</option>
          </select>
        </label>
        <label class="admin-check">
          <input v-model="editing.approved" type="checkbox" />
          批准上榜
        </label>
        <div class="admin-form-actions">
          <button class="btn btn-gold" type="submit">确定</button>
          <button class="btn btn-ghost" type="button" @click="showModal = false">取消</button>
        </div>
      </form>
    </AdminModal>
  </AdminShell>
</template>

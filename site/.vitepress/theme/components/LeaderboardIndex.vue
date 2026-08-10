<script setup>
import { Crown, Flame, Medal, Star, Trophy } from 'lucide-vue-next'

const heroes = [
  { rank: 1, name: 'Teezeek', title: '图书馆馆长', points: 1280, posts: 12, badge: '龙之书页', icon: Crown },
  { rank: 2, name: '旅鸽', title: '站台管理员', points: 860, posts: 8, badge: '银羽信使', icon: Medal },
  { rank: 3, name: '灰烬', title: '炼金学徒', points: 540, posts: 5, badge: '火漆学徒', icon: Star },
  { rank: 4, name: '北境旅人', title: '藏书客', points: 320, posts: 3, badge: '夜航者', icon: Flame },
  { rank: 5, name: '未具名巫师', title: '匿名访客', points: 120, posts: 1, badge: '迷雾旅人', icon: Trophy }
]
</script>

<template>
  <section class="leaderboard">
    <div class="page-kicker">屠龙勇士榜</div>
    <h1 class="page-title">勇士排行</h1>
    <p class="page-lead">每一位为这座图书馆贡献文章、评论或工具的人，都会被写进榜中。</p>

    <div class="hero-podium">
      <article v-for="hero in heroes" :key="hero.rank" class="hero-card" :class="{ 'is-top': hero.rank === 1 }">
        <span class="hero-rank">#{{ hero.rank }}</span>
        <span class="hero-icon"><component :is="hero.icon" :size="22" /></span>
        <h2>{{ hero.name }}</h2>
        <p>{{ hero.title }}</p>
        <div class="hero-stats">
          <span>{{ hero.posts }} 篇</span>
          <span>{{ hero.points }} 贡献</span>
        </div>
        <span class="hero-badge">{{ hero.badge }}</span>
      </article>
    </div>
  </section>
</template>


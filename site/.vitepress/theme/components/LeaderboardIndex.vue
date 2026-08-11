<script setup>
import { Crown, Flame, Medal, Star, Trophy } from 'lucide-vue-next'
import leaderboardData from '../../../data/leaderboard.json'

const iconMap = {
  crown: Crown,
  medal: Medal,
  star: Star,
  flame: Flame,
  trophy: Trophy
}

const heroes = (leaderboardData.heroes || [])
  .slice()
  .sort((a, b) => Number(a.rank) - Number(b.rank))
  .map((hero) => ({ ...hero, icon: iconMap[hero.icon] || Trophy }))
const maxPoints = Math.max(...heroes.map((hero) => hero.points))
</script>

<template>
  <section class="leaderboard">
    <div class="page-kicker">屠龙勇士榜</div>
    <h1 class="page-title">勇士排行</h1>
    <p class="page-lead">每一位为这座图书馆贡献文章、评论或工具的人，都会被写进榜中。</p>

    <div class="hero-podium">
      <article
        v-for="hero in heroes"
        :key="hero.rank"
        class="hero-card"
        :class="[`podium-${hero.rank}`, { 'is-top': hero.rank === 1 }]"
      >
        <span class="hero-rank">#{{ String(hero.rank).padStart(2, '0') }}</span>
        <span class="hero-icon"><component :is="hero.icon" :size="22" /></span>
        <span class="hero-tier">{{ hero.tier }}</span>
        <h2>{{ hero.name }}</h2>
        <p>{{ hero.title }}</p>
        <div class="hero-stats">
          <span>{{ hero.posts }} 篇</span>
          <span>{{ hero.points }} 贡献</span>
        </div>
        <div class="hero-progress">
          <i :style="{ width: `${Math.round((hero.points / maxPoints) * 100)}%` }" />
        </div>
        <span class="hero-badge">{{ hero.badge }}</span>
      </article>
    </div>
  </section>
</template>

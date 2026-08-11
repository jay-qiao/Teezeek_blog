import '@fontsource/cormorant-garamond/400-italic.css'
import '@fontsource/cormorant-garamond/600-italic.css'
import '@fontsource/cormorant-garamond/700-italic.css'
import '@fontsource/noto-serif-sc/400.css'
import '@fontsource/noto-serif-sc/700.css'
import '@fontsource/noto-serif-sc/900.css'
import '@fontsource/jetbrains-mono/400.css'
import '@fontsource/jetbrains-mono/600.css'

import DefaultTheme from 'vitepress/theme'
import Layout from './Layout.vue'
import AdminBackup from './components/AdminBackup.vue'
import AdminComments from './components/AdminComments.vue'
import AdminDashboard from './components/AdminDashboard.vue'
import AdminImages from './components/AdminImages.vue'
import AdminModal from './components/AdminModal.vue'
import AdminPosts from './components/AdminPosts.vue'
import AdminSettings from './components/AdminSettings.vue'
import AdminShell from './components/AdminShell.vue'
import AdminSubmissions from './components/AdminSubmissions.vue'
import AdminTaxonomy from './components/AdminTaxonomy.vue'
import AdminUsers from './components/AdminUsers.vue'
import AdminAppearance from './components/AdminAppearance.vue'
import AdminLeaderboard from './components/AdminLeaderboard.vue'
import AboutPage from './components/AboutPage.vue'
import AshParticles from './components/AshParticles.vue'
import LeaderboardIndex from './components/LeaderboardIndex.vue'
import MouseGlow from './components/MouseGlow.vue'
import ParchmentGate from './components/ParchmentGate.vue'
import PostsIndex from './components/PostsIndex.vue'
import RuneRain from './components/RuneRain.vue'
import SubmitPost from './components/SubmitPost.vue'
import ToolsIndex from './components/ToolsIndex.vue'
import UpdatesIndex from './components/UpdatesIndex.vue'
import './styles/index.css'

export default {
  extends: DefaultTheme,
  Layout,
  enhanceApp({ app, router }) {
    if (typeof document !== 'undefined') {
      let fadeTimer = 0
      router.onBeforeRouteChange = () => {
        const target = document.querySelector('.parchment-gate') || document.getElementById('VPContent')
        if (target) {
          target.style.transition = 'opacity 0.16s ease'
          target.style.opacity = '0'
        }
      }
      router.onAfterRouteChanged = () => {
        const target = document.querySelector('.parchment-gate') || document.getElementById('VPContent')
        clearTimeout(fadeTimer)
        fadeTimer = window.setTimeout(() => {
          if (target) target.style.opacity = '1'
        }, 60)
      }
    }

    app.component('AdminBackup', AdminBackup)
    app.component('AdminComments', AdminComments)
    app.component('AdminDashboard', AdminDashboard)
    app.component('AdminImages', AdminImages)
    app.component('AdminModal', AdminModal)
    app.component('AdminPosts', AdminPosts)
    app.component('AdminSettings', AdminSettings)
    app.component('AdminShell', AdminShell)
    app.component('AdminSubmissions', AdminSubmissions)
    app.component('AdminTaxonomy', AdminTaxonomy)
    app.component('AdminUsers', AdminUsers)
    app.component('AdminAppearance', AdminAppearance)
    app.component('AdminLeaderboard', AdminLeaderboard)
    app.component('AboutPage', AboutPage)
    app.component('AshParticles', AshParticles)
    app.component('LeaderboardIndex', LeaderboardIndex)
    app.component('MouseGlow', MouseGlow)
    app.component('ParchmentGate', ParchmentGate)
    app.component('PostsIndex', PostsIndex)
    app.component('RuneRain', RuneRain)
    app.component('SubmitPost', SubmitPost)
    app.component('ToolsIndex', ToolsIndex)
    app.component('UpdatesIndex', UpdatesIndex)
  }
}

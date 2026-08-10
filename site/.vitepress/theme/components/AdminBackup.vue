<script setup>
import { ref } from 'vue'
import { Database, Download, Plus, RotateCcw, Trash2 } from 'lucide-vue-next'

const backups = ref([
  { id: 1, name: '自动备份', time: '2026-08-10 02:00', size: '2.4 MB', status: '正常' },
  { id: 2, name: '开馆前备份', time: '2026-08-09 23:10', size: '1.8 MB', status: '正常' }
])
const notice = ref('')

function createBackup() {
  backups.value.unshift({
    id: Date.now(),
    name: '手动备份',
    time: new Date().toLocaleString('zh-CN'),
    size: '2.4 MB',
    status: '正常'
  })
  notice.value = '备份已创建（本地演示）'
  window.setTimeout(() => {
    notice.value = ''
  }, 1800)
}

function removeBackup(id) {
  backups.value = backups.value.filter((item) => item.id !== id)
}
</script>

<template>
  <AdminShell active="backup">
    <div class="admin-page-head">
      <div>
        <h1 class="admin-page-title">数据备份</h1>
        <p class="admin-page-lead">创建、恢复与删除备份，均为本地演示。</p>
      </div>
      <button class="btn btn-gold" type="button" @click="createBackup">
        <Plus :size="15" /> 创建备份
      </button>
    </div>

    <p v-if="notice" class="admin-save-tip">{{ notice }}</p>

    <div class="admin-table-wrap">
      <table class="admin-table">
        <thead>
          <tr>
            <th>名称</th>
            <th>时间</th>
            <th>大小</th>
            <th>状态</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="backup in backups" :key="backup.id">
            <td><strong>{{ backup.name }}</strong></td>
            <td>{{ backup.time }}</td>
            <td>{{ backup.size }}</td>
            <td><span class="admin-status status-ok">{{ backup.status }}</span></td>
            <td class="admin-actions">
              <button type="button" title="恢复"><RotateCcw :size="15" /></button>
              <button type="button" title="下载"><Download :size="15" /></button>
              <button type="button" title="删除" @click="removeBackup(backup.id)"><Trash2 :size="15" /></button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <section class="admin-panel admin-backup-note">
      <h2><Database :size="16" /> 说明</h2>
      <p>GitHub Pages 是静态托管，真实数据持久化需要后续接入外部服务或 CMS。当前后台用于演示完整的后台工作流。</p>
    </section>
  </AdminShell>
</template>


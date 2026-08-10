<script setup>
import { ref } from 'vue'
import { Check, Trash2, X } from 'lucide-vue-next'

const comments = ref([
  { id: 1, author: '旅鸽', content: '欢迎开馆！期待第一篇文章。', time: '2026-08-10 10:21', status: 'pending' },
  { id: 2, author: '灰烬', content: '暗金雨幕太酷了。', time: '2026-08-10 09:03', status: 'approved' },
  { id: 3, author: '北境旅人', content: '请问 RSS 地址在哪里？', time: '2026-08-09 22:41', status: 'pending' },
  { id: 4, author: '匿名访客', content: '占位评论。', time: '2026-08-09 18:12', status: 'rejected' }
])

function setStatus(id, status) {
  const target = comments.value.find((item) => item.id === id)
  if (target) target.status = status
}

function removeComment(id) {
  comments.value = comments.value.filter((item) => item.id !== id)
}
</script>

<template>
  <AdminShell active="comments">
    <h1 class="admin-page-title">评论审核</h1>
    <p class="admin-page-lead">审核通过、驳回或删除评论。</p>

    <div class="admin-table-wrap">
      <table class="admin-table">
        <thead>
          <tr>
            <th>作者</th>
            <th>内容</th>
            <th>时间</th>
            <th>状态</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="comment in comments" :key="comment.id">
            <td>{{ comment.author }}</td>
            <td>{{ comment.content }}</td>
            <td>{{ comment.time }}</td>
            <td>
              <span class="admin-status" :class="`status-${comment.status === 'approved' ? 'ok' : comment.status === 'rejected' ? 'red' : 'pending'}`">
                {{ comment.status === 'approved' ? '已通过' : comment.status === 'rejected' ? '已驳回' : '待审核' }}
              </span>
            </td>
            <td class="admin-actions">
              <button type="button" title="通过" @click="setStatus(comment.id, 'approved')"><Check :size="15" /></button>
              <button type="button" title="驳回" @click="setStatus(comment.id, 'rejected')"><X :size="15" /></button>
              <button type="button" title="删除" @click="removeComment(comment.id)"><Trash2 :size="15" /></button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </AdminShell>
</template>


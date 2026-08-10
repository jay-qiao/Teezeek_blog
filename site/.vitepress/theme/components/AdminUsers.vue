<script setup>
import { ref } from 'vue'

const users = ref([
  { id: 1, name: 'Teezeek', email: 'teezeek@example.com', role: '管理员', banned: false },
  { id: 2, name: '旅鸽', email: 'pigeon@example.com', role: '编辑', banned: false },
  { id: 3, name: '灰烬', email: 'ash@example.com', role: '成员', banned: false },
  { id: 4, name: '北境旅人', email: 'north@example.com', role: '成员', banned: true }
])

function toggleBan(id) {
  const user = users.value.find((item) => item.id === id)
  if (user) user.banned = !user.banned
}
</script>

<template>
  <AdminShell active="users">
    <h1 class="admin-page-title">用户管理</h1>
    <p class="admin-page-lead">角色权限与封禁均为本地演示数据。</p>

    <div class="admin-table-wrap">
      <table class="admin-table">
        <thead>
          <tr>
            <th>用户</th>
            <th>邮箱</th>
            <th>角色</th>
            <th>状态</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.id">
            <td><strong>{{ user.name }}</strong></td>
            <td>{{ user.email }}</td>
            <td>
              <select v-model="user.role" class="admin-select">
                <option>成员</option>
                <option>编辑</option>
                <option>管理员</option>
              </select>
            </td>
            <td>
              <span class="admin-status" :class="user.banned ? 'status-red' : 'status-ok'">
                {{ user.banned ? '已封禁' : '正常' }}
              </span>
            </td>
            <td class="admin-actions">
              <button type="button" :class="{ 'is-danger': !user.banned }" @click="toggleBan(user.id)">
                {{ user.banned ? '解封' : '封禁' }}
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </AdminShell>
</template>


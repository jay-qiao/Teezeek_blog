<script setup>
import { onMounted, ref } from 'vue'
import { ShieldAlert, Trash2, UserPlus } from 'lucide-vue-next'
import { isConnected, repoApi } from '../admin/github.js'

const users = ref([])
const connected = ref(false)
const busy = ref(false)
const error = ref('')
const notice = ref('')
const newUsername = ref('')
const newPermission = ref('push')
const owner = ref('jay-qiao')

const permissionLabels = {
  pull: '读取',
  triage: '分类',
  push: '写入',
  maintain: '维护',
  admin: '管理员'
}

async function load() {
  if (!isConnected()) return
  connected.value = true
  busy.value = true
  error.value = ''
  try {
    const collaborators = await repoApi('/collaborators?per_page=100')
    users.value = collaborators.map((user) => ({
      ...user,
      permission: permissionFor(user)
    }))
  } catch (err) {
    error.value = err.message
  } finally {
    busy.value = false
  }
}

async function addUser() {
  const username = newUsername.value.trim()
  if (!username) {
    error.value = '请输入 GitHub 用户名'
    return
  }
  busy.value = true
  error.value = ''
  try {
    const added = await repoApi(`/collaborators/${encodeURIComponent(username)}`, {
      method: 'PUT',
      body: { permission: newPermission.value }
    })
    newUsername.value = ''
    notice.value = `已添加 ${username}（${permissionLabels[newPermission.value]}）`
    await load()
  } catch (err) {
    error.value = err.message
  } finally {
    busy.value = false
  }
}

async function changeRole(user) {
  busy.value = true
  error.value = ''
  try {
    await repoApi(`/collaborators/${encodeURIComponent(user.login)}`, {
      method: 'PUT',
      body: { permission: user.permission }
    })
    notice.value = `已更新 ${user.login} 的权限`
  } catch (err) {
    error.value = err.message
    await load()
  } finally {
    busy.value = false
  }
}

async function removeUser(user) {
  if (user.login === owner.value) {
    error.value = '仓库所有者不能移除'
    return
  }
  if (!window.confirm(`确认移除协作者 ${user.login}？`)) return
  busy.value = true
  error.value = ''
  try {
    await repoApi(`/collaborators/${encodeURIComponent(user.login)}`, { method: 'DELETE' })
    notice.value = `已移除 ${user.login}`
    await load()
  } catch (err) {
    error.value = err.message
  } finally {
    busy.value = false
  }
}

function permissionFor(user) {
  if (user.role_name && user.role_name !== 'admin') return user.role_name
  if (user.permissions?.admin) return 'admin'
  if (user.permissions?.maintain) return 'maintain'
  if (user.permissions?.push) return 'push'
  if (user.permissions?.triage) return 'triage'
  return 'pull'
}

onMounted(load)
</script>

<template>
  <AdminShell active="users">
    <div class="admin-page-head">
      <div>
        <h1 class="admin-page-title">协作者管理</h1>
        <p class="admin-page-lead">通过 GitHub 协作者 API 管理仓库访问权限。</p>
      </div>
    </div>

    <p v-if="error" class="admin-login-error">{{ error }}</p>
    <p v-if="notice" class="admin-save-tip">{{ notice }}</p>
    <div v-if="!connected" class="admin-login-empty">
      请先连接 GitHub Token，再管理协作者。
    </div>

    <form v-if="connected" class="admin-inline-form" @submit.prevent="addUser">
      <input v-model="newUsername" type="text" placeholder="GitHub 用户名" />
      <select v-model="newPermission" class="admin-select">
        <option value="pull">读取</option>
        <option value="triage">分类</option>
        <option value="push">写入</option>
        <option value="maintain">维护</option>
        <option value="admin">管理员</option>
      </select>
      <button class="btn btn-ghost" type="submit" :disabled="busy">
        <UserPlus :size="14" /> 邀请协作者
      </button>
    </form>

    <p v-if="connected" class="admin-users-note">
      <ShieldAlert :size="14" /> 仓库所有者始终拥有最高权限，列表中不可移除。
    </p>

    <div v-if="connected" class="admin-table-wrap">
      <table class="admin-table">
        <thead>
          <tr>
            <th>用户</th>
            <th>角色</th>
            <th>权限</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.login">
            <td><strong>{{ user.login }}</strong></td>
            <td>{{ user.role_name || 'member' }}</td>
            <td>
              <select v-model="user.permission" class="admin-select" @change="changeRole(user)">
                <option v-for="(label, value) in permissionLabels" :key="value" :value="value">{{ label }}</option>
              </select>
            </td>
            <td class="admin-actions">
              <button type="button" class="is-danger" title="移除" @click="removeUser(user)">
                <Trash2 :size="15" /> 移除
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </AdminShell>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { Check, Clipboard, ExternalLink, Upload } from 'lucide-vue-next'
import { isConnected } from '../admin/github.js'
import { imageUrls, makeSafeName, uploadImage } from '../admin/images.js'

const connected = ref(false)
const busy = ref(false)
const error = ref('')
const notice = ref('')
const preview = ref('')
const uploadPath = ref('')
const result = ref(null)
const copied = ref(false)

async function onFile(event) {
  const file = event.target.files && event.target.files[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = async () => {
    const base64 = String(reader.result).split(',')[1] || ''
    const name = makeSafeName(file.name)
    const now = new Date()
    const folder = `blog/${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, '0')}`
    const path = `${folder}/${name}`
    busy.value = true
    error.value = ''
    try {
      await uploadImage(base64, path)
      const urls = imageUrls(path)
      result.value = {
        path,
        ...urls,
        markdown: `![${file.name.replace(/\.[^.]+$/, '')}](${urls.jsdelivr})`
      }
      uploadPath.value = path
      preview.value = urls.jsdelivr
      notice.value = '上传成功'
    } catch (err) {
      error.value = err.message
      result.value = null
      preview.value = ''
    } finally {
      busy.value = false
      event.target.value = ''
    }
  }
  reader.readAsDataURL(file)
}

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text)
    copied.value = true
    window.setTimeout(() => {
      copied.value = false
    }, 1600)
  } catch {
    error.value = '复制失败，请手动选择复制'
  }
}

onMounted(() => {
  connected.value = isConnected()
})
</script>

<template>
  <AdminShell active="images">
    <div class="admin-page-head">
      <div>
        <h1 class="admin-page-title">图片上传</h1>
        <p class="admin-page-lead">把图片上传到 Teezeek_blog_images 图床仓库，自动生成 Markdown 链接。</p>
      </div>
    </div>

    <p v-if="error" class="admin-login-error">{{ error }}</p>
    <p v-if="notice" class="admin-save-tip">{{ notice }}</p>
    <div v-if="!connected" class="admin-login-empty">
      请先连接 GitHub Token，再上传图片。
    </div>

    <section v-if="connected" class="admin-panel">
      <h2>选择图片</h2>
      <label class="image-drop">
        <Upload :size="20" />
        <span>{{ busy ? '上传中...' : '点击选择图片文件' }}</span>
        <input type="file" accept="image/*" :disabled="busy" @change="onFile" />
      </label>
      <p class="admin-page-lead">支持 png / jpg / gif / webp / svg 等格式，上传后自动按日期归档。</p>
    </section>

    <section v-if="result" class="admin-panel">
      <h2>上传成功</h2>
      <img class="image-preview" :src="preview" alt="上传预览" />
      <label>仓库路径</label>
      <div class="image-url-row">
        <code>{{ uploadPath }}</code>
        <button class="btn btn-ghost" type="button" @click="copyText(uploadPath)"><Clipboard :size="14" /> 复制</button>
      </div>
      <label>Markdown 链接（文章用）</label>
      <div class="image-url-row">
        <code>{{ result.markdown }}</code>
        <button class="btn btn-gold" type="button" @click="copyText(result.markdown)"><Check :size="14" /> 复制</button>
      </div>
      <p v-if="copied" class="admin-save-tip">已复制到剪贴板</p>
      <label>CDN 直链</label>
      <div class="image-url-row">
        <code>{{ result.jsdelivr }}</code>
        <button class="btn btn-ghost" type="button" @click="copyText(result.jsdelivr)"><Clipboard :size="14" /> 复制</button>
      </div>
      <a class="social-link" :href="result.raw" target="_blank" rel="noopener">
        <ExternalLink :size="15" /> 打开原图
      </a>
    </section>
  </AdminShell>
</template>

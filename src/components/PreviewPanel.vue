<script setup lang="ts">
import { ref } from 'vue'

interface Props {
  pageCount: number
}

withDefaults(defineProps<Props>(), {
  pageCount: 0,
})

const scrollEl = ref<HTMLElement | null>(null)
const containerEl = ref<HTMLElement | null>(null)

defineExpose({ scrollEl, containerEl })
</script>

<template>
  <div class="preview-panel">
    <div class="preview-topbar">
      <span class="preview-label">CV Preview</span>
      <div class="preview-topbar-right">
        <span class="page-count" v-if="pageCount > 1">{{ pageCount }} pages</span>
        <span class="live-dot">Live preview</span>
      </div>
    </div>
    <div class="preview-scroll" ref="scrollEl" id="cv-print-area">
      <div class="preview-scale-wrap" ref="containerEl"></div>
    </div>
  </div>
</template>

<!-- <style>
@import "../styles/preview.css";
</style> -->
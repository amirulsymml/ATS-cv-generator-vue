<script setup lang="ts">
interface Props {
  pageCount: number
}

withDefaults(defineProps<Props>(), {
  pageCount: 0
})

defineExpose({
  scrollEl: null as HTMLElement | null,
  containerEl: null as HTMLElement | null
})
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
    <div class="preview-scroll">
      <div class="preview-scale-wrap"></div>
    </div>
  </div>
</template>

<style scoped>
@import '../styles/preview.css';
</style>

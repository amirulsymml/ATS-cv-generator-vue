<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useCVForm } from './composables/useCVForm'
import Sidebar from './components/Sidebar.vue'
import PreviewPanel from './components/PreviewPanel.vue'

const {
  form,
  pageCount,
  addJob,
  removeJob,
  addBullet,
  removeBullet,
  addEdu,
  removeEdu,
  addSkill,
  removeSkill,
  addCert,
  removeCert,
  addRef,
  removeRef,
  printPDF,
  downloadDOCX,
  clearAll,
  previewScroll,
  previewContainer
} = useCVForm()

const previewPanelRef = ref<InstanceType<typeof PreviewPanel> | null>(null)

onMounted(() => {
  if (previewPanelRef.value) {
    previewScroll.value = previewPanelRef.value.scrollEl
    previewContainer.value = previewPanelRef.value.containerEl
  }
})
</script>

<template>
  <div class="app">
    <Sidebar
      :form="form"
      @add-job="addJob"
      @remove-job="removeJob"
      @add-bullet="addBullet"
      @remove-bullet="removeBullet"
      @add-edu="addEdu"
      @remove-edu="removeEdu"
      @add-skill="addSkill"
      @remove-skill="removeSkill"
      @add-cert="addCert"
      @remove-cert="removeCert"
      @add-ref="addRef"
      @remove-ref="removeRef"
      @print-p-d-f="printPDF"
      @download-d-o-c-x="downloadDOCX"
      @clear-all="clearAll"
    />
    <PreviewPanel ref="previewPanelRef" :page-count="pageCount" />
  </div>
</template>
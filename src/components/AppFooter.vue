<template>
  <footer class="footer">
    <span class="text">更新时间</span>
    <span class="text">{{ uptime }}</span>
    <span class="text">数据维护</span>
    <span class="text">{{ author }}</span>
  </footer>
</template>

<script lang="ts">
import { defineComponent } from "vue"

export default defineComponent({
  name: 'AppFooter',
  props: {
    uptime: {
      type: String,
      default: '',
    },
    author: {
      type: String,
      default: '',
    },
  }
})
</script>

<style>
.footer {
  position: fixed;
  bottom: 0;
  left: 0;
  padding: 0 0 10px 10px;
}
.footer .text {
  margin-right: 6px;
  font-size: 14px;
}
.footer .text:last-child {
  margin-right: 0;
}
</style>

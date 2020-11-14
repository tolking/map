<template>
  <footer class="footer">
    <span class="font-12">更新时间</span>
    <span class="font-12 uptime">{{ uptime }}</span>
    <span class="font-12">数据维护</span>
    <span class="font-12 author">{{ author }}</span>
  </footer>
</template>

<script>
export default {
  name: 'AppFooter',
  props: {
    uptime: String,
    author: String,
  }
}
</script>

<style>
.footer {
  position: fixed;
  bottom: 0;
  left: 0;
}
</style>

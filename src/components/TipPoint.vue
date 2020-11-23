<template>
  <teleport to="body">
    <transition name="zoom">
      <div v-if="message" :style="style" class="tip-point">{{ message }}</div>
    </transition>
  </teleport>
</template>

<script lang="ts">
export default {
  name: 'TipPoint',
  props: {
    message: String,
    style: Object,
  }
}
</script>

<style>
.tip-point {
  position: fixed;
  padding: 10px 20px;
  border-radius: 0 20px 20px 20px;
  background: rgba(0, 0, 0, .5);
  color: #fefefe;
  transform-origin: top left;
}
</style>
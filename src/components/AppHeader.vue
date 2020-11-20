<template>
  <header class="header">
    <h1 class="title">{{ title }}</h1>
    <div class="fun-content">
      <slot />
    </div>
  </header>
</template>

<script lang="ts">
export default {
  name: 'AppHeader',
  props: {
    title: String,
  }
}
</script>

<style>
.header .title {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 10;
  margin-left: 20px;
  font-size: 26px;
}
.header .fun-content {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 11;
  padding: 10px;
}
@media screen and (max-width:500px) {
  .header .title {
    font-size: 18px;
  }
}
</style>

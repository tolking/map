<template>
  <app-header />
  <app-svg />
  <app-footer />
</template>

<script lang="ts">
import AppHeader from './components/AppHeader.vue'
import AppSvg from './components/AppSvg.vue'
import AppFooter from './components/AppFooter.vue'

export default {
  name: 'App',
  components: {
    AppHeader,
    AppSvg,
    AppFooter
  },
}
</script>

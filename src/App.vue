<template>
  <app-header :title="mapData.title">
    <select-source v-model="type" />
  </app-header>
  <app-svg :data="mapData" />
  <app-footer :uptime="mapData.uptime" :author="mapData.author" />
</template>

<script lang="ts">
import { computed, ref, watch } from 'vue'
import { get } from './utils/index.ts'
import { MapData } from './types/index.d.ts'
import AppHeader from './components/AppHeader.vue'
import AppSvg from './components/AppSvg.vue'
import AppFooter from './components/AppFooter.vue'
import SelectSource from './components/SelectSource.vue'

export default {
  name: 'App',
  components: {
    AppHeader,
    AppSvg,
    AppFooter,
    SelectSource,
  },
  setup () {
    const type = ref('')
    const path = computed(() => `/config/${type.value}.json`)
    let mapData = ref({})

    watch(type, async () => {
      mapData.value = await get<MapData>(path.value)
    })

    return {
      type,
      mapData,
    }
  }
}
</script>

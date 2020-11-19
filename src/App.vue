<template>
  <app-header :title="mapData.title">
    <serach-box :nameList="nameList" />
    <select-source v-model="type" />
    <!-- TODO: 增加搜索、配置、下载组件 -->
  </app-header>
  <app-svg :data="mapData" :loading="loading" :style="style" @nameList="setNameList" />
  <config-color v-model="color" />
  <app-footer :uptime="mapData.uptime" :author="mapData.author" />
  <!-- TODO: 增加加载、提示组件 -->
</template>

<script lang="ts">
import { computed, ref, watch } from 'vue'
import { useColorList, useControl, useMapList } from './composables/index.ts'
import { get } from './utils/index.ts'
import { MapData, MapNameItem } from './types/index.d.ts'
import AppHeader from './components/AppHeader.vue'
import AppSvg from './components/AppSvg.vue'
import AppFooter from './components/AppFooter.vue'
import SerachBox from './components/SerachBox.vue'
import SelectSource from './components/SelectSource.vue'
import ConfigColor from './components/ConfigColor.vue'

export default {
  name: 'App',
  components: {
    AppHeader,
    AppSvg,
    AppFooter,
    SerachBox,
    SelectSource,
    ConfigColor,
  },
  setup () {
    const color = useColorList()
    const type = useMapList()
    const path = computed(() => `/config/${type.value}.json`)
    const loading = ref(true)
    const mapData = ref<MapData>({})
    const nameList = ref<MapNameItem[]>([])
    const { x, y, s, leastWidth, transform } = useControl()
    const style = computed(() => ({
      ...color.value,
      '--size-stroke': mapData.value.radius / leastWidth.value / s.value,
      transform: transform.value,
    }))

    getMapData()
    watch(type, getMapData)

    async function getMapData() {
      loading.value = true
      x.value = 0
      y.value = 0
      s.value = 1
      transform.value = ''
      mapData.value = await get<MapData>(path.value)
    }

    function setNameList(value: MapNameItem[]) {
      loading.value = false
      nameList.value = value
    }

    return {
      type,
      color,
      loading,
      mapData,
      nameList,
      setNameList,
      style,
    }
  }
}
</script>

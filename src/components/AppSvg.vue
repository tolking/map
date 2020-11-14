<template>
  <svg :viewBox="viewBox" class="svg" xmlns="http://www.w3.org/2000/svg">
    <g>
      <rect v-if="borderstyle === 'square'" :width="radius * 2" :height="radius * 2" class="frame" />
      <circle v-else-if="borderstyle === 'circles'" :cx="radius" :cy="radius" :r="radius" class="frame" />
      <path v-else-if="borderstyle" :d="borderstyle" class="frame" />
    </g>
    <g>
      <path d='M100 100 L1000 100 L1000 1000 z' style='stroke:#f00;stroke-width: 10'></path>
    </g>
    <g>
      <text x="300" y="235" fill="red">test</text>
    </g>
  </svg>
</template>

<script lang="ts">
import { computed, toRefs } from 'vue';
import { MapData } from './../types/index.d.ts'

export default {
  name: 'AppSvg',
  props: {
    data: Object
  },
  setup(props) {
    const { data } = toRefs<{ data: MapData }>(props)
    console.log(data.value);
    const borderstyle = computed(() => {
      const style = data.value.borderstyle || false

      if (Array.isArray(style)) {
        // TODO: 组装path路径
      } else {
        return style
      }
    })
    const radius = computed(() => data.value.radius || 0)
    const viewBox = computed(() => `0 0 ${radius.value * 2} ${radius.value * 2}`)
    
    return {
      borderstyle,
      radius,
      viewBox,
    }
  }
}
</script>

<style>
.svg {
  width: 100%;
  height: 100%;
}
.svg .frame {
  fill: transparent;
  stroke-width: 4;
  stroke: #000;
  stroke-dasharray: 20, 20;
}
</style>
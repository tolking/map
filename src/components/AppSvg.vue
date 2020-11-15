<template>
  <svg :viewBox="viewBox" class="svg" xmlns="http://www.w3.org/2000/svg">
    <g>
      <rect
        v-if="borderstyle === 'square'"
        :width="radius * 2"
        :height="radius * 2"
        class="path frame"
      />
      <circle
        v-else-if="borderstyle === 'circles'"
        :cx="radius"
        :cy="radius"
        :r="radius"
        class="path frame"
      />
      <path
        v-else-if="Array.isArray(borderstyle)"
        :d="setPath(borderstyle)"
        class="path frame"
      />
    </g>
    <g>
      <path
        v-for="(item, index) in dataList"
        :key="index"
        :d="setPath(item.points)"
        :class="item.type"
        class="path"
      />
    </g>
    <g>
      <text
        v-for="item in nameList"
        :key="item.name"
        :x="item.point.x + radius"
        :y="item.point.z + radius"
        class="text"
      >
        {{ item.name }}
      </text>
    </g>
  </svg>
</template>

<script lang="ts">
import { computed, toRaw, toRefs, watch } from 'vue';
import { MapData } from './../types/index.d.ts'

export default {
  name: 'AppSvg',
  props: {
    data: Object
  },
  setup(props, { emit }) {
    const { data } = toRefs<{ data: MapData }>(props)
    const borderstyle = computed(() => data.value.borderstyle || false)
    const radius = computed(() => data.value.radius || 0)
    const viewBox = computed(() => `0 0 ${radius.value * 2} ${radius.value * 2}`)
    const dataList = computed(() => data.value.data || [])
    const nameList = computed(() => {
      const list = toRaw(dataList.value)
      let nameList = []

      for (let i = 0; i < list.length; i++) {
        const item = list[i];

        if (item.name) {
          nameList.push({
            name: item.name,
            point: item.points[item.points.length - 1]
          })
        }
        if (item.namelist) {
          nameList = nameList.concat(item.namelist) 
        }
      }
      return nameList
    })

    watch(nameList, () => {
      emit('nameList', nameList.value)
    })

    function setPath(points) {
      const list = toRaw(points)
      let path = ''

      for (let i = 0; i < list.length; i++) {
        const item = list[i];
        const x = item.x + radius.value
        const z = item.z + radius.value

        if (i === 0) {
          path += `M${x} ${z} `
        } else if (item.type) {
          const before = points[i - 1]
          const bx = before.x + radius.value
          const bz = before.z + radius.value
          const ex = (item.ex || 0) + radius.value
          const ez = (item.ez || 0) + radius.value

          if (item.type === 'n-w') {
            path += `Q${x > bx ? bx : x} ${z > bz ? bz: z} ${x} ${z} `
          } else if (item.type === 'n-e') {
            path += `Q${x > bx ? x : bx} ${z > bz ? bz: z} ${x} ${z} `
          } else if (item.type === 's-w') {
            path += `Q${x > bx ? bx : x} ${z > bz ? z: bz} ${x} ${z} `
          } else if (item.type === 's-e') {
            path += `Q${x > bx ? x : bx} ${z > bz ? z: bz} ${x} ${z} `
          } else {
            path += `Q${ex} ${ez} ${x} ${z} `
          }
        } else {
          path += `L${x} ${z} `
        }
      }
      return path
    }
    
    return {
      borderstyle,
      radius,
      viewBox,
      dataList,
      nameList,
      setPath,
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
  stroke-dasharray: 20, 20;
}
.svg .path {
  fill: transparent;
  stroke-width: 4;
  stroke: #333;
}
.svg .text {
  stroke-width: 0;
  text-anchor: middle;
  dominant-baseline: middle;
}
</style>
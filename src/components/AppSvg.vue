<template>
  <section id="app-svg">
    <transition name="mode-fade" mode="out-in">
      <div v-if="loading" key="true" class="loading">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
          <path d="M16 0 A16 16 0 0 0 16 32 A16 16 0 0 0 16 0 M16 4 A12 12 0 0 1 16 28 A12 12 0 0 1 16 4" opacity=".25"/>
          <path d="M16 0 A16 16 0 0 1 32 16 L28 16 A12 12 0 0 0 16 4z">
            <animateTransform attributeName="transform" type="rotate" from="0 16 16" to="360 16 16" dur="0.8s" repeatCount="indefinite" />
          </path>
        </svg>
      </div>
      <svg v-else key="flase" :style="style" :viewBox="viewBox" class="svg" xmlns="http://www.w3.org/2000/svg">
        <g>
          <rect
            v-if="borderstyle === 'square'"
            :width="radius * 2"
            :height="radius * 2"
            class="path border"
          />
          <circle
            v-else-if="borderstyle === 'circles'"
            :cx="radius"
            :cy="radius"
            :r="radius"
            class="path border"
          />
          <path
            v-else-if="Array.isArray(borderstyle)"
            :d="setPath(borderstyle)"
            class="path border"
          />
        </g>
        <g>
          <template v-for="item in dataList">
            <circle
              v-if="item.type === 'green'"
              :cx="item.points[0].x + radius - center.x"
              :cy="item.points[0].z + radius - center.z"
              :class="item.type"
              class="path"
              @mouseenter="e => inPath(e, item.notes)"
              @mouseout="outPath"
            />
            <path
              v-else
              :d="setPath(item.points)"
              :class="item.type"
              class="path"
              @mouseenter="e => inPath(e, item.notes)"
              @mouseout="outPath"
            />
          </template>
        </g>
        <g>
          <text
            v-for="(item, index) in nameList"
            :key="index"
            :x="item.point.x + radius - center.x"
            :y="item.point.z + radius - center.z"
            class="text"
          >
            {{ item.name }}
          </text>
        </g>
      </svg>
    </transition>
  </section>
</template>

<script lang="ts">
import { computed, ref, toRaw, toRefs, watch } from 'vue';
import { MapData, MapNameItem, MapPoint } from './../types/index.d.ts'

export default {
  name: 'AppSvg',
  props: {
    data: Object,
    loading: Boolean,
    style: Object,
  },
  setup(
    props: { data: MapData, loading: boolean, style: object },
    { emit }: { emit: (event: string, ...args: unknown[]) => void}
  ) {
    const { data, loading, style } = toRefs(props)
    const pathNotes = ref('')
    const pathClient = ref({})
    const borderstyle = computed(() => data.value.borderstyle || false)
    const radius = computed(() => data.value.radius || 0)
    const center = computed(() => data.value.center || { x: 0, z: 0 })
    const viewBox = computed(() => `0 0 ${radius.value * 2} ${radius.value * 2}`)
    const dataList = computed(() => data.value.data || [])
    const nameList = computed(() => {
      const list = toRaw(dataList.value)
      let nameList: MapNameItem[] = []

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
    watch(pathClient, () => {
      emit('overPath', { style: pathClient.value, message: pathNotes.value })
    })

    function setPath(points: MapPoint[]) {
      const list = toRaw(points)
      let path = ''

      for (let i = 0; i < list.length; i++) {
        const item = list[i];
        const x = item.x + radius.value - center.value.x
        const z = item.z + radius.value - center.value.z

        if (i === 0) {
          path += `M${x} ${z} `
        } else if (item.type) {
          const before = points[i - 1]
          const bx = before.x + radius.value - center.value.x
          const bz = before.z + radius.value - center.value.z
          const ex = (item.ex || 0) + radius.value - center.value.x
          const ez = (item.ez || 0) + radius.value - center.value.z

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

    function inPath({ clientX, clientY }: WheelEvent,notes: string) {
      if (notes) {
        pathNotes.value = notes
        pathClient.value = {
          left: clientX + 'px',
          top: clientY + 'px',
        }
      }
    }

    function outPath() {
      pathNotes.value && setTimeout(() => {
        pathNotes.value = ''
        pathClient.value = {}
      }, 300)
    }

    return {
      loading,
      style,
      borderstyle,
      radius,
      center,
      viewBox,
      dataList,
      nameList,
      setPath,
      inPath,
      outPath,
    }
  }
}
</script>

<style>
#app-svg {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  overflow: hidden;
  cursor: move;
}
.svg {
  width: 90%;
  height: 90%;
  overflow: visible;
  background: var(--color-bg);
  transform-origin: center center;
}
.svg .path {
  fill: transparent;
  stroke-width: max(calc(var(--size-stroke) * 3), 1);
  stroke-linecap: round;
}
.svg .path.border {
  stroke: var(--color-frame, #AAAAAA);
  stroke-dasharray: calc(var(--size-stroke) * 20), calc(var(--size-stroke) * 20);
}
.svg .path.ice {
  stroke: var(--color-ice, #7FDBFF);
  stroke-width: max(calc(var(--size-stroke) * 3), 1.5);
}
.svg .path.rail {
  stroke: var(--color-rail, #FFDC00);
}
.svg .path.walk {
  stroke: var(--color-walk, #85144b);
}
.svg .path.green {
  fill: var(--color-green, #2ECC40);
  r: max(calc(var(--size-stroke) * 3), 1.5);
}
.svg .path.frame {
  stroke: var(--color-frame, #AAAAAA);
}
.svg .text {
  fill: var(--color-text);
  font-size: max(calc(var(--size-stroke) * 28px), 16px);
  stroke-width: 0;
  text-anchor: middle;
  dominant-baseline: middle;
}

.mode-fade-enter-active, .mode-fade-leave-active {
  transition: opacity .3s ease-out;
}
.mode-fade-enter-from, .mode-fade-leave-to {
  opacity: 0;
}
</style>
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
            :d="parsePath(borderstyle)"
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
              @mouseenter="e => enterPath(e, item.notes)"
              @mouseout="outPath"
            />
            <path
              v-else
              :d="parsePath(item.points)"
              :class="item.type"
              class="path"
              @mouseenter="e => enterPath(e, item.notes)"
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
import { defineComponent, Ref, toRefs, watch } from 'vue'
import { useParseMapData, useOverPath } from './../composables/index'
import { MapData } from './../types/index'

export default defineComponent({
  name: 'AppSvg',
  props: {
    data: {
      type: Object,
      required: true,
    },
    loading: Boolean,
    style: Object,
  },
  emits: ['nameList', 'overPath'],
  setup(props, { emit }) {
    const { data, loading, style } = toRefs(props)
    const {
      borderstyle,
      radius,
      center,
      viewBox,
      dataList,
      nameList,
      parsePath,
    } = useParseMapData(data as Ref<MapData>)
    const { notes, client, enterPath, outPath } = useOverPath()

    watch(nameList, () => {
      emit('nameList', nameList.value)
    })
    watch(client, () => {
      emit('overPath', { style: client.value, message: notes.value })
    })

    return {
      loading,
      style,
      borderstyle,
      radius,
      center,
      viewBox,
      dataList,
      nameList,
      parsePath,
      enterPath,
      outPath,
    }
  }
})
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
  stroke-width: max(calc(var(--size-stroke) * 2), 2);
  stroke-linecap: round;
}
.svg .path.border {
  stroke: var(--color-frame, #AAAAAA);
  stroke-dasharray: max(calc(var(--size-stroke) * 12), 12), max(calc(var(--size-stroke) * 12), 12);
}
.svg .path.ice {
  stroke: var(--color-ice, #7FDBFF);
  stroke-width: max(calc(var(--size-stroke) * 3), 3);
}
.svg .path.rail {
  stroke: var(--color-rail, #FFDC00);
}
.svg .path.walk {
  stroke: var(--color-walk, #85144b);
}
.svg .path.green {
  fill: var(--color-green, #2ECC40);
  r: max(calc(var(--size-stroke) * 4), 4);
}
.svg .path.frame {
  stroke: var(--color-frame, #AAAAAA);
}
.svg .text {
  fill: var(--color-text);
  font-size: max(calc(var(--size-stroke) * 16px), 12px);
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
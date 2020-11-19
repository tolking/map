<template>
  <div class="icon-button" @click="toggle">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1026 1024">
      <path d="M513.28 0C380.16 0 252.16 51.2 149.76 148.48-49.92 348.16-49.92 675.84 149.76 875.52c102.4 102.4 230.4 148.48 363.52 148.48 133.12 0 261.12-51.2 363.52-148.48C1076.48 675.84 1076.48 353.28 876.8 153.6c-102.4-102.4-235.52-153.6-363.52-153.6m0 51.2c61.44 0 117.76 10.24 174.08 35.84 56.32 25.6 107.52 56.32 153.6 102.4 46.08 46.08 76.8 97.28 102.4 153.6 20.48 51.2 30.72 107.52 30.72 168.96s-10.24 117.76-35.84 174.08c-25.6 56.32-56.32 107.52-102.4 153.6-46.08 46.08-97.28 76.8-153.6 102.4-51.2 20.48-107.52 30.72-168.96 30.72-61.44 0-117.76-10.24-174.08-35.84-56.32-25.6-107.52-56.32-153.6-102.4-46.08-46.08-76.8-97.28-102.4-153.6-20.48-51.2-30.72-107.52-30.72-168.96 0-61.44 10.24-117.76 35.84-174.08 25.6-56.32 56.32-107.52 102.4-153.6 46.08-46.08 97.28-76.8 153.6-102.4 51.2-20.48 107.52-30.72 168.96-30.72"/>
      <path d="M666.88 634.88l97.28 97.28c10.24 10.24 10.24 25.6 0 35.84-10.24 10.24-25.6 10.24-35.84 0l-97.28-97.28c-40.96 30.72-87.04 46.08-143.36 46.08C359.68 716.8 257.28 614.4 257.28 486.4S359.68 256 487.68 256 718.08 358.4 718.08 486.4c0 56.32-20.48 107.52-51.2 148.48z m-179.2 30.72c97.28 0 179.2-81.92 179.2-179.2S584.96 307.2 487.68 307.2 308.48 389.12 308.48 486.4 390.4 665.6 487.68 665.6z"/>
    </svg>
  </div>
  <teleport to="body">
    <section v-if="show" class="mask" @click="toggle">
      <div class="content" @click.stop>
        <div class="serach-inpit">
          <input v-model="serach" type="text">
        </div>
        <div class="serach-list">
          <div
            v-for="(item, index) in serachList"
            :key="index"
            class="list-item"
            @click="move(item.point)"
          >
            <span class="name">{{ item.name }}</span>
            <span class="point">
              {{ `x: ${item.point.x}, y: ${item.point.y}, z: ${item.point.z}` }}
            </span>
          </div>
        </div>
      </div>
    </section>
  </teleport>
</template>

<script lang="ts">
import { ref, watch } from 'vue'
import { MapNameItem, MapPoint } from './types/index.d.ts'

export default {
  name: 'SerachBox',
  props: {
    nameList: Array,
  },
  setup(props) {
    const serachList = ref<MapNameItem[]>([])
    const serach = ref('')
    const show = ref(false)

    watch(serach, () => {
      serachList.value = props.nameList.filter((item: MapNameItem) => {
        const _serach = serach.value.trim().toLocaleLowerCase()
        return item.name.toLocaleLowerCase().includes(_serach)
      })
    })

    function move(point: MapPoint) {
      //TODO: 将中心移动到点击地点处，返回需要计算出的`x`与`y`
      toggle()
    }

    function toggle() {
      serachList.value = []
      show.value = !show.value
    }

    return {
      serach,
      serachList,
      show,
      toggle,
      move,
    }
  }
}
</script>

<style>
.icon-button {
  display: inline-block;
  width: 30px;
  height: 30px;
  fill: var(--color-text);
}
.mask {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background: rgba(0, 0, 0, .3);
}
.mask .content {
  position: relative;
  z-index: 101;
  margin: auto;
  width: 50%;
  min-width: 300px;
  height: 80%;
  background: var(--color-bg);
}
</style>

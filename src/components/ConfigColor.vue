<template>
  <section class="config-color">
    <div v-for="item in colorList" :key="item.key" class="color-item">
      <input v-model="modelValue[item.key]" type="color">
      <span>{{ item.name }}</span>
    </div>
  </section>
</template>

<script lang="ts">
import { toRefs } from 'vue'
import { colorList } from './../config.ts'
import { Color } from './../composables/index.ts'

export default {
  name: 'ConfigColor',
  props: {
    modelValue: Object,
  },
  setup(props, { emit }) {
    const { modelValue } = toRefs<{ modelValue: Color }>(props)

    return {
      colorList,
      modelValue,
    }
  }
}
</script>

<style>
.config-color {
  position: fixed;
  right: 0;
  bottom: 0;
  z-index: 10;
}
</style>

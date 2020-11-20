<template>
  <section class="config-color">
    <div v-for="item in colorList" :key="item.key" class="color-item">
      <input v-model="modelValue[item.key]" type="color" class="input">
      <span class="text" @click="reset(item)">{{ item.name }}</span>
    </div>
  </section>
</template>

<script lang="ts">
import { toRefs } from 'vue'
import { colorList, ColorItem } from './../config.ts'
import { Color } from './../composables/index.ts'

export default {
  name: 'ConfigColor',
  props: {
    modelValue: Object,
  },
  setup(props: { modelValue: Color }) {
    const { modelValue } = toRefs(props)

    function reset(item: ColorItem) {
      modelValue.value[item.key] = item.value
    }

    return {
      colorList,
      modelValue,
      reset,
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
  padding: 0 20px 20px 0;
}
.config-color .color-item {
  display: flex;
  align-items: center;
}
.config-color .color-item .input {
  width: 40px;
  height: 25px;
  border: 0;
  background-color: transparent;
  cursor: pointer;
}
.config-color .color-item .text {
  margin-left: 6px;
  cursor: pointer;
}
@media screen and (max-width:500px) {
  .config-color {
    padding: 0 10px 10px 0;
  }
  .config-color .color-item .input {
    width: 30px;
    height: 20px;
  }
}
</style>

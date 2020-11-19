<template>
  <select :value="modelValue" class="select-source" @change="selectItem">
    <option
      v-for="item in mapList"
      :key="item.type"
      :value="item.type"
    >
      {{ item.name }}
    </option>
  </select>
</template>

<script lang="ts">
import { toRefs } from 'vue'
import { mapList } from './../config.ts'

export default {
  name: 'SelectSource',
  props: {
    modelValue: String,
  },
  setup(props, { emit }) {
    const { modelValue } = toRefs<{ modelValue: string }>(props)

    function selectItem({ target }: { target: { value: string }}) {
      emit('update:modelValue', target.value)
    }

    return {
      mapList,
      modelValue,
      selectItem,
    }
  }
}
</script>

<style>
.select-source {
  display: inline-block;
}
</style>

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
  setup(
    props: { modelValue: string },
    { emit }: { emit: (event: string, ...args: unknown[]) => void}
  ) {
    const { modelValue } = toRefs(props)

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
  padding: 0 10px;
  width: 120px;
  height: 30px;
  border-radius: 15px;
  border: 2px solid var(--color-text);
  background-color: var(--color-bg);
  color: var(--color-text);
  vertical-align: top;
}
@media screen and (max-width:500px) {
  .select-source {
    width: 30px;
    transition: width .3s ease-out;
  }
  .select-source:focus {
    width: 120px;
  }
}
</style>

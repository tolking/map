<template>
  <select
    :value="modelValue"
    class="select-source"
    @change="selectItem"
  >
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
import { defineComponent, toRefs } from 'vue'
import { mapList } from './../config'

export default defineComponent({
  name: 'SelectSource',
  props: {
    modelValue: String,
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const { modelValue } = toRefs(props)

    function selectItem(event: Event) {
      const target = event.target as { value: string } | null
      emit('update:modelValue', target?.value)
    }

    return {
      mapList,
      modelValue,
      selectItem,
    }
  }
})
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

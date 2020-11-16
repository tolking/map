<template>
  <select :value="modelValue" class="select-source" @change="selectItem">
    <option
      v-for="item in data"
      :key="item.type"
      :value="item.type"
    >
      {{ item.name }}
    </option>
  </select>
</template>

<script>
import { reactive, ref, toRefs } from 'vue'
import { mapList } from './../config.ts'
import { getUrlString } from './../utils/index.ts'

export default {
  name: 'SelectSource',
  props: {
    modelValue: String,
  },
  setup(props, { emit }) {
    const { modelValue } = toRefs(props)
    const data = reactive(mapList)

    if (data.length) {
      const urlType = getUrlString('type')

      emit('update:modelValue', urlType || data[0].type) //TODO: 本地储存参数
    }

    function selectItem(e) {
      emit('update:modelValue', e.target.value)
    }

    return {
      modelValue,
      data,
      selectItem,
    }
  }
}
</script>

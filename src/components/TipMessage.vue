<template>
  <teleport to="body">
    <transition name="mask-zoom">
      <section v-if="introduceInfo" class="mask" @click="close">
        <div class="content" v-html="introduceInfo" />
      </section>
    </transition>
  </teleport>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useParseIntroduce } from './../composables/index'

export default defineComponent({
  name: 'TipMessage',
  props: {
    type: {
      type: String,
      required: true,
    },
    version: Number,
    introduce: String,
  },
  setup(props) {
    const introduceInfo = useParseIntroduce(props)

    function close() {
      introduceInfo.value = ''
    }

    return {
      introduceInfo,
      close,
    }
  }
})
</script>

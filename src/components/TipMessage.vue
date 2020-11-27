<template>
  <teleport to="body">
    <transition name="mask-zoom">
      <section v-if="show" class="mask" @click="close">
        <div class="content" v-html="introduce" />
      </section>
    </transition>
  </teleport>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, toRefs, watch } from 'vue'

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
    const { type, version, introduce } = toRefs(props)
    const show = ref(false)
    let mapVersion: { [key: string]: number } | undefined = undefined

    watch([type, version], checkVersion)

    onMounted(() => {
      if (!mapVersion) {
        const localVersion = localStorage.getItem('map-version')
        mapVersion = localVersion ? JSON.parse(localVersion) : {}
      }
      checkVersion()
    })

    function checkVersion() {
      if (version && version.value) {
        const oldVersion = mapVersion![type.value]
        if (!oldVersion || oldVersion < version.value) {
          show.value = true
        }
      }
    }

    function close() {
      show.value = false
      mapVersion![type.value] = version!.value as number
      localStorage.setItem('map-version', JSON.stringify(mapVersion))
    }

    return {
      show,
      introduce,
      close,
    }
  }
})
</script>

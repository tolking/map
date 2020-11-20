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
import { onMounted, ref, toRefs, watch } from 'vue';

export default {
  name: 'SerachBox',
  props: {
    type: String,
    version: Number,
    introduce: String,
  },
  setup(props: { type: string, version: number, introduce: string }) {
    const { type, version, introduce } = toRefs(props)
    const show = ref(false)
    let mapVersion: { [key: string]: number } | undefined = undefined

    watch(type, checkVersion)

    onMounted(() => {
      if (!mapVersion) {
        const localVersion = localStorage.getItem('map-version')
        mapVersion = localVersion ? JSON.parse(localVersion) : {}
      }
      checkVersion()
    })

    function checkVersion() {
      if (!mapVersion![type.value] || mapVersion![type.value] < version.value) {
        show.value = true
        mapVersion![type.value] = version.value
      }
    }

    function close() {
      show.value = false
      localStorage.setItem('map-version', JSON.stringify(mapVersion))
    }

    return {
      show,
      introduce,
      close,
    }
  }
}
</script>

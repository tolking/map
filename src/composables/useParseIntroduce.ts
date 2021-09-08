import { onMounted, ref, toRefs, watch } from 'vue'

type TipMessageProps = Readonly<{
  type: string
  version?: number
  introduce?: string
}>

export function useParseIntroduce(props: TipMessageProps) {
  const { type, version, introduce } = toRefs(props)
  const introduceInfo = ref('')

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
        introduceInfo.value = introduce?.value || ''
        mapVersion![type.value] = version.value
        localStorage.setItem('map-version', JSON.stringify(mapVersion))
      }
    }
  }

  return introduceInfo
}
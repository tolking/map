import { computed, Ref, ref, toRaw, toRefs } from 'vue'
import { MapNameItem } from './../types/index'

export type SerachBoxProps = Readonly<{
  nameList: MapNameItem[]
}>

export function useSerach(props: SerachBoxProps) {
  const { nameList } = toRefs(props)
  const keyword = ref('')
  const list = computed(() => {
    if (keyword.value) {
      const _sourc = toRaw(nameList.value)
      return _sourc.filter((item: MapNameItem) => {
        const _serach = keyword.value.trim().toLocaleLowerCase()
        return item.name.toLocaleLowerCase().includes(_serach)
      })
    } else {
      return []
    }
  })

  return {
    keyword,
    list,
  }
}
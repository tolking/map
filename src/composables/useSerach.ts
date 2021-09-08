import { computed, ref, toRefs } from 'vue'
import { MapNameItem } from './../types/index'

export function useSerach(props: Readonly<{ nameList: MapNameItem[]}>) {
  const { nameList } = toRefs(props)
  const keyword = ref('')
  const list = computed(() => {
    if (keyword.value) {
      return nameList.value.filter((item: MapNameItem) => {
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
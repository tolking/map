import { ref, Ref, watch } from 'vue'
import { get } from './../utils/index'
import { MapData } from './../types/index'

const defaultMap: MapData = {
  title: '',
  radius: 0,
  center: { x: 0, z: 0 },
  data: []
}

export function useLoadMapData(type: Ref<string>) {
  const loading = ref(false)
  const mapData = ref(defaultMap)

  getMapData()

  watch(type, getMapData)

  async function getMapData() {
    loading.value = true
    mapData.value = defaultMap
    mapData.value = await get<MapData>(`/config/${type.value}.json`)
    loading.value = false
  }

  return {
    loading,
    mapData,
  }
}
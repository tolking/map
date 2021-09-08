import { Ref, ref, watch } from 'vue'
import { mapList } from './../config'
import { getUrlString } from './../utils/index'

export function useMapList(): Ref<string> {
  const _default = getPathType() || getLocalType() || getConfigType()
  const type = ref(_default)

  watch(type, setLocalColor)

  function getPathType() {
    return getUrlString('type')
  }

  function getLocalType() {
    const data = localStorage.getItem('map-type')
    return data ? JSON.parse(data) as string : undefined
  }
  
  function getConfigType() {
    return mapList[0].type
  }

  function setLocalColor() {
    localStorage.setItem('map-type', JSON.stringify(type.value))
  }

  return type
}
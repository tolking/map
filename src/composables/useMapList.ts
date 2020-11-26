import { ref, watch } from 'vue'
import { mapList } from './../config'
import { getUrlString } from './../utils/index'

export function useMapList() {
  const _default = getPathType() || getLocalType() || getConfigType()
  const type = ref(_default)

  watch(type, setLocalColor)

  function getPathType() {
    return getUrlString('type')
  }

  function getLocalType(): string {
    return JSON.parse(localStorage.getItem('map-type'))
  }

  function setLocalColor() {
    localStorage.setItem('map-type', JSON.stringify(type.value))
  }

  function getConfigType() {
    return mapList.length && mapList[0].type
  }

  return type
}
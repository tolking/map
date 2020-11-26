import { ref, watch } from 'vue'
import { colorList } from './../config'
import { ConfigColorItem, LocalColor } from './../types/index'

export function useColorList() {
  const _default = getLocalColor() || getConfigColor()
  const color = ref(_default)

  watch(color, setLocalColor, { deep: true })

  function getLocalColor(): LocalColor {
    return JSON.parse(localStorage.getItem('color-list'))
  }

  function setLocalColor() {
    localStorage.setItem('color-list', JSON.stringify(color.value))
  }

  function getConfigColor() {
    const _color: LocalColor = {}
    colorList.forEach(({ key, value }: ConfigColorItem) => {
      _color[key] = value
    })
    return _color
  }

  return color
}

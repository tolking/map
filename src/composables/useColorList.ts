import { ref, watch } from 'vue'
import { colorList, ColorItem } from './../config.ts'

interface Color {
  [key: string]: string
}

export function useColorList() {
  const _default = getLocalColor() || getConfigColor()
  const color = ref(_default)

  watch(color, setLocalColor, { deep: true })

  function getLocalColor(): Color {
    return JSON.parse(localStorage.getItem('color-list'))
  }

  function setLocalColor() {
    localStorage.setItem('color-list', JSON.stringify(color.value))
  }

  function getConfigColor() {
    const _color: Color = {}
    colorList.forEach(({ key, value }: ColorItem) => {
      _color[key] = value
    })
    return _color
  }

  return color
}

import { createEffect } from "solid-js"
import { createStore } from "solid-js/store"
import { colorList } from '../config'
import type { SetStoreFunction } from "solid-js/store"
import type { ConfigColorItem, LocalColor } from '../types/index'

function getLocalColor(): LocalColor {
  const data = localStorage.getItem('color-list')
  return data ? JSON.parse(data) : undefined
}

function getConfigColor() {
  const _color: LocalColor = {}
  colorList.forEach(({ key, value }: ConfigColorItem) => {
    _color[key] = value
  })
  return _color
}

export function useColorList(): [LocalColor, SetStoreFunction<LocalColor>] {
  const _default = getLocalColor() || getConfigColor()
  const [color, setColor] = createStore(_default)
 
  createEffect(() => {
    localStorage.setItem('color-list', JSON.stringify(color))
  })

  return [color, setColor]
}

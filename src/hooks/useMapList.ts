import { createEffect, createSignal } from 'solid-js'
import { mapList } from '../config'
import { getUrlString } from '../utils/index'
import type { Signal } from 'solid-js'

function getLocalType() {
  const data = localStorage.getItem('map-type')
  return data ? JSON.parse(data) as string : undefined
}

export function useMapList(): Signal<string> {
  const _default = getUrlString('type') || getLocalType() || mapList[0].type
  const [type, setType] = createSignal<string>(_default)

  createEffect(() => {
    localStorage.setItem('map-type', JSON.stringify(type()))
  })

  return [type, setType]
}

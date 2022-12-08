import { createResource } from 'solid-js'
import { get } from '../utils/index'
import type { Accessor } from 'solid-js'
import type { MapData } from '../types/index'

const initialValue: MapData = {
  title: '',
  radius: 0,
  center: { x: 0, z: 0 },
  data: [],
}

async function getMapData(type: string) {
  if (!type) return initialValue
  return await get<MapData>(`/config/${type}.json`)
}

export function useLoadMapData(type: Accessor<string>) {
  const [data] = createResource(type, getMapData, { initialValue })
  return data
}

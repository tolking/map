import { createEffect, createMemo, createSignal } from 'solid-js'
import type { MapData, MapNameItem, MapPoint } from '../types/index'

const [nameList, setNameList] = createSignal<MapNameItem[]>([])

export const useNameList = nameList

export function useParseMapData(props: { data: MapData }) {
  const borderstyle = createMemo(() => props.data.borderstyle || false)
  const radius = createMemo(() => props.data.radius || 0)
  const center = createMemo(() => props.data.center || { x: 0, z: 0 })
  const viewBox = createMemo(() => `0 0 ${radius() * 2} ${radius() * 2}`)
  const dataList = createMemo(() => props.data.data || [])

  createEffect(() => {
    let nameList: MapNameItem[] = []
  
    for (let i = 0; i < dataList().length; i++) {
      const item = dataList()[i]
      if (item.name) {
        nameList.push({
          name: item.name,
          point: item.points[item.points.length - 1]
        })
      }
      if (item.namelist) {
        nameList = nameList.concat(item.namelist)
      }
    }
    
    setNameList(nameList)
  })

  function parsePath(points: MapPoint[]) {
    let path = ''

    for (let i = 0; i < points.length; i++) {
      const item = points[i];
      const x = item.x + radius() - center().x
      const z = item.z + radius() - center().z

      if (i === 0) {
        path += `M${x} ${z} `
      } else if (item.type) {
        const before = points[i - 1]
        const bx = before.x + radius() - center().x
        const bz = before.z + radius() - center().z
        const ex = (item.ex || 0) + radius() - center().x
        const ez = (item.ez || 0) + radius() - center().z

        if (item.type === 'n-w') {
          path += `Q${x > bx ? bx : x} ${z > bz ? bz: z} ${x} ${z} `
        } else if (item.type === 'n-e') {
          path += `Q${x > bx ? x : bx} ${z > bz ? bz: z} ${x} ${z} `
        } else if (item.type === 's-w') {
          path += `Q${x > bx ? bx : x} ${z > bz ? z: bz} ${x} ${z} `
        } else if (item.type === 's-e') {
          path += `Q${x > bx ? x : bx} ${z > bz ? z: bz} ${x} ${z} `
        } else {
          path += `Q${ex} ${ez} ${x} ${z} `
        }
      } else {
        path += `L${x} ${z} `
      }
    }
    return path
  }

  return {
    borderstyle,
    radius,
    center,
    viewBox,
    dataList,
    nameList,
    parsePath,
  }
}

import { createEffect, createMemo, createSignal } from 'solid-js'
import { calc } from '../utils/index'
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

  function getCoordinate(point: MapPoint) {
    return calc`${point} + ${radius()} - ${center()}`
  }

  function parsePath(points: MapPoint[]) {
    let path = ''

    for (let i = 0; i < points.length; i++) {
      const item = points[i]
      const { x, y } = getCoordinate(item)

      if (i === 0) {
        path += `M${x} ${y} `
      } else if (item.type) {
        const { x: bx, y: by } = getCoordinate(points[i - 1])
        const { x: ex, y: ey } = getCoordinate({
          x: item.ex || 0,
          z: item.ez || 0,
        })

        if (item.type === 'n-w') {
          path += `Q${x > bx ? bx : x} ${y > by ? by: y} ${x} ${y} `
        } else if (item.type === 'n-e') {
          path += `Q${x > bx ? x : bx} ${y > by ? by: y} ${x} ${y} `
        } else if (item.type === 's-w') {
          path += `Q${x > bx ? bx : x} ${y > by ? y: by} ${x} ${y} `
        } else if (item.type === 's-e') {
          path += `Q${x > bx ? x : bx} ${y > by ? y: by} ${x} ${y} `
        } else {
          path += `Q${ex} ${ey} ${x} ${y} `
        }
      } else {
        path += `L${x} ${y} `
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
    getCoordinate,
  }
}

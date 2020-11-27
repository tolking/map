import { computed, Ref, toRaw } from 'vue'
import { MapData, MapNameItem, MapPoint } from './../types/index'

export function useParseMapData(data: Ref<MapData>) {
  const borderstyle = computed(() => data.value.borderstyle || false)
  const radius = computed(() => data.value.radius || 0)
  const center = computed(() => data.value.center || { x: 0, z: 0 })
  const viewBox = computed(() => `0 0 ${radius.value * 2} ${radius.value * 2}`)
  const dataList = computed(() => data.value.data || [])
  const nameList = computed(() => {
    const list = toRaw(dataList.value)
    let nameList: MapNameItem[] = []

    for (let i = 0; i < list.length; i++) {
      const item = list[i]
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
    return nameList
  })

  function parsePath(points: MapPoint[]) {
    const list = toRaw(points)
    let path = ''

    for (let i = 0; i < list.length; i++) {
      const item = list[i];
      const x = item.x + radius.value - center.value.x
      const z = item.z + radius.value - center.value.z

      if (i === 0) {
        path += `M${x} ${z} `
      } else if (item.type) {
        const before = points[i - 1]
        const bx = before.x + radius.value - center.value.x
        const bz = before.z + radius.value - center.value.z
        const ex = (item.ex || 0) + radius.value - center.value.x
        const ez = (item.ez || 0) + radius.value - center.value.z

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
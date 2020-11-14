export interface MapData {
  title: string
  author: string
  version: number
  uptime: string
  introduce: string
  center: Pick<MapPoint, 'x' | 'z'>
  radius: number
  borderstyle: MapBorderstyle
  data: MapDataItem[]
}

export type MapBorderstyle = 'circles' | 'square' | '' | false | MapPoint[]

export interface MapPoint {
  x: number
  y: number
  z: number
  type?: 'r' | 'n-w' | 'n-e' | 's-w' | 's-e'
  ex?: number
  ez?: number
}

export interface MapDataItem {
  name: string
  type: 'ice' | 'rail' | 'walk' | 'green' | 'frame'
  notes?: string
  namelist?: MapNameItem[]
  points: MapPoint[]
}

export interface MapNameItem {
  name: string
  point: MapPoint
}
interface MapItem {
  name: string
  type: string
}

/** 统计地图目录配置 */ 
export const mapList: MapItem[] = [
  {
    name: '毛线V3—下界交通地图',
    type: 'kedamaV3Nether117'
  },
  {
    name: '毛线V3—主世界交通地图',
    type: 'kedamaV3World'
  },
  {
    name: '毛线V2—下界交通地图',
    type: 'kedamaV2Nether115'
  },
  {
    name: '毛线V2—下界基岩上层萌新通道',
    type: 'kedamaV2Nether128'
  },
  {
    name: '毛线V2—主世界通地图',
    type: 'kedamaV2World'
  },
  {
    name: '喵窝—下界交通地图',
    type: 'nyaaNether'
  },
  {
    name: '喵窝—主世界通地图',
    type: 'nyaaWorld'
  }
]

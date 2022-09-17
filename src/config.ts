import type { ConfigMapList, ConfigColorList } from './types/index'

/** 统计地图目录配置 */
export const mapList: ConfigMapList = [
  {
    name: '毛线V5—下界交通地图',
    type: 'kedamaV5Nether'
  },
  {
    name: '毛线V5—主世界交通地图',
    type: 'kedamaV5World'
  },
  {
    name: '毛线V4—下界交通地图',
    type: 'kedamaV4Nether'
  },
  {
    name: '毛线V4—主世界交通地图',
    type: 'kedamaV4World'
  },
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
    name: '喵窝—下界基岩上层交通地图',
    type: 'nyaaNether129'
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

/** 颜色配置 */
export const colorList: ConfigColorList = [
  {
    key: '--color-ice',
    value: '#7FDBFF',
    name: '冰道'
  },
  {
    key: '--color-rail',
    value: '#FFDC00',
    name: '铁路'
  },
  {
    key: '--color-walk',
    value: '#85144b',
    name: '步道'
  },
  // {
  //   key: '--color-green',
  //   value: '#2ECC40',
  //   name: '通顶'
  // },
  {
    key: '--color-frame',
    value: '#AAAAAA',
    name: '边框'
  }
]

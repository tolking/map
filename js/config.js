import { getUrlString, getLocal } from './public.js'

// 统计地图目录配置
export const mapList = [
  {
    name: '毛线V3—下界交通地图',
    type: 'kedamaV3Nether117'
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
  }
  // {
  //   name: '喵窝—主世界通地图',
  //   type: 'nyaaWorld'
  // }
];

// 初始配置
export const getBase = () => {
  let base = {
    type: 'kedamaV3Nether117',
    ice: '#7FDBFF',
    rail: '#FFDC00',
    walk: '#85144b',
    green: '#2ECC40',
    frame: '#AAAAAA',
    text: '#001f3f',
    white: '#fff',
    width: 2,
    scale: 1,
    dx: 0,
    dz: 0
  }
  // 获取地址传参
  let urlType = getUrlString('type')
  // 获取本地配置
  let localBase = getLocal('base')
  // 优先加载通过地址传参的地图
  urlType && (localBase ? localBase.type = urlType : localBase = { type: urlType })
  // 合并各种配置到 base
  Object.assign(base, localBase)
  return base
}
import { $, getUrlString, getLocal } from './public.js'

// 统计地图目录配置
export const mapList = [
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
];

// 初始配置
export const getBase = () => {
  let base = {
    type: 'kedamaV3Nether117', // 默认加载数据
    ice: '#7FDBFF', // 冰道颜色
    rail: '#FFDC00', // 铁路颜色
    walk: '#85144b', // 步道颜色
    green: '#2ECC40', // 通顶（破基岩）颜色
    frame: '#AAAAAA', // 边框颜色
    text: '#001f3f', // 文字颜色
    white: '#fff', // 背景颜色
    cW: $('canvas').offsetWidth, // canvas 宽度
    cH: $('canvas').offsetHeight, // canvas 高度
    width: 2, // 线路宽度基础系数
    scale: 1, // 缩放系数
    dx: 0, // canvas 偏移
    dz: 0 // canvas 偏移
  }
  const urlType = getUrlString('type') // 获取地址传参
  let localBase = getLocal('base') // 获取本地配置
  // 优先加载通过地址传参的地图
  urlType && (localBase ? localBase.type = urlType : localBase = { type: urlType })
  // 合并各种配置到 base
  Object.assign(base, localBase)
  return base
}

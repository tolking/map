import { mapList, getBase } from './config.js'
import Draw from './draw.js'
import {
  $,
  isPhone,
  get,
  getSize,
  getMousePos,
  direction,
  configHtml,
  changeHtml,
  changePointTip,
  changeColor,
  setLocal
} from './public.js'

const $draw = new Draw
const hammer = new Hammer($('#canvas'))
let base = getBase() // 引入基础配置
let mapConfig

configHtml(mapList) // 初始地图下拉选择框
$draw.getCtx($('#canvas')) // 初始 canvas
$draw.setCanvas(isPhone() ? 3 : 1, base.width) // 初始 canvas 大小（解决手机模糊）
londMap(base.type) // 加载默认地图数据

// 获取地图数据
function londMap(item) {
  get(item).then(res => {
    mapConfig = res
    base.dx = 0
    base.dz = 0
    base.scale = getSize(mapConfig.radius) // 初始地图缩放大小数据
    changeHtml(mapConfig, base.type) // 修改网页中的地图信息数据
    $draw.setScale(base.scale) // 初始 canvas 缩放
    $draw.setRadius(mapConfig.radius) // 初始 canvas 半径
    $draw.moveCenter(mapConfig.center) // 移动 canvas 至地图数据中点
    drawCanvse() // 绘制 canvas 地图
  })
}

// 画图
function drawCanvse() {
  $draw.recanvas() // 清空画布
  $draw.bg(base.white) // 绘制背景
  $draw.setScale(base.scale) // 设置缩放
  $draw.moveCanvas(base.dx, base.dz)
  $draw.border(mapConfig.borderstyle, base.frame, base.white) // 绘制边界
  $draw.item(mapConfig.data, base) // 绘制地图
}

// 手机移动  通过 transform 优化拖动性能
hammer.on('panmove', ev => {
  changePointTip()
  $('canvas').style.transform = `translate3d(${ev.deltaX}px, ${ev.deltaY}px, 0px)`
})
hammer.on('panend', ev => {
  base.dx += ev.deltaX
  base.dz += ev.deltaY
  $('canvas').style.transform = `translate3d(0px, 0px, 0px)`
  drawCanvse()
})

 // 手机缩放
hammer.get('pinch').set({
  enable: true
})
hammer.on('pinchmove', ev => {
  changePointTip()
  $('canvas').style.transform = `scale3d(${ev.scale}, ${ev.scale}, 1)`
})
hammer.on('pinchend', ev => {
  $('canvas').style.transform = 'scale3d(1, 1, 1)'
  base.scale = base.scale * ev.scale
  base.dx += (ev.center.x - base.cW / 2 - base.dx) * (1 - ev.scale)
  base.dz += (ev.center.y - base.cH / 2 - base.dz) * (1 - ev.scale)
  drawCanvse()
})

// 点击
hammer.on('tap', ev => {
  const point = {
    x: ~~((ev.center.x - base.dx - base.cW / 2) / base.scale + mapConfig.center.x),
    z: ~~((ev.center.y - base.dz - base.cH / 2) / base.scale + mapConfig.center.z),
    center: ev.center
  }
  changePointTip(point)
})

 // 鼠标缩放
$('canvas').onmousewheel = mouseWheel
if ($('canvas').addEventListener) {
  $('canvas').addEventListener('DOMMouseScroll', mouseWheel, false)
}
function mouseWheel() {
  direction().then(direction => {
    changePointTip()
    const m = getMousePos()
    base.scale = base.scale * (direction ? 1.1 : 0.9)
    base.dx += (m.x - base.cW / 2 - base.dx) * (direction ? -0.1 : 0.1)
    base.dz += (m.y - base.cH / 2 - base.dz) * (direction ? -0.1 : 0.1)
    drawCanvse()
  })
}


// 监听数据源更改
$('.select-data').onchange = function() {
  base.type = this.value
  londMap(base.type)
  setLocal('base', base)
}
// 监听颜色更改
$('#ice').onchange = function() {
  this.click()
  base.ice = this.value;
  drawCanvse()
  setLocal('base', base)
};
$('#rail').onchange = function() {
  this.click()
  base.rail = this.value
  drawCanvse()
  setLocal('base', base)
};
$('#walk').onchange = function() {
  this.click()
  base.walk = this.value
  drawCanvse()
  setLocal('base', base)
};
$('#green').onchange = function() {
  this.click()
  base.green = this.value
  drawCanvse()
  setLocal('base', base)
};
$('#frame').onchange = function() {
  this.click()
  base.frame = this.value
  drawCanvse()
  setLocal('base', base)
};
$('#text').onchange = function() {
  this.click()
  base.text = this.value
  drawCanvse()
  setLocal('base', base)
};
// 恢复初始颜色
$('.ice').onclick = () => {
  changeColor('#ice', '#7FDBFF')
  base.ice = '#7FDBFF'
  drawCanvse()
  setLocal('base', base)
}
$('.rail').onclick = () => {
  changeColor('#rail', '#FFDC00')
  base.rail = '#FFDC00'
  drawCanvse()
  setLocal('base', base)
}
$('.walk').onclick = () => {
  changeColor('#walk', '#85144b')
  base.walk = '#85144b'
  drawCanvse()
  setLocal('base', base)
}
$('.green').onclick = () => {
  changeColor('#green', '#2ECC40')
  base.green = '#2ECC40'
  drawCanvse()
  setLocal('base', base)
}
$('.frame').onclick = () => {
  changeColor('#frame', '#AAAAAA')
  base.frame = '#AAAAAA'
  drawCanvse()
  setLocal('base', base)
}
$('.text').onclick = () => {
  changeColor('#text', '#001f3f')
  base.text = '#001f3f'
  drawCanvse()
  setLocal('base', base)
}
// 关闭弹窗
$('.tip-btn').onclick = () => {
  $('.tip').style.display = 'none'
  setLocal(base.type, base, mapConfig.version)
}

// 搜索
$('.btn-search').onclick = () => {
  $('.search-box').style.display = 'flex'
}
$('.search').onclick = () => {
  const value = $('.search-value').value
  if (value) {
    const nameList = $draw.getNameList()
    const searchList = nameList.filter(item => item.name.includes(value.trim()))

    if (searchList.length) {
      let html = ''
      for (let i = 0; i < searchList.length; i++) {
        const item = searchList[i]
        html += `<p class="list-item font-14" data-x="${item.point.x}" data-z="${item.point.z}">${item.name}</p>`
      }
      $('.search-box .search-list').innerHTML = html
    } else {
      $('.search-box .search-list').innerHTML = '<p class="list-item font-14">无相关数据</p>'
    }
    $('.search-box .search-list').style.display = 'block'
  }
}
$('.search-list').onclick = (e) => {
  if (e.target.nodeName === 'P') {
    const x = e.target.dataset.x
    const z = e.target.dataset.z

    if (x !== undefined && z !== undefined) {
      base.dx = -(x - mapConfig.center.x) * base.scale
      base.dz = -(z - mapConfig.center.z) * base.scale
      $('.search-box').style.display = 'none'
      $('.search-box .search-list').style.display = 'none'
      drawCanvse()
    }
  }
}
$('.btn-close').onclick = () => {
  $('.search-box').style.display = 'none'
  $('.search-box .search-list').style.display = 'none'
}

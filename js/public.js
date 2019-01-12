
// 封装选择器（jquery风味）
export const $ = item => {
  return document.querySelector(item)
}

// 判断手机
export const isPhone = i => {
  if (!window.location.hash.match('fromapp')) {
    return navigator.userAgent.match(/(iPhone|Android|ios|Windows Phone)/i)
  }
}

// 获取json文件
export const get = item => {
  var request = new XMLHttpRequest()
  return new Promise((resolve, reject) => {
    request.open('get', `../config/${item}.json`)
    request.send()
    request.onreadystatechange = () => {
      if (request.readyState === 4) {
        if (request.status === 200) {
          resolve(JSON.parse(request.responseText))
        } else {
          console.error('configList -> type or url -> type error')
          console.error(item)
          reject(request.status)
        }
      }
    }
  })
}

// 获取地址传参
export const getUrlString = (name) => {
  let reg = new RegExp('(^|&)'+ name +'=([^&]*)(&|$)')
  let r = window.location.search.substr(1).match(reg)
  return r !== null ? unescape(r[2]) : null
}

// 获取数据
export const getLocal = (item) => {
  return JSON.parse(localStorage.getItem(item))
}

// 初始化map大小
export const getSize = radius => {
  const w = document.body.clientWidth
  const h = document.body.clientHeight
  const scale = (w - h ? h : w) / (2 * radius) * 0.9
  return scale
}

// 储存数据
export const setLocal = (item) => {
  let data
  if (item === 'base') {
    data = {
      type: base.type,
      ice: base.ice,
      rail: base.rail,
      walk: base.walk,
      green: base.green,
      frame: base.frame,
      text: base.text
    }
  } else {
    data = {
      type: base.type,
      version: base.config.version
    }
  }
  localStorage.setItem(item, JSON.stringify(data))
}

// 初始配置本地储存select与input[color]值
export const configHtml = item => {
  // 初始化select
  let html = ''
  item.forEach(element => {
    html += `<option value='${element.type}'>${element.name}</option>`
  })
  $('.select-data').innerHTML = html
  // 更新本地储存颜色与select值
  let localBase = getLocal('base')
  for (const key in localBase) {
    if (localBase.hasOwnProperty(key)) {
      const element = localBase[key]
      if (key === 'type') {
        $('.select-data').value = element
      } else {
        changeColor('#' + key, element)
      }
    }
  }
}

// 修改html数据
export const changeHtml = (item, type) => {
  $('title').innerText = item.title
  $('.title-text').innerText = item.title
  $('.version-data .uptime').innerText = item.uptime
  $('.version-data .author').innerText = item.author

  let old = getLocal(type) || 0
  let oldVersion = old.version || 0

  $('#canvas').className = null
  $('.tip').style.display = 'none'
  if (item.version && (oldVersion === null || oldVersion < item.version)) {
    $('.tip-text').innerHTML = item.introduce
    $('.tip').style.display = 'flex'
    $('#canvas').className = 'canvas-mask'
  }
}

// 修改input[color]颜色
export const changeColor = (id, value) => {
  $(id).value = value
}




// 鼠标坐标
export const getMousePos = (event) => {
  var e = event || window.event
  return {'x': e.clientX, 'y': e.clientY}
}

// 鼠标滚轮
export const mouseWheel = (id, downFn, upFn) => {
  const obj = $(id)
  obj.onmousewheel = fn
  if (obj.addEventListener) {
    obj.addEventListener('DOMMouseScroll', fn, false)
  }
  function fn(ev) {
    var ev = ev || event
    var b = true
    if (ev.wheelDelta) {
      b = ev.wheelDelta > 0 ? true : false
    } else {
      b = ev.detail < 0 ? true : false
    }
    if(b) {
      upFn && upFn()
    } else {
      downFn && downFn()
    }
    if (ev.preventDefault) {
      ev.preventDefault()
    }
    return false
  }
}
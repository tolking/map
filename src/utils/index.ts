import { WheelEvent } from './../types/index'

/** 获取json文件 */
export async function get<T>(url: string): Promise<T> {
  const res = await fetch(url)
  return res.json()
}

/**
 * 获取地址传参
 * @param key 键值
 */
export function getUrlString (key: string) {
  const reg = new RegExp('(^|&)'+ key +'=([^&]*)(&|$)')
  const r = window.location.search.substr(1).match(reg)
  return r !== null ? unescape(r[2]) : null
}

/** 鼠标滚轮事件 */
export function mouseScroll(event?: WheelEvent) {
  return new Promise<{
    center: { x: number, y: number },
    direction: boolean,
  }>(resolve => {
    let direction = true
    if (event.wheelDelta) {
      direction = event.wheelDelta > 0
    } else {
      direction = event.detail < 0
    }
    if (event.preventDefault) {
      event.preventDefault()
    }
    resolve({
      center: { x: event.clientX,y: event.clientY },
      direction
    })
  })
}

/**
 * 节流函数
 * @param fn 执行函数
 * @param wait 等待时间
 */
export function throttle(fn: (...args: unknown[]) => void, wait: number) {
  let startTime = Date.now()
  let timer = null
  return function() {
    const curTime = Date.now()
    if (curTime - startTime >= wait) {
      timer = setTimeout((fn.apply(this, arguments), (timer = undefined)), wait)
      startTime = curTime
    }
  }
}

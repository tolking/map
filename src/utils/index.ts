import { createTag } from 'tagged-operator'
import type { Precedence, Operator } from 'tagged-operator'
import type { Coordinate, MapPoint } from '../types/index'

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

interface IWheelEvent extends WheelEvent {
  wheelDelta?: number
}

/** 鼠标滚轮事件 */
export function mouseScroll(event: IWheelEvent) {
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
export function throttle<T extends unknown[] = unknown[], Q = void>(
  fn: (...args: T) => Q,
  interval: number,
) {
  let enterTime = 0

  return function (this: unknown, ...args: T) {
    const backTime = new Date().getTime()

    if (backTime - enterTime > interval) {
      fn.call(this, ...args)
      enterTime = backTime
    }
  }
}

function isObject(value: unknown): value is object {
  return typeof value === 'object'
}

type CalcInput = Coordinate | MapPoint | HammerInput | number

const precedence: Precedence = { 1: ['*', '/'] }
const operator: Operator<CalcInput, Coordinate> = (type, a, b) => {
  const aX = isObject(a) ? 'deltaX' in a ? a.deltaX : a.x : a
  const aY = isObject(a) ? 'deltaY' in a ? a.deltaY : 'z' in a ? a.z : a.y : a
  const bX = isObject(b) ? 'deltaX' in b ? b.deltaX : b.x : b
  const bY = isObject(b) ? 'deltaY' in b ? b.deltaY : 'z' in b ? b.z : b.y : b

  switch (type) {
    case '+':
      return { x: aX + bX, y: aY + bY }
    case '-':
      return { x: aX - bX, y: aY - bY }
    case '*':
      return { x: aX * bX, y: aY * bY }
    case '/':
      return { x: aX / bX, y: aY / bY }
    default:
      console.warn(`no operator configured: ${type}`)
      return a as Coordinate
  }
}

/** 通过模拟运算符重载计算坐标值 */
export const calc = createTag({ operator, precedence })

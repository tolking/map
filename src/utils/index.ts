/** 获取json文件 */
export async function get<T>(url: string): Promise<T> {
  const res = await fetch(url)

  return res.json()
}

/** 鼠标坐标 */
export function getMousePos(event) {
  const e = event || window.event
  return { x: e.clientX, y: e.clientY }
}

/** 鼠标滚轮方向 */
export function direction(ev) {
  return new Promise(resolve => {
    let direction = true
    if (ev.wheelDelta) {
      direction = ev.wheelDelta > 0 ? true : false
    } else {
      direction = ev.detail < 0 ? true : false
    }
    if (ev.preventDefault) {
      ev.preventDefault()
    }
    resolve(direction)
  })
}

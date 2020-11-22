import { onMounted, reactive, toRefs } from "vue"
import { Manager, Pan, Pinch, Tap } from '@egjs/hammerjs'
import { direction, getMousePos, throttle } from './../utils/index.ts'

export function useControl() {
  const data = reactive({
    x: 0,
    y: 0,
    s: 1,
    leastWidth: 1,
    transform: '',
  })

  onMounted(() => {
    const square = document.getElementById('app') as HTMLElement
    const screeWidth = square.offsetWidth
    const screeHeight = square.offsetHeight
    const hammer = new Manager(square)
    const pan = new Pan()
    const pinch = new Pinch()
    const tap = new Tap()

    data.leastWidth =
      window.matchMedia('(orientation: portrait)').matches ? screeWidth : screeHeight

    hammer.add([pan, pinch, tap])
    hammer.on('panmove', ({ deltaX, deltaY }) => {
      setTransform(data.x + deltaX, data.y + deltaY, data.s)
    })
    hammer.on('panend', ({ deltaX, deltaY }) => {
      data.x += deltaX
      data.y += deltaY
    })
    hammer.get('pinch').set({ enable: true })
    hammer.on('pinchmove', ({ scale, center }) => {
      setTransform(
        data.x + (center.x - screeWidth / 2 - data.x) * (1 - scale),
        data.y + (center.y - screeHeight / 2 - data.y) * (1 - scale),
        data.s * scale
      )
    })
    hammer.on('pinchend', ({ scale, center }) => {
      data.s *= scale
      data.x += (center.x - screeWidth / 2 - data.x) * (1 - scale)
      data.y += (center.y - screeHeight / 2 - data.y) * (1 - scale)
    })
    // hammer.on('tap', ev => {
      // console.log(ev);
      // TODO: 点击弹窗？
    // })
    square.onmousewheel = throttle(mouseWheel, 100)
    if (square.addEventListener) {
      square.addEventListener('DOMMouseScroll', throttle(mouseWheel, 100), false)
    }

    function mouseWheel() {
      direction().then((direction: boolean) => {
        const m = getMousePos()
        data.s *= (direction ? 1.1 : 0.9)
        data.x += (m.x - screeWidth / 2 - data.x) * (direction ? -0.1 : 0.1)
        data.y += (m.y - screeHeight / 2 - data.y) * (direction ? -0.1 : 0.1)
        setTransform(data.x, data.y, data.s)
      })
    }
  })

  function setTransform(x: number, y: number, s: number) {
    data.transform = `translate3d(${x}px, ${y}px, 0px) scale3d(${s}, ${s}, 1)`
  }

  return {
    ...toRefs(data),
    setTransform,
  }
}
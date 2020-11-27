import { onMounted, reactive, Ref, toRefs } from "vue"
import { Manager, Pan, Pinch, Tap } from '@egjs/hammerjs'
import { mouseScroll, throttle } from './../utils/index'
import { MapData, WheelEvent } from './../types/index'

export function useControl(mapData: Ref<MapData>) {
  const data = reactive({
    x: 0,
    y: 0,
    s: 1,
    leastWidth: 1,
    transform: '',
    tipPoint: {
      message: '',
      style: {},
    },
  })

  onMounted(() => {
    const square = document.getElementById('app-svg') as HTMLElement
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
    hammer.on('tap', ({ center }) => {
      setTipPoint({ ...center, screeWidth, screeHeight })
    })
    square.onmousewheel = throttle(mouseWheel, 50)
    if (square.addEventListener) {
      square.addEventListener('DOMMouseScroll', throttle(mouseWheel, 50), false)
    }

    function mouseWheel(e: WheelEvent) {
      mouseScroll(e).then(({ direction, center }) => {
        data.s *= (direction ? 1.1 : 0.9)
        data.x += (center.x - screeWidth / 2 - data.x) * (direction ? -0.1 : 0.1)
        data.y += (center.y - screeHeight / 2 - data.y) * (direction ? -0.1 : 0.1)
        setTransform(data.x, data.y, data.s)
      })
    }
  })

  function setTransform(x: number, y: number, s: number) {
    data.transform = `translate3d(${x}px, ${y}px, 0px) scale3d(${s}, ${s}, 1)`
    data.tipPoint = {
      message: '',
      style: {},
    }
  }

  function setTipPoint({ x, y, screeWidth, screeHeight }) {
    const _s = 0.45 * data.s * data.leastWidth / mapData.value.radius
    const _x = ~~((x - screeWidth / 2 - data.x) / _s + mapData.value.center.x)
    const _z = ~~((y - screeHeight / 2 - data.y) / _s + mapData.value.center.z)

    data.tipPoint = {
      message: `x: ${_x}, z: ${_z}`,
      style: {
        left: x + 'px',
        top: y + 'px',
      },
    }
  }

  return {
    ...toRefs(data),
    setTransform,
  }
}
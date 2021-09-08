import { computed, onMounted, reactive, Ref, toRefs } from 'vue'
import { Manager, Pan, Pinch, Tap } from '@egjs/hammerjs'
import { mouseScroll, throttle } from './../utils/index'
import type { MapData } from './../types/index'

interface TypePoint {
  x: number
  y: number
  screeWidth: number
  screeHeight: number
}

export function useControl(mapData: Ref<MapData>) {
  const data = reactive({
    translateX: 0,
    translateY: 0,
    scale: 1,
    leastWidth: 1,
    transform: '',
    pointMessage: '',
    pointStyle: {},
  })

  const relativeScale = computed(() => {
    return 0.45 * data.scale * data.leastWidth / mapData.value.radius
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
      setTransform(data.translateX + deltaX, data.translateY + deltaY, data.scale)
    })
    hammer.on('panend', ({ deltaX, deltaY }) => {
      data.translateX += deltaX
      data.translateY += deltaY
    })
    hammer.get('pinch').set({ enable: true })
    hammer.on('pinchmove', ({ scale, center }) => {
      const _s = data.scale * scale
      _s >= .3 && _s <= 50 && setTransform(
        data.translateX + (center.x - screeWidth / 2 - data.translateX) * (1 - scale),
        data.translateY + (center.y - screeHeight / 2 - data.translateY) * (1 - scale),
        data.scale * scale
      )
    })
    hammer.on('pinchend', ({ scale, center }) => {
      const _s = data.scale * scale
      data.scale = _s < .3 ? .3 : _s > 50 ? 50 : _s
      if (_s >= .3 && _s <= 50) {
        data.translateX += (center.x - screeWidth / 2 - data.translateX) * (1 - scale)
        data.translateY += (center.y - screeHeight / 2 - data.translateY) * (1 - scale)
      }
    })
    hammer.on('tap', ({ center }) => {
      setTipPoint({ ...center, screeWidth, screeHeight })
    })
    square.onwheel = throttle(mouseWheel, 50)

    function mouseWheel(e: WheelEvent) {
      mouseScroll(e).then(({ direction, center }) => {
        const _s = data.scale * (direction ? 1.1 : 0.9)
        data.scale = _s < .3 ? .3 : _s > 50 ? 50 : _s
        if (_s >= .3 && _s <= 50) {
          data.translateX += (center.x - screeWidth / 2 - data.translateX) * (direction ? -0.1 : 0.1)
          data.translateY += (center.y - screeHeight / 2 - data.translateY) * (direction ? -0.1 : 0.1)
          setTransform(data.translateX, data.translateY, data.scale)
        }
      })
    }
  })

  function setTransform(translateX: number, translateY: number, scale: number) {
    data.transform = `translate3d(${translateX}px, ${translateY}px, 0px) scale3d(${scale}, ${scale}, 1)`
    data.pointMessage = ''
    data.pointStyle = {}
  }

  function setTipPoint({ x, y, screeWidth, screeHeight }: TypePoint) {
    const _x = ~~((x - screeWidth / 2 - data.translateX) / relativeScale.value + mapData.value.center.x)
    const _z = ~~((y - screeHeight / 2 - data.translateY) / relativeScale.value + mapData.value.center.z)

    data.pointMessage = `x: ${_x}, z: ${_z}`
    data.pointStyle = {
      left: x + 'px',
      top: y + 'px',
    }
  }

  return {
    ...toRefs(data),
    relativeScale,
    setTransform,
  }
}
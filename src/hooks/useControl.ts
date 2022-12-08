import { batch, onMount } from 'solid-js'
import { createStore } from 'solid-js/store'
import { Manager, Pan, Pinch, Tap } from '@egjs/hammerjs'
import { mouseScroll, throttle } from '../utils/index'
import type { InitializedResource } from 'solid-js'
import type { MapData } from '../types/index'

export interface ControlData {
  translateX: number
  translateY: number
  scale: number
  leastWidth: number
  transform: string
  pointMessage: string
  pointStyle: Record<string, string | number>
  relativeScale: number
}

interface TypePoint {
  x: number
  y: number
  screeWidth: number
  screeHeight: number
}

export function useControl(mapData: InitializedResource<MapData>) {
  const [data, setData] = createStore<ControlData>({
    translateX: 0,
    translateY: 0,
    scale: 1,
    leastWidth: 1,
    transform: '',
    pointMessage: '',
    pointStyle: {},
    get relativeScale() {
      return 0.45 * this.scale * this.leastWidth / mapData().radius
    }
  })

  onMount(() => {
    const square = document.getElementById('app-svg') as HTMLElement
    const screeWidth = square.offsetWidth
    const screeHeight = square.offsetHeight
    const hammer = new Manager(square)
    const pan = new Pan()
    const pinch = new Pinch()
    const tap = new Tap()
    const leastWidth = window.matchMedia('(orientation: portrait)').matches
      ? screeWidth
      : screeHeight

    setData({ leastWidth })

    hammer.add([pan, pinch, tap])
    hammer.on('panmove', ({ deltaX, deltaY }) => {
      setTransform(
        data.translateX + deltaX,
        data.translateY + deltaY,
        data.scale
      )
    })
    hammer.on('panend', ({ deltaX, deltaY }) => {
      setData((state) => ({
        translateX: state.translateX + deltaX,
        translateY: state.translateY + deltaY,
      }))
    })
    hammer.get('pinch').set({ enable: true })
    hammer.on('pinchmove', ({ scale, center }) => {
      const s = data.scale * scale
      const x = data.translateX
      const y = data.translateY

      s >= .3 && s <= 50 && setTransform(
        x + (center.x - screeWidth / 2 - x) * (1 - scale),
        y + (center.y - screeHeight / 2 - y) * (1 - scale),
        data.scale * scale
      )
    })
    hammer.on('pinchend', ({ scale, center }) => {
      const s = data.scale * scale
      const x = data.translateX
      const y = data.translateY
      const _scale = s < .3 ? .3 : s > 50 ? 50 : s

      batch(() => {
        setData({ scale: _scale })
        if (s >= .3 && s <= 50) {
          const translateX = x + (center.x - screeWidth / 2 - x) * (1 - scale)
          const translateY = y + (center.y - screeHeight / 2 - y) * (1 - scale)
  
          setData({ translateX, translateY })
        }
      })
    })
    hammer.on('tap', ({ center }) => {
      setTipPoint({ ...center, screeWidth, screeHeight })
    })
    square.onwheel = throttle(mouseWheel, 50)

    function mouseWheel(e: WheelEvent) {
      mouseScroll(e).then(({ direction, center }) => {
        const s = data.scale * (direction ? 1.1 : 0.9)
        const x = data.translateX
        const y = data.translateY
        const scale = s < .3 ? .3 : s > 50 ? 50 : s

        batch(() => {
          setData({ scale })
          if (s >= .3 && s <= 50) {
            const _s = direction ? -0.1 : 0.1
            const _x = x + (center.x - screeWidth / 2 - x) * _s
            const _y = y + (center.y - screeHeight / 2 - y) * _s
  
            setData({ translateX: _x, translateY: _y })
            setTransform(_x, _y, scale)
          }
        })
      })
    }
  })

  function setTransform(translateX: number, translateY: number, scale: number) {
    const transform = `translate3d(${translateX}px, ${translateY}px, 0px) scale3d(${scale}, ${scale}, 1)`

    setData({
      transform,
      pointMessage: '',
      pointStyle: {},
    })
  }

  function setTipPoint({ x, y, screeWidth, screeHeight }: TypePoint) {
    const _x = ~~((x - screeWidth / 2 - data.translateX) / data.relativeScale + mapData().center.x)
    const _z = ~~((y - screeHeight / 2 - data.translateY) / data.relativeScale + mapData().center.z)

    setData({
      pointMessage: `x: ${_x}, z: ${_z}`,
      pointStyle: {
        left: x + 'px',
        top: y + 'px',
      }
    })
  }

  return {
    data,
    setData,
    setTransform,
  }
}

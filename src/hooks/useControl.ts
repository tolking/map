import { batch, onMount } from 'solid-js'
import { createStore } from 'solid-js/store'
import { Manager, Pan, Pinch, Tap } from '@egjs/hammerjs'
import { calc, mouseScroll, throttle } from '../utils/index'
import type { InitializedResource } from 'solid-js'
import type { Coordinate, MapData } from '../types/index'

export interface ControlData extends Coordinate {
  scale: number
  leastWidth: number
  transform: string
  pointMessage: string
  pointStyle: Record<string, string | number>
  relativeScale: number
}

export function useControl(mapData: InitializedResource<MapData>) {
  const [data, setData] = createStore<ControlData>({
    x: 0, // transformX
    y: 0, // transformY
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
    const hammer = new Manager(square)
    const pan = new Pan()
    const pinch = new Pinch()
    const tap = new Tap()
    const screen = {
      x: square.offsetWidth,
      y: square.offsetHeight,
    }
    const leastWidth = window.matchMedia('(orientation: portrait)').matches
      ? screen.x
      : screen.y

    setData({ leastWidth })

    hammer.add([pan, pinch, tap])
    hammer.on('panmove', (delta) => {
      const { x, y } = calc`${data} + ${delta}`
      setTransform(x, y, data.scale)
    })
    hammer.on('panend', (delta) => {
      const { x, y } = calc`${data} + ${delta}`
      setData({ x, y })
    })
    hammer.get('pinch').set({ enable: true })
    hammer.on('pinchmove', ({ scale, center }) => {
      const s = data.scale * scale
      const { x, y } = calc`${data} + (${center} - ${screen} / ${2} - ${data}) * (${1} - ${scale})`
 
      s >= .3 && s <= 50 && setTransform(x, y, data.scale * scale)
    })
    hammer.on('pinchend', ({ scale, center }) => {
      const s = data.scale * scale
      const _scale = s < .3 ? .3 : s > 50 ? 50 : s

      batch(() => {
        setData({ scale: _scale })
        if (s >= .3 && s <= 50) {
          const { x, y } = calc`${data} + (${center} - ${screen} / ${2} - ${data}) * (${1} - ${scale})`

          setData({ x, y })
        }
      })
    })
    hammer.on('tap', ({ center }) => {
      const { x, y } = calc`(${center} - ${screen} / ${2} - ${data}) / ${data.relativeScale} + ${mapData().center}`

      setData({
        pointMessage: `x: ${~~x}, z: ${~~y}`,
        pointStyle: {
          left: center.x + 'px',
          top: center.y + 'px',
        }
      })
    })
    square.onwheel = throttle(mouseWheel, 50)

    function mouseWheel(e: WheelEvent) {
      mouseScroll(e).then(({ direction, center }) => {
        const s = data.scale * (direction ? 1.1 : 0.9)
        const scale = s < .3 ? .3 : s > 50 ? 50 : s

        batch(() => {
          setData({ scale })
          if (s >= .3 && s <= 50) {
            const { x, y } = calc`${data} + (${center} - ${screen} / ${2} - ${data}) * ${direction ? -0.1 : 0.1}`

            setData({ x, y })
            setTransform(x, y, scale)
          }
        })
      })
    }
  })

  function setTransform(x: number, y: number, scale: number) {
    const transform = `translate3d(${x}px, ${y}px, 0px) scale3d(${scale}, ${scale}, 1)`

    setData({
      transform,
      pointMessage: '',
      pointStyle: {},
    })
  }

  return {
    data,
    setData,
    setTransform,
  }
}

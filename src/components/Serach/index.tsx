import { createMemo, createSignal, For, Show } from 'solid-js'
import { Portal } from 'solid-js/web'
import { useNameList } from '../../hooks/index'
import type { MapNameItem, MapPoint } from '../../types/index'
import './index.css'

interface Props {
  onMove: (point: MapPoint) => void
}

export default function Serach(props: Props) {
  const [show, setShow] = createSignal(false)
  const [keyword, setKeyword] = createSignal('')
  const body = document.getElementsByTagName('body')[0]

  const list = createMemo(() => {
    if (keyword()) {
      return useNameList().filter((item: MapNameItem) => {
        const _serach = keyword().trim().toLocaleLowerCase()
        return item.name.toLocaleLowerCase().includes(_serach)
      })
    } else {
      return []
    }
  })

  function change(event: Event) {
    const target = event.target as HTMLSelectElement
    setKeyword(target?.value)
  }

  function move(point: MapPoint) {
    toggle()
    props.onMove(point)
  }

  function toggle() {
    setKeyword('')
    setShow(!show())
  }

  return <>
    <div class="icon-button" onClick={toggle}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1026 1024">
        <path d="M513.28 0C380.16 0 252.16 51.2 149.76 148.48-49.92 348.16-49.92 675.84 149.76 875.52c102.4 102.4 230.4 148.48 363.52 148.48 133.12 0 261.12-51.2 363.52-148.48C1076.48 675.84 1076.48 353.28 876.8 153.6c-102.4-102.4-235.52-153.6-363.52-153.6m0 51.2c61.44 0 117.76 10.24 174.08 35.84 56.32 25.6 107.52 56.32 153.6 102.4 46.08 46.08 76.8 97.28 102.4 153.6 20.48 51.2 30.72 107.52 30.72 168.96s-10.24 117.76-35.84 174.08c-25.6 56.32-56.32 107.52-102.4 153.6-46.08 46.08-97.28 76.8-153.6 102.4-51.2 20.48-107.52 30.72-168.96 30.72-61.44 0-117.76-10.24-174.08-35.84-56.32-25.6-107.52-56.32-153.6-102.4-46.08-46.08-76.8-97.28-102.4-153.6-20.48-51.2-30.72-107.52-30.72-168.96 0-61.44 10.24-117.76 35.84-174.08 25.6-56.32 56.32-107.52 102.4-153.6 46.08-46.08 97.28-76.8 153.6-102.4 51.2-20.48 107.52-30.72 168.96-30.72"/>
        <path d="M666.88 634.88l97.28 97.28c10.24 10.24 10.24 25.6 0 35.84-10.24 10.24-25.6 10.24-35.84 0l-97.28-97.28c-40.96 30.72-87.04 46.08-143.36 46.08C359.68 716.8 257.28 614.4 257.28 486.4S359.68 256 487.68 256 718.08 358.4 718.08 486.4c0 56.32-20.48 107.52-51.2 148.48z m-179.2 30.72c97.28 0 179.2-81.92 179.2-179.2S584.96 307.2 487.68 307.2 308.48 389.12 308.48 486.4 390.4 665.6 487.68 665.6z"/>
      </svg>
    </div>
    <Show when={show()}>
      <Portal mount={body}>
        <section class="mask" onClick={toggle}>
          <div class="content" onClick={(e) => e.stopPropagation()}>
            <div class="serach-inpit">
              <input
                value={keyword()}
                type="text"
                autofocus
                class="input"
                onInput={change}
              />
            </div>
            <Show when={list().length}>
              <div class="serach-list">
                <For each={list()}>
                  {(item) => (
                    <div class="list-item" onClick={() => move(item.point)}>
                      <span class="name">{item.name}</span>
                      <span class="point">
                        {`x: ${item.point.x}, y: ${item.point.y}, z: ${item.point.z}`}
                      </span>
                    </div>
                  )}
                </For>
              </div>
            </Show>
          </div>
        </section>
      </Portal>
    </Show>
  </>
}

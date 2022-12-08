import { For, Match, Show, Switch } from 'solid-js'
import { useParseMapData } from '../../hooks/index'
import type { SetStoreFunction } from 'solid-js/store'
import type { MapData, MapPoint } from '../../types/index'
import type { ControlData } from '../../hooks/index'
import './index.css'

interface Props {
  data: MapData
  loading: boolean
  message: string
  style: Record<string, string | number>
  onOverPath: SetStoreFunction<ControlData>
}

export default function Map(props: Props) {
  const {
    borderstyle,
    radius,
    center,
    viewBox,
    dataList,
    nameList,
    parsePath,
  } = useParseMapData(props)

  function inPath({ clientX, clientY }: MouseEvent, value?: string) {
    if (!props.message && value) {
      props.onOverPath({
        pointStyle: {
          left: clientX + 2 + 'px',
          top: clientY + 2 + 'px',
        }, 
        pointMessage: value,
      })
    }
  }
  
  function outPath() {
    props.message && setTimeout(() => {
      props.onOverPath({ pointStyle: {}, pointMessage: '' })
    }, 300)
  }

  const Loading = (
    <div class="loading">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
        <path d="M16 0 A16 16 0 0 0 16 32 A16 16 0 0 0 16 0 M16 4 A12 12 0 0 1 16 28 A12 12 0 0 1 16 4" opacity=".25"/>
        <path d="M16 0 A16 16 0 0 1 32 16 L28 16 A12 12 0 0 0 16 4z">
          <animateTransform attributeName="transform" type="rotate" from="0 16 16" to="360 16 16" dur="0.8s" repeatCount="indefinite" />
        </path>
      </svg>
    </div>
  )

  return (
    <section id="app-svg">
      <Show when={!props.loading} fallback={Loading}>
        <svg
          style={props.style}
          viewBox={viewBox()}
          class="svg"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g>
            <Switch>
              <Match when={borderstyle() === 'square'}>
                <rect
                  width={radius() * 2}
                  height={radius() * 2}
                  class="path border"
                />
              </Match>
              <Match when={borderstyle() === 'circles'}>
                <circle
                  cx={radius()}
                  cy={radius()}
                  r={radius()}
                  class="path border"
                />
              </Match>
              <Match when={Array.isArray(borderstyle())}>
                <path
                  d={parsePath(borderstyle() as MapPoint[])}
                  class="path border"
                />
              </Match>
            </Switch>
          </g>
          <g>
            <For each={dataList()}>
              {(item) => (
                <Switch>
                  <Match when={item.type === 'green'}>
                    <circle
                      cx={item.points[0].x + radius() - center().x}
                      cy={item.points[0].z + radius() - center().z}
                      class={`path ${item.type}`}
                      onMouseEnter={(e: MouseEvent) => inPath(e, item.notes)}
                      onMouseOut={outPath}
                    />
                  </Match>
                  <Match when={item.type !== 'green'}>
                    <path
                      d={parsePath(item.points)}
                      class={`path ${item.type}`}
                      onMouseEnter={(e: MouseEvent) => inPath(e, item.notes)}
                      onMouseOut={outPath}
                    />
                  </Match>
                </Switch>
              )}
            </For>
          </g>
          <g>
            <For each={nameList()}>
              {(item) => (
                <text
                  x={item.point.x + radius() - center().x}
                  y={item.point.z + radius() - center().z}
                  class="text"
                >
                  {item.name}
                </text>
              )}
            </For>
          </g>
        </svg>
      </Show>
    </section>
  )
}

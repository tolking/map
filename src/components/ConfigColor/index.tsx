import { For } from 'solid-js'
import { colorList } from '../../config'
import { ConfigColorItem, LocalColor } from '../../types/index'
import type { SetStoreFunction } from 'solid-js/store'
import './index.css'

interface Props {
  value: LocalColor
  onChange: SetStoreFunction<LocalColor>
}

export default function ConfigColor(props: Props) {
  function change(event: Event, item: ConfigColorItem) {
    const target = event.target as HTMLInputElement
    props.onChange({ [item.key]: target?.value })
  }

  function reset(item: ConfigColorItem) {
    props.onChange({ [item.key]: item.value })
  }

  return (
    <section class="config-color">
      <For each={colorList}>
        {(item) => (
          <div class="color-item">
            <input
              value={props.value[item.key]}
              type="color"
              class="input"
              onChange={(e: Event) => change(e, item)}
            />
            <span class="text" onClick={() => reset(item)}>
              {item.name}
            </span>
          </div>
        )}
      </For>
    </section>
  )
}

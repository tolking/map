import { For } from 'solid-js'
import { mapList } from '../../config'
import './index.css'

interface Props {
  value: string
  onChange: (value: string) => void
}

export default function Select(props: Props) {
  function change(event: Event) {
    const target = event.target as HTMLSelectElement
    props.onChange(target?.value)
  }

  return (
    <select value={props.value} class="select-source" onChange={change}>
      <For each={mapList}>
        {(item) => <option value={item.type}>{item.name}</option>}
      </For>
    </select>
  )
}

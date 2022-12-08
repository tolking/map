import { Show } from 'solid-js'
import { Portal } from 'solid-js/web'
import './index.css'

interface Props {
  message?: string
  style?: Record<string, string | number>
}

export default function TipPoint(props: Props) {
  const body = document.getElementsByTagName('body')[0]

  return (
    <Show when={props.message}>
      <Portal mount={body}>
        <div innerHTML={props.message} style={props.style} class="tip-point" />
      </Portal>
    </Show>
  )
}

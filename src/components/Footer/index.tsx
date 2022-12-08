import { Show } from 'solid-js'
import './index.css'

interface Props {
  uptime?: string
  author?: string
}

export default function Footer(props: Props) {
  return (
    <footer class="footer">
      <Show when={props.uptime}>
        <span class="text">更新时间</span>
        <span class="text">{props.uptime}</span>
      </Show>
      <Show when={props.author}>
        <span class="text">数据维护</span>
        <span class="text">{props.author}</span>
      </Show>
    </footer>
  )
}

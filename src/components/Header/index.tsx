import { createEffect } from "solid-js"
import type { ParentProps } from 'solid-js'
import "./index.css"

interface Props {
  title: string
}

export default function Header(props: ParentProps<Props>) {
  createEffect(() => {
    const title = document.querySelector('title')
    if (title) {
      title.innerText = props.title
    }
  })

  return (
    <header class="header">
      <h1 class="title">{props.title}</h1>
      <div class="fun-content">{props.children}</div>
    </header>
  )
}

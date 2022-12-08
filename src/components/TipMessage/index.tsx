import { createEffect, createSignal, onMount, untrack } from 'solid-js'
import { Portal, Show } from 'solid-js/web'

interface Props {
  loading: boolean
  type: string
  version?: number
  introduce?: string
}

export default function TipMessage(props: Props) {
  const [info, setInfo] = createSignal('')
  const body = document.getElementsByTagName('body')[0]
  let mapVersion: { [key: string]: number } | undefined = undefined

  createEffect(checkVersion)

  onMount(() => {
    if (!mapVersion) {
      const localVersion = localStorage.getItem('map-version')
      mapVersion = localVersion ? JSON.parse(localVersion) : {}
    }
    checkVersion()
  })

  function checkVersion() {
    const loading = props.loading

    untrack(() => {
      if (!loading && props.version) {
        const oldVersion = mapVersion![props.type]

        if (!oldVersion || oldVersion < props.version) {
          setInfo(props.introduce || '')
          mapVersion![props.type] = props.version
          localStorage.setItem('map-version', JSON.stringify(mapVersion))
        }
      }
    })
  }

  return (
    <Show when={info()}>
      <Portal mount={body}>
        <section class="mask" onClick={() => setInfo('')}>
          <div innerHTML={info()} class="content" />
        </section>
      </Portal>
    </Show>
  )
}

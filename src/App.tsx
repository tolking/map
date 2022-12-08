import { batch, createMemo, onMount } from 'solid-js'
import {
  useColorList,
  useControl,
  useLoadMapData,
  useMapList
} from './hooks/index'
import Header from './components/Header/index'
import Serach from './components/Serach/index'
import Select from './components/Select/index'
import Map from './components/Map/index'
import ConfigColor from './components/ConfigColor/index'
import Footer from './components/Footer/index'
import TipMessage from './components/TipMessage/index'
import TipPoint from './components/TipPoint/index'
import { MapPoint } from './types/index'

export default function App() {
  const [color, setColor] = useColorList()
  const [type, setType] = useMapList()
  const mapData = useLoadMapData(type)
  const { data, setData, setTransform } = useControl(mapData)

  const style = createMemo(() => ({
    ...color,
    '--size-stroke': 1 / data.relativeScale,
    transform: data.transform,
  }))

  onMount(() => {
    document.querySelector('#app .loading')?.remove()
  })

  function refresh(value: string) {
    batch(() => {
      setType(value)
      setData({
        translateX: 0,
        translateY: 0,
        scale: 1,
        transform: '',
      })
    })
  }

  function moveMap(poit: MapPoint) {
    const x = -(poit.x - mapData().center.x) * data.relativeScale
    const y = -(poit.z - mapData().center.z) * data.relativeScale

    batch(() => {
      setData({ translateX: x, translateY: y })
      setTransform(x, y, data.scale)
    })
  }

  return <>
    <Header title={mapData().title}>
      <Serach onMove={moveMap}/>
      <Select value={type()} onChange={refresh} />
    </Header>
    <Map
      data={mapData()}
      loading={mapData.loading}
      message={data.pointMessage}
      style={style()}
      onOverPath={setData}
    />
    <ConfigColor value={color} onChange={setColor} />
    <Footer uptime={mapData().uptime} author={mapData().author} />
    <TipMessage
      loading={mapData.loading}
      type={type()}
      version={mapData().version}
      introduce={mapData().introduce}
    />
    <TipPoint message={data.pointMessage} style={data.pointStyle} />
  </>
}

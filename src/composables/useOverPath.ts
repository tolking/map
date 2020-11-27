import { ref } from 'vue'

export function useOverPath() {
  const notes = ref('')
  const client = ref({})

  function enterPath({ clientX, clientY }: WheelEvent, value: string) {
    if (value) {
      notes.value = value
      client.value = {
        left: clientX + 'px',
        top: clientY + 'px',
      }
    }
  }

  function outPath() {
    notes.value && setTimeout(() => {
      notes.value = ''
      client.value = {}
    }, 300)
  }

  return {
    notes,
    client,
    enterPath,
    outPath,
  }
}
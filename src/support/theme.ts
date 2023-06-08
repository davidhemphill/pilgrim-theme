import { ComputerDesktopIcon, MoonIcon, SunIcon } from '@heroicons/vue/20/solid'
import { useColorMode } from '@vueuse/core'
import { computed } from 'vue'

export function useThemeSwitching() {
  const { system, store } = useColorMode()

  const currentMode = computed(() =>
    store.value === 'auto' ? system.value : store.value
  )

  type Mode = 'light' | 'dark' | 'auto'
  type Icon = typeof ComputerDesktopIcon | typeof MoonIcon | typeof SunIcon

  type UIMode = {
    text: string
    value: Mode
    icon: Icon
  }

  const modes: UIMode[] = [
    { text: 'Light', value: 'light', icon: SunIcon },
    { text: 'Dark', value: 'dark', icon: MoonIcon },
    { text: 'System', value: 'auto', icon: ComputerDesktopIcon },
  ]

  const currentModeLabel = computed(
    () => modes.filter(m => m.value === store.value)[0].text
  )

  const currentModeIcon = computed(
    () => modes.filter(m => m.value === currentMode.value)[0].icon
  )

  function handleClick(mode: Mode) {
    store.value = mode
  }

  function handleChange(mode: Mode) {
    store.value = mode
  }

  return {
    modes,
    currentMode: store,
    currentModeLabel,
    currentModeIcon,
    handleClick,
    handleChange,
  }
}

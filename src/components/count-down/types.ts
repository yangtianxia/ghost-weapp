import type { ComponentPublicInstance } from 'vue'
import type { CountDownProps } from './CountDown'
import type { CurrentTime } from '@/hooks/count-down'

type CountDownExpose = {
  start: () => void
  pause: () => void
  reset: () => void
}

export type CountDownInstance = ComponentPublicInstance<CountDownProps, CountDownExpose>

export type CountDownCurrentTime = CurrentTime

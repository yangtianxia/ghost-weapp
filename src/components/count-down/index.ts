import type { JSXShim } from '../_utils/types'
import { withInstall } from '../_utils/with-install'
import _CountDown, { type CountDownProps } from './CountDown'

import './index.less'

export const CountDown = withInstall(_CountDown)
export default CountDown

export { countDownProps } from './CountDown'
export type { CountDownProps } from './CountDown'
export type { CountDownInstance, CountDownCurrentTime } from './types'

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'tx-count-down': JSXShim<CountDownProps>
    }
  }
}

export {}

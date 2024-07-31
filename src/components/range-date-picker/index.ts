import type { JSXShim } from '../_utils/types'
import { withInstall } from '../_utils/with-install'
import _RangeDatePicker, { type RangeDatePickerProps } from './RangeDatePicker'

import './index.less'

export const RangeDatePicker = withInstall(_RangeDatePicker)
export default RangeDatePicker

export type { RangeDatePickerProps } from './RangeDatePicker'
export { isInvalidDate, isEarlierDate } from './utils'

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'tx-range-date-picker': JSXShim<RangeDatePickerProps>
    }
  }
}

export {}

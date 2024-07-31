import type { JSXShim } from '../_utils/types'
import { withInstall } from '../_utils/with-install'
import _Alert, { type AlertProps } from './Alert'

import './index.less'

export const Alert = withInstall(_Alert)
export default Alert

export * from './types'
export type { AlertProps } from './Alert'

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'tx-alert': JSXShim<AlertProps>
    }
  }
}

export {}

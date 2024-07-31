import type { JSXShim } from '../_utils/types'
import { withInstall } from '../_utils/with-install'
import _Icon, { type IconProps } from './Icon'

import './index.less'

export const Icon = withInstall(_Icon)
export default Icon

export * from './utils'
export type { IconProps } from './Icon'

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'tx-icon': JSXShim<IconProps>
    }
  }
}

export {}

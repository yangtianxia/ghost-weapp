import type { JSXShim } from '../_utils/types'
import { withInstall } from '../_utils/with-install'
import _SafeArea, { SafeAreaProps } from './SafeArea'

import './index.less'

export const SafeArea = withInstall(_SafeArea)
export default SafeArea

export type { SafeAreaProps } from './SafeArea'

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'tx-safe-area': JSXShim<SafeAreaProps>
    }
  }
}

export {}

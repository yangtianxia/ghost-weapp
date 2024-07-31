import type { JSXShim } from '../_utils/types'
import { withInstall } from '../_utils/with-install'
import _FloatPanel, { type FloatPanelProps } from './FloatPanel'

import './index.less'

export const FloatPanel = withInstall(_FloatPanel)
export default FloatPanel

export type { FloatPanelProps } from './FloatPanel'

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'tx-float-panel': JSXShim<FloatPanelProps>
    }
  }
}

export {}

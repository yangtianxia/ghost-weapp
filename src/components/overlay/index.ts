import type { JSXShim } from '../_utils/types'
import { withInstall } from '../_utils/with-install'
import _Overlay, { type OverlayProps } from './Overlay'

import './index.less'

export const Overlay = withInstall(_Overlay)
export default Overlay

export { overlaySharedProps } from './Overlay'
export type { OverlayProps } from './Overlay'

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'tx-overlay': JSXShim<OverlayProps>
    }
  }
}

export {}

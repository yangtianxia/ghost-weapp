import type { JSXShim } from '../_utils/types'
import { withInstall } from '../_utils/with-install'
import _Sticky, { type StickyProps } from './Sticky'

import './index.less'

export const Sticky = withInstall(_Sticky)
export default Sticky

export { stickyProps } from './Sticky'
export type { StickyScrollOptions, StickyProps } from './Sticky'

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'tx-sticky': JSXShim<StickyProps>
    }
  }
}

export {}

import type { JSXShim } from '../_utils/types'
import { withInstall } from '../_utils/with-install'
import _Space, { SpaceProps } from './Space'

import './index.less'

export const Space = withInstall(_Space)
export default Space

export { spaceProps } from './Space'
export type { SpaceProps } from './Space'
export * from './types'

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'tx-space': JSXShim<SpaceProps>
    }
  }
}

export {}

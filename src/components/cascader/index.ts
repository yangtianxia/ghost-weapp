import type { JSXShim } from '../_utils/types'
import { withInstall } from '../_utils/with-install'
import _Cascader, { type CascaderProps } from './Cascader'

import './index.less'

export const Cascader = withInstall(_Cascader)
export default Cascader

export * from './types'
export type { CascaderProps } from './Cascader'

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'tx-cascader': JSXShim<CascaderProps>
    }
  }
}

export {}

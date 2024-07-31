import type { ComponentPublicInstance } from 'vue'
import type { JSXShim } from '../_utils/types'
import { withInstall } from '../_utils/with-install'
import _List, { type ListProps, type ListProvide } from './List'

import './index.less'

export const List = withInstall(_List)
export default List

export type ListInstance = ComponentPublicInstance<ListProps, ListProvide>

export type { ListProps } from './List'

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'tx-list': JSXShim<ListProps>
    }
  }
}

export {}

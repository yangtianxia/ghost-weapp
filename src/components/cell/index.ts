import type { App } from 'vue'
import type { JSXShim } from '../_utils/types'
import { withInstall } from '../_utils/with-install'
import _Cell, { type CellProps } from './Cell'
import _Group, { type CellGroupProps } from './Group'

import './index.less'

export const CellGroup = withInstall(_Group)
export const Cell = withInstall(_Cell, { Group: CellGroup })

const cellInstall = Cell.install

Cell.install = (app: App) => {
  CellGroup.install(app)
  cellInstall(app)
}

export default Cell

export { cellSharedProps } from './utils'
export type { CellProps } from './Cell'
export type { CellGroupProps } from './Group'
export * from './types'

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'tx-cell': JSXShim<CellProps>
      'tx-cell-group': JSXShim<CellGroupProps>
    }
  }
}

export {}

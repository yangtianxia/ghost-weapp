import type { App } from 'vue'
import type { JSXShim } from '../_utils/types'
import { withInstall } from '../_utils/with-install'
import _Row, { RowProps } from './Row'
import _Col, { ColProps } from './Col'

import './index.less'

export const Col = withInstall(_Col)
export const Row = withInstall(_Row, { Col })

const rowInstall = Row.install

Row.install = (app: App) => {
  Col.install(app)
  rowInstall(app)
}

export default Row

export type { ColProps } from './Col'
export type { RowProps } from './Row'

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'tx-row': JSXShim<RowProps>
      'tx-col': JSXShim<ColProps>
    }
  }
}

export {}

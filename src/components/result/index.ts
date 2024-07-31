import type { JSXShim } from '../_utils/types'
import { withInstall } from '../_utils/with-install'
import _Result, { type ResultProps } from './Result'

import './index.less'

export const Result = withInstall(_Result)
export default Result

export * from './types'
export { resultSharedProps } from './utils'

export type { ResultProps } from './Result'

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'tx-result': JSXShim<ResultProps>
    }
  }
}

export {}

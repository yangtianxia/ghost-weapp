import type { JSXShim } from '../_utils/types'
import { withInstall } from '../_utils/with-install'
import _ActionSheet, { type ActionSheetProps } from './ActionSheet'

import './index.less'

export const ActionSheet = withInstall(_ActionSheet)
export default ActionSheet

export { actionSheetProps } from './ActionSheet'
export type { ActionSheetProps, ActionSheetOption } from './ActionSheet'

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'tx-action-sheet': JSXShim<ActionSheetProps>
    }
  }
}

export {}

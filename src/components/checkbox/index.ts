import type { App } from 'vue'
import type { JSXShim } from '../_utils/types'
import { withInstall } from '../_utils/with-install'
import _Group, { type CheckboxGroupProps } from './Group'
import _Checkbox, { type CheckboxProps } from './Checkbox'

import './index.less'

export const CheckboxGroup = withInstall(_Group)
export const Checkbox = withInstall(_Checkbox, { Group: CheckboxGroup })

const checkboxInstall = Checkbox.install

Checkbox.install = (app: App) => {
  CheckboxGroup.install(app)
  checkboxInstall(app)
}

export default Checkbox

export { checkboxGroupProps } from './Group'
export { checkboxProps } from './Checkbox'

export type { CheckboxProps } from './Checkbox'
export type { CheckboxGroupProps } from './Group'

export type {
 CheckboxShape,
 CheckboxInstance,
 CheckboxLabelPosition,
 CheckboxGroupDirection,
 CheckboxGroupToggleAllOptions,
 CheckboxGroupInstance
} from './types'

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'tx-checkbox-group': JSXShim<CheckboxGroupProps>
      'tx-checkbox': JSXShim<CheckboxProps>
    }
  }
}

export {}

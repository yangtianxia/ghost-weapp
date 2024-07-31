import type { App } from 'vue'
import type { JSXShim } from '../_utils/types'
import { withInstall } from '../_utils/with-install'
import _Form, { type FormProps } from './Form'
import _Field, { type FieldProps } from './Field'

import './index.less'

export const Field = withInstall(_Field)
export const Form = withInstall(_Form, { Field })

const formInstall = Form.install

Form.install = (app: App) => {
  Field.install(app)
  formInstall(app)
}

export default Form

export * from './types'
export type { FieldProps } from './Field'
export type { FormProps } from './Form'

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'tx-form': JSXShim<FormProps>
      'tx-field': JSXShim<FieldProps>
    }
  }
}

export {}

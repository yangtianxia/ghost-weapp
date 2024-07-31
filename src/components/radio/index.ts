import type { App } from 'vue'
import type { JSXShim } from '../_utils/types'
import { withInstall } from '../_utils/with-install'
import _Group, { type RadioGroupProps } from './Group'
import _Radio, { type RadioProps } from './Radio'

import './index.less'

export const RadioGroup = withInstall(_Group)
export const Radio = withInstall(_Radio, { Group: RadioGroup })

const radioInstall = Radio.install

Radio.install = (app: App) => {
  RadioGroup.install(app)
  radioInstall(app)
}

export default Radio

export { radioGroupProps } from './Group'
export { radioProps } from './Radio'

export type { RadioGroupProps } from './Group'
export type { RadioProps, RadioShape, RadioLabelPosition } from './Radio'

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'tx-radio-group': JSXShim<RadioGroupProps>
      'tx-radio': JSXShim<RadioProps>
    }
  }
}

export {}

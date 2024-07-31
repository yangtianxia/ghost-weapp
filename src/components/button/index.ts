import type { App } from 'vue'
import type { JSXShim } from '../_utils/types'
import { withInstall } from '../_utils/with-install'
import _Button, { type ButtonProps } from './Button'
import _ButtonCountDown, { type ButtonCountDownProps } from './CountDown'

import './index.less'

export const CountDown = withInstall(_ButtonCountDown)
export const Button = withInstall(_Button, { CountDown })

const buttonInstall = Button.install

Button.install = (app: App) => {
  CountDown.install(app)
  buttonInstall(app)
}

export default Button

export type { ButtonProps } from './Button'
export type { ButtonCountDownProps } from './CountDown'

export * from './types'
export * from './utils'

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'tx-button': JSXShim<ButtonProps>
      'tx-button-count-down': JSXShim<ButtonCountDownProps>
    }
  }
}

export {}

import type { App } from 'vue'
import type { JSXShim } from '../_utils/types'
import { withInstall } from '../_utils/with-install'
import _Popup, { Content as _Content, Footer as _Footer, type PopupProps } from './Popup'

import './index.less'

export const PopupContent = withInstall(_Content)
export const PopupFooter = withInstall(_Footer)
export const Popup = withInstall(_Popup, {
  Content: PopupContent,
  Footer: PopupFooter
})

const popupInstall = Popup.install

Popup.install = (app: App) => {
  PopupContent.install(app)
  PopupFooter.install(app)
  popupInstall(app)
}

export default Popup

export { popupProps, POPUP_KEY } from './Popup'
export type { PopupProps } from './Popup'

export * from './types'
export * from './utils'

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'tx-popup': JSXShim<PopupProps>
      'tx-popup-content': JSXShim<any>
      'tx-popup-footer': JSXShim<any>
    }
  }
}

export {}

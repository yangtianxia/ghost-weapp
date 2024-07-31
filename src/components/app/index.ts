import type { App as VueApp } from 'vue'
import type { JSXShim } from '../_utils/types'
import { withInstall } from '../_utils/with-install'
import _App, { type AppProps } from './App'
import _Body, { type BodyProps } from './Body'

import './index.less'

export const Body = withInstall(_Body)
export const App = withInstall(_App, { Body })

const appInstall = App.install

App.install = (app: VueApp) => {
  Body.install(app)
  appInstall(app)
}

export default App

export type { AppProps } from './App'
export type { BodyProps } from './Body'

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'tx-app': JSXShim<AppProps>
      'tx-body': JSXShim<BodyProps>
    }
  }
}

export {}

import type { App } from 'vue'
import type { JSXShim } from '../_utils/types'
import { withInstall } from '../_utils/with-install'
import _Tabs, { type TabsProps } from './Tabs'
import _Tab, { type TabProps } from './Tab'

import './index.less'

export const Tab = withInstall(_Tab)
export const Tabs = withInstall(_Tabs, { Item: Tab })

const tabInstall = Tab.install

Tab.install = (app: App) => {
  Tab.install(app)
  tabInstall(app)
}

export default Tab

export type { TabsProps } from './Tabs'
export type { TabProps } from './Tab'

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'tx-tabs': JSXShim<TabsProps>
      'tx-tab': JSXShim<TabProps>
    }
  }
}

export {}

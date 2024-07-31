import { defineComponent } from 'vue'

import { App } from '@/components/app'
import { CountDown } from '@/components/count-down'

import less from './index.module.less'

definePageConfig({
  navigationStyle: 'default',
  navigationBarTitleText: 'count-down'
})

const [name] = BEM('count-down', less)

export default defineComponent({
  name,

  setup() {
    return () => (
      <App loading={false}>
        <App.Body>
          <CountDown time={24 * 60 * 60 * 1000} />
          <CountDown time={24 * 60 * 60 * 1000} millisecond />
        </App.Body>
      </App>
    )
  }
})

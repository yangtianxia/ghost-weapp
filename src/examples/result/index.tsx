import { defineComponent } from 'vue'

import { App } from '@/components/app'
import { Result } from '@/components/result'

import less from './index.module.less'

definePageConfig({
  navigationStyle: 'default',
  navigationBarTitleText: 'result'
})

const [name] = BEM('result', less)

export default defineComponent({
  name,

  setup() {
    return () => (
      <App loading={false}>
        <App.Body>
          <Result status="500" />
          <Result status="404" />
          <Result status="error" />
          <Result status="network" />
          <Result status="nodata" />
        </App.Body>
      </App>
    )
  }
})

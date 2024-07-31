import { defineComponent, ref } from 'vue'
import { App } from '@/components/app'
import { Button } from '@/components/button'
import { FloatPanel } from '@/components/float-panel'

import less from './index.module.less'

definePageConfig({
  navigationStyle: 'default',
  navigationBarTitleText: 'float-panel'
})

const [name] = BEM('float-panel', less)

export default defineComponent({
  name,

  setup() {
    const show = ref(false)

    return () => (
      <App loading={false}>
        <App.Body>
          <Button onTap={() => show.value = true}>显示</Button>
          <FloatPanel>
            <Button block>按钮1</Button>
            {show.value ? <Button block>按钮2</Button> : null}
          </FloatPanel>
        </App.Body>
      </App>
    )
  }
})

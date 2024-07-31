// Vue
import { defineComponent } from 'vue'

// Component
import { App } from '@/components/app'

// Style
import less from './index.module.less'

const [name] = BEM('index', less)

export default defineComponent({
  name,

  setup() {
    return () => (
      <App loading={false}>
        <App.Body></App.Body>
      </App>
    )
  }
})

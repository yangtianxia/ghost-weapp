import { defineComponent, reactive } from 'vue'
import { App } from '@/components/app'
import { Cell } from '@/components/cell'
import { ActionSheet } from '@/components/action-sheet'

import less from './index.module.less'

definePageConfig({
  navigationStyle: 'default',
  navigationBarTitleText: 'action-sheet'
})

const [name] = BEM('action-sheet', less)

export default defineComponent({
  name,

  setup() {
    const model = reactive({
      show1: false
    })

    return () => (
      <App loading={false}>
        <App.Body>
          <Cell.Group inset>
            <Cell
              isLink
              title="默认使用"
              onTap={() => model.show1 = true}
            />
          </Cell.Group>
        </App.Body>
        <ActionSheet
          v-model:show={model.show1}
          description="请选择原因"
          actions={[
            { title: '选项1', color: 'red' },
            { title: '选项2' },
            { title: '禁用', disabled: true },
            { title: '选项4', loading: true },
            { title: '选项5', label: '这里是选项描述' },
            { title: '选项6' }
          ]}
        />
      </App>
    )
  }
})

import { defineComponent, reactive } from 'vue'
import { App } from '@/components/app'
import { Cell } from '@/components/cell'
import { Popup } from '@/components/popup'

import less from './index.module.less'

definePageConfig({
  navigationBarTitleText: 'popup'
})

const [name] = BEM('popup', less)

export default defineComponent({
  name,

  setup() {
    const model = reactive({
      top: false,
      bottom: false,
      left: false,
      right: false,
      center: false
    })

    return () => (
      <App loading={false}>
        <App.Body>
          <Cell.Group inset>
            <Cell
              isLink
              title="center"
              onTap={() => model.center = true}
            />
            <Cell
              isLink
              title="top"
              onTap={() => model.top = true}
            />
            <Cell
              isLink
              title="bottom"
              onTap={() => model.bottom = true}
            />
            <Cell
              isLink
              title="left"
              onTap={() => model.left = true}
            />
            <Cell
              isLink
              title="right"
              onTap={() => model.right = true}
            />
          </Cell.Group>
          <Popup
            v-model:show={model.center}
            round
            position="center"
          >
            <view style={{ width: '200px', height: '200px' }}></view>
          </Popup>
          <Popup
            v-model:show={model.top}
            round
            position="top"
            closeIconPosition="bottom-right"
          >
            <view style={{ height: '200px' }}></view>
          </Popup>
          <Popup
            v-model:show={model.bottom}
            round
            titleBorder
            closeable
            safeAreaInsetTop
            safeAreaInsetBottom
            title="设置产品价格"
            position="bottom"
            style={{ height: '100%', width: '100%' }}
          >
            <Popup.Content>
              <view style={{ height: '1000px' }}></view>
            </Popup.Content>
          </Popup>
          <Popup
            v-model:show={model.left}
            position="left"
            style={{ height: '100%', width: '80%' }}
          >
          </Popup>
          <Popup
            v-model:show={model.right}
            closeable
            safeAreaInsetTop
            safeAreaInsetBottom
            title="设置产品价格"
            position="right"
            style={{ height: '100%', width: '100%' }}
          >
          </Popup>
        </App.Body>
      </App>
    )
  }
})

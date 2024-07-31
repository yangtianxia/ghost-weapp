import { defineComponent } from 'vue'
import { App } from '@/components/app'
import { Cell } from '@/components/cell'
import less from './index.module.less'

definePageConfig({
  navigationStyle: 'default',
  navigationBarTitleText: 'cell'
})

const [name] = BEM('cell', less)

export default defineComponent({
  name,

  setup() {
    return () => (
      <App loading={false}>
        <App.Body>
          <Cell.Group title="基础用法">
            <Cell title="单元格" value="内容" />
            <Cell title="单元格" label="描述信息" value="内容" />
          </Cell.Group>
          <Cell.Group inset title="卡片风格">
            <Cell title="单元格" value="内容" />
            <Cell title="单元格" label="描述信息" value="内容" />
          </Cell.Group>
          <Cell.Group title="收缩单元">
            <view style={{ padding: '0 32rpx' }}>
              <Cell shrink={false} title="单元格" value="内容" />
              <Cell shrink={false} title="单元格" label="描述信息" value="内容" />
            </view>
          </Cell.Group>
          <Cell.Group title="单元格大小">
            <Cell size="large" title="单元格" value="内容" />
            <Cell size="large" title="单元格" label="描述信息" value="内容" />
          </Cell.Group>
          <Cell.Group title="展示图标">
            <Cell icon="location-o" title="单元格" value="内容" />
            <Cell required title="单元格" value="内容" />
          </Cell.Group>
          <Cell.Group title="展示箭头">
            <Cell title="单元格" isLink />
            <Cell title="单元格" value="内容" isLink />
            <Cell arrowDirection="down" title="单元格" value="内容" isLink />
          </Cell.Group>
          <Cell.Group title="页面跳转">
            <Cell url="home" linkQuery={{ id: 12 }} linkType="reLaunch" title="单元格" isLink />
          </Cell.Group>
        </App.Body>
      </App>
    )
  }
})

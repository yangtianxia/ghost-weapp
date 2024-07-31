// Vue
import {
  defineComponent,
  watch,
  type ExtractPropTypes
} from 'vue'

// Common
import { useChildren } from '@/hooks/relation'

// Components
import type { CellInstance } from './Cell'

// Component utils
import { createVNode, createInjectionKey } from '../_utils/basic'
import { VNodeProp, truthProp, numericProp } from '../_utils/props'

const [name, bem] = BEM('cell-group')

const cellGroupProps = {
  title: VNodeProp,
  inset: Boolean,
  border: truthProp,
  shrink: Boolean,
  titleWidth: numericProp
}

export type CellGroupProps = ExtractPropTypes<typeof cellGroupProps>

export type CellGroupProvide = {
  props: CellGroupProps
}

export const CELL_GROUP_KEY = createInjectionKey<CellGroupProvide>(name)

export default defineComponent({
  name,

  inheritAttrs: false,

  props: cellGroupProps,

  setup(props, { slots, attrs }) {
    const { children, linkChildren } = useChildren<CellInstance, CellGroupProvide>(CELL_GROUP_KEY)

    const updateChild = () => {
      const { length } = children
      if (length) {
        children.forEach((cell, index) => {
          cell.updateBorder(
            length - 1 === index
              ? false
              : cell.internalBorder
          )
        })
      }
    }

    watch(
      () => children.length,
      () => updateChild()
    )

    linkChildren({ props })

    const renderGroup = () => {
      const { inset, shrink } = props
      return (
        <view
          {...attrs}
          class={[
            bem({ inset, shrink }),
            { 'hairline-surround': props.border && !inset }
          ]}
        >
          {slots.default?.()}
        </view>
      )
    }

    const renderTitle = () => {
      const title = createVNode(slots.title || props.title)
      if (title) {
        return (
          <view class={bem('title', { inset: props.inset })}>
            {title}
          </view>
        )
      }
    }

    return () => [
      renderTitle(),
      renderGroup()
    ]
  }
})

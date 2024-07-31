// Vue
import {
  defineComponent,
  ref,
  computed,
  type Ref,
  type CSSProperties,
  type ExtractPropTypes,
  type ComponentPublicInstance
} from 'vue'

// Taro
import type { ITouchEvent } from '@tarojs/components'

// Common
import { shallowMerge } from '@txjs/shared'
import { makeString } from '@txjs/make'
import { isNil } from '@txjs/bool'
import { useParent } from '@/hooks/relation'
import { useExpose } from '@/hooks/expose'

// Components
import { Icon, iconSharedProps } from '../icon'
import { CELL_GROUP_KEY } from './Group'

// Component utils
import { jumpLinkSharedProps, jumpLink } from '../mixins/jump-link'
import { createVNode } from '../_utils/basic'
import { addUnit } from '../_utils/style'
import { cellSharedProps } from './utils'

const [name, bem] = BEM('cell')

const callProps = shallowMerge({}, jumpLinkSharedProps, iconSharedProps, cellSharedProps)

export type CellProps = ExtractPropTypes<typeof callProps>

export type CellProvide = {
  internalBorder: Ref<boolean>
  updateBorder(value: boolean): void
}

export type CellInstance = ComponentPublicInstance<CellProps, CellProvide>

export default defineComponent({
  name,

  props: callProps,

  setup(props, { slots }) {
    const { parent } = useParent(CELL_GROUP_KEY)

    const internalBorder = ref(
      isNil(props.border) || props.border
    )
    const titleWidth = computed(() =>
      props.titleWidth || parent?.props.titleWidth
    )
    const titleStyle = computed(() => {
      const style = {} as CSSProperties

      if (titleWidth.value) {
        style.minWidth = addUnit(titleWidth.value)
        style.maxWidth = style.minWidth
      }

      if (props.titleStyle) {
        shallowMerge(style, props.titleStyle)
      }

      return style
    })

    const updateBorder = (value: boolean) => {
      // 通过设置 `border=true` 不受此方法控制
      if (props.border === true) return
      internalBorder.value = value
    }

    const onTap = (event: ITouchEvent) => {
      props.onTap?.(event)

      if (props.url) {
        jumpLink(
          props.url,
          props.linkQuery,
          props.linkType,
          props.linkBefore
        )
      }
    }

    useExpose({ updateBorder, internalBorder })

    const renderLeftIcon = () => {
      if (slots.icon) {
        return slots.icon()
      }

      if (props.icon) {
        return (
          <view class={bem('left-icon')}>
            <Icon name={props.icon} />
          </view>
        )
      }
    }

    const renderLabel = () => {
      const label = createVNode(slots.label || props.label)
      if (label) {
        return (
          <view class={[bem('label'), props.labelClass]}>
            {label}
          </view>
        )
      }
    }

    const renderTitle = () => {
      const title = createVNode(slots.title || props.title, {
        render: (value) => <text>{value}</text>
      })
      if (title) {
        return (
          <view
            class={[bem('title'), props.titleClass]}
            style={titleStyle.value}
          >
            {title}
            {renderLabel()}
          </view>
        )
      }
    }

    const renderValue = () => {
      const value = createVNode(slots.value || slots.default || props.value, {
        render: (value) => <text>{value}</text>
      })
      if (value) {
        return (
          <view class={[bem('value'), props.valueClass]}>
            {value}
          </view>
        )
      }
    }

    const renderRightIcon = () => {
      if (slots['right-icon']) {
        return slots['right-icon']()
      }

      if (props.isLink) {
        const name = props.rightIcon || makeString(
          props.arrowDirection && props.arrowDirection !== 'right'
            ? `arrow-${props.arrowDirection}`
            : 'arrow'
        )
        return (
          <view class={bem('right-icon')}>
            <Icon name={name} />
          </view>
        )
      }
    }

    return () => {
      const { size, center,  shrink, isLink, required } = props
      const clickable = props.clickable ?? isLink

      const classes: Record<string, boolean | undefined> = {
        center,
        required,
        clickable,
        shrink,
        borderless: !internalBorder.value
      }

      if (size) {
        classes[size] = !!size
      }

      return (
        <view
          class={bem(classes)}
          hoverClass={bem('hover')}
          hoverStayTime={70}
          role={clickable ? 'button' : undefined}
          onTap={onTap}
        >
          {renderLeftIcon()}
          {renderTitle()}
          {renderValue()}
          {renderRightIcon()}
          {slots.extra?.()}
        </view>
      )
    }
  }
})

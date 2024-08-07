// Vue
import {
  defineComponent,
  computed,
  type ExtractPropTypes,
  type CSSProperties
} from 'vue'

// Taro
import { Button, type ITouchEvent } from '@tarojs/components'

// Common
import { shallowMerge, pick } from '@txjs/shared'

// Component
import { Icon, iconSharedProps } from '../icon'
import { Loading } from '../loading'

// Component utils
import { jumpLinkSharedProps, jumpLink } from '../mixins/jump-link'
import { createVNode } from '../_utils/basic'
import { preventDefault } from '../_utils/event'
import { addUnit } from '../_utils/style'
import { buttonNativeProps, buttonSharedProps, buttonNativePropKeys } from './utils'

const [name, bem] = BEM('button')

const buttonProps =  shallowMerge(shallowMerge({}, jumpLinkSharedProps, iconSharedProps, buttonSharedProps), buttonNativeProps)

export type ButtonProps = ExtractPropTypes<typeof buttonProps>

export default defineComponent({
  name,

  props: buttonProps,

  setup(props, { slots }) {
    const rootStyle = computed(() => {
      const style = {} as CSSProperties
      const { color, plain, block, width } = props

      if (color) {
        if (plain) {
          style.color = color
          style.background = color
        } else {
          style.color = 'var(--color-white)'
        }
        style.borderColor = color.includes('gradient') ? 'transparent' : color
      }

      if (!block && width) {
        style.width = addUnit(width)
        style.display = 'flex'
      }

      return style
    })

    const onClick = (event: ITouchEvent) => {
      if (props.loading) {
        preventDefault(event)
      } else if (!props.disabled) {
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
    }

    const renderText = () => {
      const childVNode = createVNode(
        props.loading
          ? props.loadingText
          : slots.default || props.text
      )

      if (childVNode) {
        return (
          <view class={bem('text')}>
            {childVNode}
          </view>
        )
      }
    }

    const renderIcon = () => {
      if (props.loading) {
        return (
          <Loading class={bem('loading')} />
        )
      }

      if (slots.icon) {
        return (
          <view class={bem('icon')}>
            {slots.icon?.()}
          </view>
        )
      }

      if (props.icon) {
        return (
          <view class={bem('icon', [props.icon])}>
            <Icon
              size={props.iconSize}
              name={props.icon}
            />
          </view>
        )
      }
    }

    return () => {
      const {
        type,
        size,
        link,
        block,
        round,
        plain,
        square,
        loading,
        disabled,
        danger,
        border,
        iconPosition
      } = props

      const cls = [
        bem([
          type,
          size,
          danger,
          {
            link,
            block,
            round,
            square,
            loading,
            disabled,
            plain: link || plain,
            hairline: plain && border,
            unclickable: disabled || loading
          }
        ])
      ]

      const state = pick(props, buttonNativePropKeys)

      if (props.loading || props.disabled) {
        delete state.formType
      }

      return (
        <Button
          {...state}
          class={cls}
          hoverClass={bem('active')}
          style={rootStyle.value}
          onTap={onClick}
        >
          {iconPosition === 'left' && renderIcon()}
          {renderText()}
          {iconPosition === 'right' && renderIcon()}
        </Button>
      )
    }
  }
})

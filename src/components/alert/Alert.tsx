// Types
import type { AlertType } from './types'

// Vue
import {
  defineComponent,
  ref,
  computed,
  Transition,
  type PropType,
  type ExtractPropTypes
} from 'vue'

// Taro
import type { ITouchEvent } from '@tarojs/components'

// Common
import { shallowMerge } from '@txjs/shared'

// Components
import { Icon, iconSharedProps } from '../icon'

// Component utils
import { createVNode } from '../_utils/basic'
import { VNodeProp } from '../_utils/props'

const [name, bem] = BEM('alert')

const alertProps = shallowMerge({}, iconSharedProps, {
  banner: Boolean,
  showIcon: Boolean,
  closable: Boolean,
  message: VNodeProp,
  description: VNodeProp,
  closeText: VNodeProp,
  type: String as PropType<AlertType>,
  onClose: Function as PropType<(event: ITouchEvent) => void>,
  onMessageClick: Function as PropType<(event: ITouchEvent) => void>
})

export type AlertProps = ExtractPropTypes<typeof alertProps>

export default defineComponent({
  name,

  props: alertProps,

  setup(props, { slots }) {
    const closing = ref(false)
    const closed = ref(false)

    const type = computed(() =>
      props.type || (props.banner ? 'warning' : 'info')
    )
    const description = computed(() =>
      createVNode(slots.description || props.description)
    )
    const iconName = computed(() => {
      if (props.icon) {
        return props.icon
      }

      if (description.value) {
        switch (type.value) {
          case 'info':
            return 'info-o'
          case 'success':
            return 'passed'
          case 'warning':
            return 'warning-o'
          case 'error':
            return 'close'
        }
      }

      switch (type.value) {
        case 'info':
          return 'info'
        case 'success':
          return 'checked'
        case 'error':
          return 'clear'
        case 'warning':
        default:
          return 'warning'
      }
    })

    const onClose = (event: ITouchEvent) => {
      closing.value = true
      props.onClose?.(event)
    }

    const onMessageClick = (event: ITouchEvent) => {
      props.onMessageClick?.(event)
    }

    const renderIcon = () => {
      if (props.showIcon || props.banner) {
        if (slots.icon) {
          return slots.icon()
        }

        if (iconName.value) {
          return (
            <view class={bem('icon')}>
              <Icon
                name={iconName.value}
                size={props.iconSize}
              />
            </view>
          )
        }
      }
    }

    const renderMessage = () => {
      const message = createVNode(slots.message || props.message)
      if (message) {
        return (
          <view
            class={bem('message')}
            onTap={onMessageClick}
          >
            {message}
          </view>
        )
      }
    }

    const renderDescription = () => {
      if (description.value) {
        return (
          <view class={bem('description')}>
            {description.value}
          </view>
        )
      }
    }

    const renderAction = () => {
      if (slots.action) {
        return (
          <view class={bem('action')}>
            {slots.action()}
          </view>
        )
      }
    }

    const renderCloseIcon = () => {
      if (props.closable) {
        const close = createVNode(slots.closeIcon || props.closeText, {
          render: (value) => <text>{value}</text>
        })
        return (
          <view
            class={bem('close-icon')}
            onTap={onClose}
          >
            {close || <Icon name="cross" />}
          </view>
        )
      }
    }

    return () => {
      if (closed.value) return

      return (
        <Transition
          name="alert-fade"
          onAfterLeave={() => closed.value = true}
        >
          <view
            v-show={!closing.value}
            class={bem([type.value, {
              banner: props.banner,
              'with-description': description.value
            }])}
          >
            {renderIcon()}
            <view class={bem('content')}>
              {renderMessage()}
              {renderDescription()}
            </view>
            {renderAction()}
            {renderCloseIcon()}
          </view>
        </Transition>
      )
    }
  }
})

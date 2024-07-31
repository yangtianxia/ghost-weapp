// Types
import type { ButtonSize } from './types'

// Vue
import {
  defineComponent,
  reactive,
  type PropType,
  type ExtractPropTypes
} from 'vue'

// Common
import {
  pick,
  shallowMerge,
  callInterceptor,
  type Interceptor
} from '@txjs/shared'
import { useCountDown } from '@/hooks/count-down'

// Components
import Button from './Button'

// Component utils
import { createVNode } from '../_utils/basic'
import { VNodeProp, makeNumberProp, makeStringProp } from '../_utils/props'
import { buttonSharedProps, buttonPropKeys } from './utils'

const [name, bem] = BEM('button-count-down')

const buttonCountDownProps = shallowMerge({}, buttonSharedProps, {
  timing: makeNumberProp(60),
  size: makeStringProp<ButtonSize>('mini'),
  beforeText: makeStringProp('[S] 秒后重发'),
  text: {
    type: VNodeProp,
    default: '获取验证码'
  },
  afterText: {
    type: VNodeProp,
    default: '重新获取'
  },
  beforeChange: Function as PropType<Interceptor>
})

export type ButtonCountDownProps = ExtractPropTypes<typeof buttonCountDownProps>

export default defineComponent({
  name,

  props: buttonCountDownProps,

  setup(props, { slots }) {
    const state = reactive({
      timing: props.timing,
      disabled: false,
      loading: false,
      finish: false
    })

    const { start, reset } = useCountDown({
      time: state.timing * 1000,
      onChange: ({ total }) => {
        state.timing = Math.floor(total / 1000)
      },
      onFinish: () => {
        state.disabled = false
        state.finish = true
        state.timing = props.timing
        reset()
      }
    })

    const formatText = (value: string) => {
      return value.replace(/^\[S\](.*)?$/g, `${state.timing}$1`)
    }

    const onTap = () => {
      state.loading = true
      callInterceptor(props.beforeChange, {
        done: () => {
          state.disabled = true
          state.finish = false
          state.loading = false
          start()
        },
        canceled: () => {
          state.loading = false
        }
      })
    }

    const renderText = () => {
      const text = state.disabled
        ? formatText(props.beforeText)
        : state.finish
          ? props.afterText
          : slots.default || props.text
      return createVNode(text)
    }

    return () => (
      <Button
        {...pick(shallowMerge({}, props, state), buttonPropKeys)}
        class={bem()}
        onTap={onTap}
      >
        {renderText()}
      </Button>
    )
  }
})

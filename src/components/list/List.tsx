// Vue
import {
  defineComponent,
  ref,
  watch,
  onUpdated,
  type PropType,
  type ExtractPropTypes
} from 'vue'

// Taro
import { useReady, usePageScroll, useReachBottom } from '@tarojs/taro'

// Common
import { shallowMerge } from '@txjs/shared'
import { useSystemInfo } from '@/hooks/system-info'
import { useNextTick } from '@/hooks/next-tick'
import { useSelector } from '@/hooks/selector'
import { useExpose } from '@/hooks/expose'

// Components
import { Loading } from '../loading'
import { Result, resultSharedProps } from '../result'

// Component utils
import { useId } from '../_utils/id'
import { createVNode } from '../_utils/basic'
import { VNodeProp, makeArrayProp, makeStringProp, makeNumericProp } from '../_utils/props'

const [name, bem] = BEM('list')

const listProps = shallowMerge({}, resultSharedProps, {
  error: Boolean,
  loading: Boolean,
  finished: Boolean,
  immediateCheck: Boolean,
  data: makeArrayProp(),
  offset: makeNumericProp(50),
  loadingText:  makeStringProp('加载中'),
  errorText: {
    type: VNodeProp,
    default: '请求失败，点击重新加载'
  },
  finishedText: {
    type: VNodeProp,
    default: '已经到底了'
  },
  onLoad: Function as PropType<() => void>,
  'onUpdate:error': Function as PropType<(value: unknown) => void>,
  'onUpdate:loading': Function as PropType<(value: unknown) => void>
})

export type ListProps = ExtractPropTypes<typeof listProps>

export type ListProvide = {
  check: () => void
}

export default defineComponent({
  name,

  props: listProps,

  setup(props, { slots, emit }) {
    const placeholderId = useId()
    const cilentHeight = useSystemInfo().safeArea?.height ?? 0
    const { bottom, boundingClientRect } = useSelector(`.${placeholderId}`, {
      refs: ['bottom']
    })

    const scrollTop = ref(0)
    const loading = ref(props.loading)

    const load = () => {
      loading.value = true
      emit('update:loading', true)
      props.onLoad?.()
    }

    const check = () => {
      useNextTick(() => {
        if (
          loading.value ||
          props.finished ||
          props.error
        ) return

        boundingClientRect(() => {
          // https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollHeight
          if (
            (cilentHeight + scrollTop.value >= bottom.value - +props.offset) &&
            !loading.value
          ) {
            load()
          }
        })
      })
    }

    const onClickErrorText = () => {
      emit('update:error', false)
      load()
    }

    const renderFinishedText = () => {
      if (!props.finished) return

      if (props.data.length === 0) {
        return (
          <Result status={props.status || 'nodata'} />
        )
      }

      const finished = createVNode(slots.finished || props.finishedText)
      if (finished) {
        return (
          <view class={bem('finished-text')}>
            {finished}
          </view>
        )
      }
    }

    const renderErrorText = () => {
      if (!props.error) return

      const error = createVNode(slots.error || props.errorText)
      if (error) {
        return (
          <view
            class={bem('error-text')}
            onTap={onClickErrorText}
          >
            {error}
          </view>
        )
      }
    }

    const renderLoading = () => {
      if (loading.value && !props.finished) {
        return (
          <view class={bem('loading')}>
            {slots.loading?.() || (
              <Loading size={16}>
                {props.loadingText}
              </Loading>
            )}
          </view>
        )
      }
    }

    watch(
      () => [props.loading, props.finished, props.error],
      check
    )

    useExpose({ check })

    onUpdated(() => {
      loading.value = props.loading
    })

    useReady(() => {
      if (props.immediateCheck) {
        check()
      }
    })

    usePageScroll((payload) => {
      scrollTop.value = payload.scrollTop
    })

    useReachBottom(check)

    return () => (
      <view
        role="feed"
        class={bem()}
        aria-busy={loading.value}
      >
        {slots.default?.()}
        {renderLoading()}
        {renderFinishedText()}
        {renderErrorText()}
        <view class={[bem('placeholder'), placeholderId]} />
      </view>
    )
  }
})

// Vue
import {
  defineComponent,
  computed,
  Transition,
  type PropType,
  type CSSProperties,
  type ExtractPropTypes
} from 'vue'

// Taro
import type { ViewProps, ITouchEvent } from '@tarojs/components'

// Common
import { shallowMerge } from '@txjs/shared'
import { notNil } from '@txjs/bool'

// Component utils
import { useLazyRender } from '../_utils/lazy-render'
import { truthProp, numericProp, unknownProp } from '../_utils/props'
import { getZIndexStyle } from '../_utils/style'
import { preventDefault } from '../_utils/event'

const [name, bem] = BEM('overlay')

export const overlaySharedProps = {
  show: Boolean,
  zIndex: numericProp,
  duration: numericProp,
  className: unknownProp,
  lockScroll: truthProp,
  lazyRender: truthProp,
  customStyle: Object as PropType<CSSProperties>,
  onTouchMove: Function as PropType<ViewProps['onTouchMove']>,
}

const overlayProps = shallowMerge({}, overlaySharedProps)

export type OverlayProps = ExtractPropTypes<typeof overlayProps>

export default defineComponent({
  name,

  inheritAttrs: false,

  props: overlayProps,

  setup(props, { slots, attrs }) {
    const overlayStyle = computed(() => {
      const style = shallowMerge(
        getZIndexStyle(props.zIndex),
        props.customStyle
      )
      if (notNil(props.duration)) {
        style.animationDuration = `${props.duration}s`
      }
      return style
    })

    const lazyRender = useLazyRender(() => props.show || !props.lazyRender)

    const onMove = (event: ITouchEvent) => {
      preventDefault(event, true)
      props.onTouchMove?.(event)
    }

    const renderOverlay = lazyRender(() => (
      <view
        {...attrs}
        v-show={props.show}
        style={overlayStyle.value}
        class={[bem(), props.className]}
        catchMove={props.lockScroll}
        disableScroll={props.lockScroll}
        onTouchmove={onMove}
      >
        {slots.default?.()}
      </view>
    ))

    return () => (
      <Transition
        v-slots={{ default: renderOverlay }}
        name="overlay-fade"
        appear
      />
    )
  }
})

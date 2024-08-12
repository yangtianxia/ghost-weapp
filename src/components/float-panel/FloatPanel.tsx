// Vue
import { defineComponent, type ExtractPropTypes } from 'vue'

// Common
import { useRect } from '@/hooks/rect'

// Components
import { SafeArea } from '../safe-area'

// Component utils
import { useId } from '../_utils/id'
import { truthProp, makeNumericProp } from '../_utils/props'
import { getZIndexStyle } from '../_utils/style'

const [name, bem] = BEM('float-panel')

const floatPanelProps = {
  zIndex: makeNumericProp(610),
  placeholder: truthProp,
  safeAreaInsetBottom: truthProp
}

export type FloatPanelProps = ExtractPropTypes<typeof floatPanelProps>

export default defineComponent({
  name,

  inheritAttrs: false,

  props: floatPanelProps,

  setup(props, { slots, attrs }) {
    const contentId = useId()
    const { height } = useRect(`#${contentId}`, {
      refs: ['height'],
      observe: true
    })

    return () => (
      <view>
        {props.placeholder ? (
          <view style={{ height: `${height.value}px` }} />
        ) : null}
        <view
          {...attrs}
          class={bem()}
          style={getZIndexStyle(props.zIndex)}
        >
          <view
            id={contentId}
            class={bem('content')}
          >
            {slots.default?.()}
          </view>
          <SafeArea show={props.safeAreaInsetBottom}>
            <view class={bem('bottom')} />
          </SafeArea>
        </view>
      </view>
    )
  }
})

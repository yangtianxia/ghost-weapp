// Vue
import {
  defineComponent,
  ref,
  reactive,
  computed,
  watch,
  type PropType,
  type ExtractPropTypes,
  type CSSProperties
} from 'vue'

// Taro
import { usePageScroll, useReady } from '@tarojs/taro'

// Components
import { shallowMerge } from '@txjs/shared'
import { isFunction } from '@txjs/bool'
import { useSelector, useSelectorAll, type SelectorElement } from '@/hooks/selector'

// Component utils
import { useId } from '../_utils/id'
import { addUnit } from '../_utils/style'
import { numericProp, makeNumericProp } from '../_utils/props'
import { getZIndexStyle } from '../_utils/style'

const [name, bem] = BEM('sticky')

export type StickyScrollOptions = {
  scrollTop: number
  height: number
  isFixed: boolean
}

export const stickyProps = {
  zIndex: numericProp,
  offsetTop: makeNumericProp(0),
  container: [String, Function] as PropType<SelectorElement>,
  onScroll: Function as PropType<(options: StickyScrollOptions) => void>,
  onChange: Function as PropType<(isFixed: boolean) => void>
}

export type StickyProps = ExtractPropTypes<typeof stickyProps>

export default defineComponent({
  name,

  props: stickyProps,

  setup(props, { slots }) {
    const rootId = useId()
    const rootRect = useSelector(`#${rootId}`, {
      immediate: false
    })
    const containerRect = useSelector(props.container!)

    const scrollTop = ref(0)
    const state = reactive({
      fixed: false,
      height: 0,
      transform: 0,
      offsetTop: 0
    })

    const offsetTop = computed(() =>
      parseFloat(`${props.offsetTop}`) || 0
    )
    const rootStyle = computed(() => {
      const style = {} as CSSProperties
      if (state.fixed) {
        style.height = addUnit(state.height)
      }
      return style
    })
    const stickyStyle = computed(() => {
      const style = {} as CSSProperties
      if (state.fixed) {
        shallowMerge(style, getZIndexStyle(props.zIndex), {
          height: addUnit(state.height),
          top: addUnit(offsetTop.value)
        })

        if (state.transform) {
          style.transform = `translate3d(0, ${state.transform}px, 0)`
        }
      }
      return style
    })

    const setDataAfterDiff = (data: Record<string, any>) => {
      const diff = Object.keys(data)
        .reduce(
          (ret, key) => {
            if (data[key] !== state[key as keyof typeof state]) {
              ret[key] = data[key]
            }
            return ret
          }, {} as Record<string, any>
        )

      if (Object.keys(diff).length > 0) {
        shallowMerge(state, diff)
      }

      props.onScroll?.({
        scrollTop: scrollTop.value,
        height: state.height,
        isFixed: state.fixed
      })
    }

    const onChange = (fixed: boolean) => {
      props.onChange?.(fixed)
    }

    const onScrollTop = (top: number) => {
      scrollTop.value = top || scrollTop.value

      if (isFunction(props.container)) {
        useSelectorAll([rootRect, containerRect], ([root, container]) => {
          if (offsetTop.value + root.height > container.top + container.height) {
            setDataAfterDiff({
              fixed: false,
              transform: container.height - root.height
            })
          } else if (offsetTop.value > root.top) {
            setDataAfterDiff({
              fixed: true,
              height: root.height,
              transform: 0
            })
          } else {
            setDataAfterDiff({
              fixed: false,
              transform: 0
            })
          }
        })
        return
      }

      rootRect.boundingClientRect((rect) => {
        if (offsetTop.value >= rect.top) {
          setDataAfterDiff({
            fixed: true,
            height: rect.height
          })
        } else {
          setDataAfterDiff({
            fixed: false
          })
        }
      })
    }

    watch(
      () => state.fixed,
      onChange
    )

    useReady(() => onScrollTop(0))

    usePageScroll(({ scrollTop }) => onScrollTop(scrollTop))

    return () => (
      <view
        id={rootId}
        style={rootStyle.value}
      >
        <view
          class={bem({ fixed: state.fixed })}
          style={stickyStyle.value}
        >
          {slots.default?.()}
        </view>
      </view>
    )
  }
})

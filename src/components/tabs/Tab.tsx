// Vue
import {
  defineComponent,
  computed,
  watch,
  getCurrentInstance,
  type ExtractPropTypes
} from 'vue'

// Taro
import type { ITouchEvent } from '@tarojs/components'

// Common
import { isNil } from '@txjs/bool'
import { useSelector } from '@/hooks/selector'
import { useExpose } from '@/hooks/expose'
import { useParent } from '@/hooks/relation'

// Components
import { TABS_KEY } from './Tabs'

// Component utils
import { useId } from '../_utils/id'

const [name, bem] = BEM('tab')

const tabProps = {
  title: String,
  disabled: Boolean,
  name: [Number, String]
}

export type TabProps = ExtractPropTypes<typeof tabProps>

export default defineComponent({
  name,

  props: tabProps,

  setup(props, { slots }) {
    const { parent, index } = useParent(TABS_KEY)

    if (isNil(parent)) {
      throw new Error('Tab必须是Tabs的子组件')
    }

    const rootId = useId()
    const instance = getCurrentInstance()
    const { boundingClientRect, ...rect } = useSelector(`#${rootId}`, {
      refs: ['width', 'height', 'left'],
      callback: () => parent.link(instance!, true)
    })

    const tabKey = computed(() =>
      props.name ?? index.value
    )
    const isActive = computed(() =>
      tabKey.value === parent.props.value
    )
    const canScroll = computed(() =>
      parent.canScroll.value
    )

    const onTabClick = (event: ITouchEvent) => {
      boundingClientRect()
      parent.props.onClickTab?.({
        event,
        name: tabKey.value,
        title: props.title,
        disabled: props.disabled
      })

      if (!props.disabled) {
        parent.activeTab(tabKey.value)
      }
    }

    watch(
      () => isActive.value,
      (value, oldValue) => {
        if (oldValue && value === false) {
          boundingClientRect()
        }
      }
    )

    useExpose({ ...rect, tabKey })

    return () => (
      <view
        id={rootId}
        key={tabKey.value}
        onTap={onTabClick}
        class={bem({
          active: isActive.value,
          disabled: props.disabled
        })}
      >
        <view class={bem('content', { ellipsis: canScroll.value })}>
          {slots.default?.({
            name: tabKey.value,
            active: isActive.value
          }) || (
            <text>{props.title}</text>
          )}
        </view>
      </view>
    )
  }
})

// Vue
import {
  defineComponent,
  computed,
  type ExtractPropTypes
} from 'vue'

// Common
import { isNil, notNil } from '@txjs/bool'
import { useParent } from '@/hooks/relation'

// Components
import { Result } from '../result'
import { APP_KEY } from './App'

// Component utils
import { truthProp } from '../_utils/props'

const [name, bem] = BEM('body')

const bodyProps = {
  shrink: truthProp
}

export type BodyProps = ExtractPropTypes<typeof bodyProps>

export default defineComponent({
  name,

  props: bodyProps,

  setup(props, { slots }) {
    const { parent } = useParent(APP_KEY)

    if (isNil(parent)) {
      throw new Error('Body必须是App的子组件')
    }

    const { status } = parent
    const empty = computed(() => notNil(status.value))

    return () => (
      <view class={bem({ empty: empty.value, shrink: props.shrink })}>
        {empty.value ? <Result status={status.value} /> : slots.default?.()}
      </view>
    )
  }
})

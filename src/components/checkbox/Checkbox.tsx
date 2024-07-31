// Vue
import {
  defineComponent,
  computed,
  watch,
  type PropType,
  type ExtractPropTypes
} from 'vue'

// Common
import { pick, shallowMerge } from '@txjs/shared'
import { useParent } from '@/hooks/relation'
import { useExpose } from '@/hooks/expose'

// Components
import Checker from '../checker'
import { checkerSharedProps } from '../checker/utils'
import { CHECKBOX_GROUP_KEY } from './Group'

// Component utils
import { useFieldValue } from '../_utils/field-value'
import { truthProp } from '../_utils/props'

const [name] = BEM('checkbox')

export const checkboxProps = shallowMerge({}, checkerSharedProps, {
  bindGroup: truthProp,
  onChange: Function as PropType<(value: unknown) => void>,
  'onUpdate:value': Function as PropType<(value: unknown) => void>
})

export type CheckboxProps = ExtractPropTypes<typeof checkboxProps>

export default defineComponent({
  name,

  props: checkboxProps,

  setup(props, { emit, slots }) {
    const { parent } = useParent(CHECKBOX_GROUP_KEY)

    const checked = computed(() => {
      if (parent && props.bindGroup) {
        return parent.props.value.indexOf(props.name) !== -1
      }
      return !!props.value
    })

    const onChange = (value: unknown) => {
      props.onChange?.(value)
    }

    const setParentValue = (checked: boolean) => {
      const { name } = props
      const { max, value } = parent!.props
      const newValue = value.slice()

      if (checked) {
        const overlimit = max && newValue.length >= parseInt(max.toString())

        if (!overlimit && !newValue.includes(name)) {
          newValue.push(name)

          if (props.bindGroup) {
            parent!.updateValue(newValue)
          }
        }
      } else {
        const index = newValue.indexOf(name)

        if (index !== -1) {
          newValue.splice(index, 1)

          if (props.bindGroup) {
            parent!.updateValue(newValue)
          }
        }
      }
    }

    const toggle = (newValue = !checked.value) => {
      if (parent && props.bindGroup) {
        setParentValue(newValue)
      } else {
        emit('update:value', newValue)
      }
    }

    watch(
      () => props.value,
      (value) => onChange(value)
    )

    useExpose({ toggle, props, checked })

    useFieldValue(() => props.value)

    return () => (
      <Checker
        v-slots={pick(slots, ['default', 'icon'])}
        role="checkbox"
        parent={parent}
        checked={checked.value}
        onToggle={toggle}
        {...props}
      />
    )
  }
})

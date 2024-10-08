import type { PropType, CSSProperties } from 'vue'
import type { ViewProps } from '@tarojs/components'
import type { CellSize, CellArrowDirection } from './types'
import { numericProp, VNodeProp, truthProp, unknownProp, makeNumericProp } from '../_utils/props'

export const cellSharedProps = {
  title: VNodeProp,
  value: VNodeProp,
  label: VNodeProp,
  shrink: truthProp,
  center: Boolean,
  isLink: Boolean,
  required: Boolean,
  valueClass: unknownProp,
  labelClass: unknownProp,
  titleClass: unknownProp,
  titleWidth: numericProp,
  rightIcon: String as PropType<IconTypes>,
  rightIconSize: makeNumericProp(16),
  titleStyle: null as unknown as PropType<CSSProperties>,
  size: String as PropType<CellSize>,
  arrowDirection: String as PropType<CellArrowDirection>,
  onTap: Function as PropType<ViewProps['onTap']>,
  clickable: {
    type: Boolean as PropType<boolean | null>,
    default: null
  },
  border: {
    type: Boolean as PropType<boolean | null>,
    default: null
  }
}

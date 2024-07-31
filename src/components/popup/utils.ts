import { inject, watch, type PropType, type CSSProperties, type TeleportProps } from 'vue'
import type { Interceptor } from '@txjs/shared'
import { createInjectionKey } from '../_utils/basic'
import { truthProp, unknownProp, numericProp, makeNumericProp } from '../_utils/props'

export const popupSharedProps = {
  show: Boolean,
  title: String,
  overlay: truthProp,
  duration: numericProp,
  titleBorder: Boolean,
  zIndex: makeNumericProp(991),
  teleport: [String, Object] as PropType<TeleportProps['to']>,
  lockScroll: truthProp,
  lazyRender: truthProp,
  beforeClose: Function as PropType<Interceptor>,
  overlayStyle: Object as PropType<CSSProperties>,
  overlayClass: unknownProp,
  transitionAppear: Boolean,
  closeOnClickOverlay: truthProp
}

export type PopupSharedPropKeys = Array<keyof typeof popupSharedProps>

export const popupSharedPropKeys = Object.keys(
  popupSharedProps
) as PopupSharedPropKeys

export const POPUP_TOGGLE_KEY = createInjectionKey<() => boolean>('popup-toggle')

export const onPopupReopen = (callback: UnknownCallback) => {
  const popupToggleStatus = inject(POPUP_TOGGLE_KEY, null)

  if (popupToggleStatus) {
    watch(popupToggleStatus, (show) => {
      if (show) {
        callback()
      }
    })
  }
}

// Types
import type { PopupPosition, PopupCloseIconPosition } from './types'

// Vue
import {
  defineComponent,
  ref,
  watch,
  provide,
  Teleport,
  computed,
  Transition,
  onActivated,
  onDeactivated,
  type ExtractPropTypes,
  type PropType
} from 'vue'

// Taro
import {
  ScrollView,
  type ViewProps,
  type ITouchEvent
} from '@tarojs/components'

// Common
import { useReady, useDidHide } from '@tarojs/taro'
import { noop, shallowMerge, callInterceptor } from '@txjs/shared'
import { isNil, notNil } from '@txjs/bool'
import { useNextTick } from '@/hooks/next-tick'
import { useScroller } from '@/hooks/scoller'
import { useExpose } from '@/hooks/expose'
import { useChildren, useParent } from '@/hooks/relation'

// Components
import { SafeArea } from '../safe-area'
import { Overlay } from '../overlay'

// Component utils
import { useId } from '../_utils/id'
import { useLazyRender } from '../_utils/lazy-render'
import { createInjectionKey } from '../_utils/basic'
import { truthProp, numericProp, makeStringProp } from '../_utils/props'
import { getZIndexStyle, addUnit } from '../_utils/style'
import { popupSharedProps, POPUP_TOGGLE_KEY } from './utils'

const [name, bem] = BEM('popup')

export const popupProps = shallowMerge({}, popupSharedProps, {
  round: Boolean,
  closeable: Boolean,
  transition: String,
  iconPrefix: String,
  shrink: truthProp,
  scrolling: numericProp,
  closeOnPopstate: Boolean,
  safeAreaInsetTop: Boolean,
  safeAreaInsetBottom: Boolean,
  position: makeStringProp<PopupPosition>('center'),
  closeIconPosition: makeStringProp<PopupCloseIconPosition>('top-left'),
  onOpen: Function as PropType<() => void>,
  onClose: Function as PropType<() => void>,
  'onUpdate:show': Function as PropType<(value: boolean) => void>,
  onClickOverlay: Function as PropType<ViewProps['onTap']>,
  onClickCloseIcon: Function as PropType<ViewProps['onTap']>,
  onOpened: Function as PropType<() => void>,
  onClosed: Function as PropType<() => void>
})

export type PopupProps = ExtractPropTypes<typeof popupProps>

export type PopupProvide = {
  props: PopupProps,
  close: () => void
}

export const POPUP_KEY = createInjectionKey<PopupProvide>(name)

export default defineComponent({
  name,

  inheritAttrs: false,

  props: popupProps,

  setup(props, { emit, attrs, slots }) {
    let opened: boolean
    let shouldReopen: boolean

    const rootId = useId()
    const { linkChildren } = useChildren(POPUP_KEY)

    const zIndex = ref<number>()
    const popupRef = ref<HTMLElement>()

    const style = computed(() => {
      const style = getZIndexStyle(zIndex.value)
      if (notNil(props.duration)) {
        const key = props.position === 'center' ? 'animationDuration' : 'transitionDuration'
        style[key] = `${props.duration}s`
      }
      return style
    })

    const lazyRender = useLazyRender(() => props.show || !props.lazyRender)

    const open = () => {
      if (!opened) {
        opened = true
        zIndex.value = +props.zIndex
        props.onOpen?.()
      }
    }

    const close = () => {
      if (opened) {
        callInterceptor(props.beforeClose, {
          done() {
            opened = false
            props.onClose?.()
            emit('update:show', false)
          }
        })
      }
    }

    const onClickOverlay = (event: ITouchEvent) => {
      props.onClickOverlay?.(event)

      if (props.closeOnClickOverlay) {
        close()
      }
    }

    const onClickCloseIcon = (event: ITouchEvent) => {
      props.onClickCloseIcon?.(event)
      close()
    }

    const onOpened = () => props.onOpened?.()

    const onClosed = () => props.onClosed?.()

    watch(
      () => props.show,
      (show) => {
        if (show && !opened) {
          open()

          if (attrs.tabindex === 0) {
            useNextTick(() => popupRef.value?.focus())
          }
        }
        if (!show && opened) {
          opened = false
          emit('close')
        }
      }
    )

    useExpose({ popupRef })

    provide(POPUP_TOGGLE_KEY, () => props.show)

    linkChildren({ close, props })

    onActivated(() => {
      if (shouldReopen) {
        emit('update:show', true)
        shouldReopen = false
      }
    })

    onDeactivated(() => {
      if (props.show && props.teleport) {
        close()
        shouldReopen = true
      }
    })

    useReady(() => {
      if (props.show) {
        open()
      }
    })

    useDidHide(() => {
      if (props.closeOnPopstate) {
        close()
        shouldReopen = false
      }
    })

    const renderOverlay = () => {
      if (props.overlay) {
        return (
          <Overlay
            v-slots={{ default: slots['overlay-content'] }}
            show={props.show}
            class={props.overlayClass}
            zIndex={zIndex.value}
            duration={props.duration}
            customStyle={props.overlayStyle}
            onTap={onClickOverlay}
          />
        )
      }
    }

    const renderTitle = () => {
      if (props.title) {
        return (
          <view class={bem('title', { border: props.titleBorder })}>
            <text>{props.title}</text>
          </view>
        )
      }
    }

    const renderCloseIcon = () => {
      if (props.closeable) {
        return (
          <view
            class={bem('close', props.closeIconPosition)}
            onTap={onClickCloseIcon}
          >
            <view class={bem('close-icon')} />
          </view>
        )
      }
    }

    const renderPopup = lazyRender(() => {
      const { round, position, safeAreaInsetTop, safeAreaInsetBottom } = props
      return (
        <view
          {...attrs}
          v-show={props.show}
          id={rootId}
          ref={popupRef}
          style={style.value}
          catchMove={props.lockScroll}
          class={bem({ round, [position]: position })}
          onTouchmove={noop}
        >
          {safeAreaInsetTop ? (
            <SafeArea position="top" />
          ) : null}
          <view
            disableScroll
            class={bem('header')}
          >
            {renderTitle()}
            {renderCloseIcon()}
          </view>
          {slots.default?.()}
          {safeAreaInsetBottom ? (
            <SafeArea>
              <view class={bem('bottom')} />
            </SafeArea>
          ) : null}
        </view>
      )
    })

    const renderTransition = () => {
      const { position, transition, transitionAppear } = props
      const transitionName = position === 'center' ? 'popup-fade' : `${name}-slide-${position}`
      return (
        <Transition
          name={transition || transitionName}
          appear={transitionAppear}
          onAfterEnter={onOpened}
          onAfterLeave={onClosed}
          v-slots={{ default: renderPopup }}
        />
      )
    }

    return () => {
      if (props.teleport) {
        return (
          <Teleport to={props.teleport}>
            {renderOverlay()}
            {renderTransition()}
          </Teleport>
        )
      }

      return (
        <view>
          {renderOverlay()}
          {renderTransition()}
        </view>
      )
    }
  }
})

export const Content = defineComponent({
  name: `${name}-content`,

  setup(_, { slots }) {
    const scrollId = useId()
    const scroller = useScroller(scrollId)
    const collector = scroller.collector(scrollId)
    const { parent } = useParent(POPUP_KEY)

    useExpose({ scroller })

    return () => {
      if (isNil(parent)) return

      const { shrink, scrolling } = parent.props
      const height = addUnit(scrolling)
      return (
        <view
          class={bem('content')}
          style={{ height, maxHeight: height }}
        >
          <ScrollView
            scrollY
            enhanced
            bounces
            // @ts-ignore
            enablePassive
            fastDeceleration
            scrollWithAnimation
            id={scrollId}
            class={bem('content-scroll')}
            scrollTop={collector.value}
          >
            <view class={bem('content-wrapper', { shrink })}>
              {slots.default?.()}
            </view>
          </ScrollView>
        </view>
      )
    }
  }
})

export const Footer = defineComponent({
  name: `${name}-footer`,

  setup(_, { slots }) {
    const { parent } = useParent(POPUP_KEY)

    return () => {
      if (isNil(parent)) return

      const { shrink } = parent.props
      return (
        <view
          disableScroll
          class={bem('footer', { shrink })}
        >
          <view class={bem('footer-wrapper')}>
            {slots.default?.()}
          </view>
        </view>
      )
    }
  }
})

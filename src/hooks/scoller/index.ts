import { ref, type Ref } from 'vue'

import { getElement } from '../rect/utils'
import type { SelectorElement } from '../rect/types'

type Direction = 'top' | 'left'

export const useScroller = (element: SelectorElement) => {
  const topCollect = new Map<string, Ref<number>>()
  const leftCollect = new Map<string, Ref<number>>()

  function scrollTop(top: number, scrollViewId?: SelectorElement) {
    const selectorElement = getElement(scrollViewId || element)
    const cache =  topCollect.get(selectorElement)
    if (cache) {
      if (cache.value === top) {
        top = top - 0.1
      }
      cache.value = top
      topCollect.set(selectorElement, cache)
    }
  }

  function scrollLeft(left: number, scrollViewId?: SelectorElement) {
    const selectorElement = getElement(scrollViewId || element)
    const cache =  leftCollect.get(selectorElement)
    if (cache) {
      if (cache.value === left) {
        left = left - 0.1
      }
      cache.value = left
      leftCollect.set(selectorElement, cache)
    }
  }

  function collector(scrollViewId: string, direction: Direction = 'top') {
    const collect = direction === 'top' ? topCollect : leftCollect

    if (!collect.has(scrollViewId)) {
      collect.set(scrollViewId, ref(0))
    }

    return collect.get(scrollViewId)!
  }

  function clearScrollTop(scrollViewId?: SelectorElement) {
    if (scrollViewId) {
      const selectorElement = getElement(scrollViewId)
      topCollect.delete(selectorElement)
    } else {
      topCollect.clear()
    }
  }

  function clearScrollLeft(scrollViewId?: SelectorElement) {
    if (scrollViewId) {
      const selectorElement = getElement(scrollViewId)
      leftCollect.delete(selectorElement)
    } else {
      leftCollect.clear()
    }
  }

  function clear(direction?: Direction) {
    if (direction) {
      const collect = direction === 'top' ? topCollect : leftCollect
      collect.clear()
    } else {
      topCollect.clear()
      leftCollect.clear()
    }
  }

  return {
    scrollTop,
    scrollLeft,
    collector,
    clearScrollTop,
    clearScrollLeft,
    clear
  }
}

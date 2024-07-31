import type { DOMRect } from './utils'

export type SelectorElement = string | (() => string)

export interface SelectorOptions {
  immediate?: boolean
  useCache?: boolean
  flush?: 'pre' | 'post'
  target?: TaroGeneral.IAnyObject
}

export interface SingleSelectorOptions<K> extends SelectorOptions {
  refs?: K[]
  observe?: string | boolean
  callback?: UnknownCallback<DOMRect>
}

export interface AllSelectorOptions extends SelectorOptions {
  callback?: UnknownCallback<DOMRect[]>
}

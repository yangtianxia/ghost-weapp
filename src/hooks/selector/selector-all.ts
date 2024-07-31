import { isFunction } from '@txjs/bool'
import type { UseSelector } from './selector'
import type { UseSelectors } from './selectors'

type ExtractTrigger<T> =
  T extends UseSelector | UseSelectors
    ? T['boundingClientRect']
    : T

const selectorCallback = <T,>(
  triggers: Function[],
  results: T[],
  callback?: UnknownCallback<T[]>
) => {
  const trigger = triggers.pop()!

  trigger((result: T) => {
    results = [...results, result]
    if (triggers.length) {
      selectorCallback(triggers, results, callback)
    } else {
      callback?.(results)
    }
  })
}

export const useSelectorAll = <
  T extends UseSelector | UseSelectors | ExtractTrigger<UseSelector | UseSelectors>,
  F extends ExtractTrigger<T>,
  C extends NonNullable<Parameters<F>[0]>,
  R extends Parameters<C>[0]
>(
  triggers: T[],
  callback: UnknownCallback<R[]>
) => {
  const list = triggers
    .reverse()
    .map((trigger) =>
      isFunction(trigger)
        ? trigger
        : trigger.boundingClientRect
    )
  selectorCallback(list, [], callback)
}

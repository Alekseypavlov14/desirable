import { SubscriptionCondition } from './types'
import { Assignable } from "@oleksii-pavlov/deep-merge"

// adds callback to each reducer call
// For example, counterStore.reducers.increment() will trigger callback 
export function subscribeOnReducerCalls<Reducers extends Assignable>(reducers: Reducers, onMethodCalled: () => void) {
  Object.keys(reducers).forEach((key: keyof Reducers) => {
    reducers[key] = new Proxy(reducers[key], {
      apply(target, thisArg, argArray) { // intercept calling reducer methods
        target.apply(thisArg, argArray)
        onMethodCalled()
      },
    })
  })
}

export function getDefaultSubscriptionCondition<State>(): SubscriptionCondition<State> {
  return () => true
}
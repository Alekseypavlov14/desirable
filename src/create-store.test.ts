import { createStore } from "./create-store"

describe('create-store', () => {
  it('init', () => {
    const counterStore = createMockStore() // create new store

    let isInitialized = false // create isInitialized flag

    counterStore.subscribe(() => {
      isInitialized = true
    })

    counterStore.init() // init store and trigger subscription
    expect(isInitialized).toBeTruthy() // check if initialized
  })

  it('unsubscribe', () => {
    const counterStore = createMockStore() // create new store

    let subscriptionCallbackCallsAmount = 0 // create subscription call counter

    const unsubscribe = counterStore.subscribe(() => subscriptionCallbackCallsAmount++)

    // trigger two updates
    counterStore.reducers.increment()
    counterStore.reducers.decrement()

    unsubscribe() // stop counting

    // trigger two more updates
    counterStore.reducers.increment()
    counterStore.reducers.decrement()

    // expect correct amount of updates
    expect(subscriptionCallbackCallsAmount === 2)
  })

  it('reset state', () => {
    const counterState = createMockStore() // create new store

    // make updates
    counterState.reducers.increment()
    counterState.reducers.increment()
    counterState.reducers.increment()

    // expect updated
    expect(counterState.getState().counter === 3)

    // reset state
    counterState.resetState()

    // expect reset state
    expect(counterState.getState().counter === 0)
  })

  it('clear all subscriptions', () => {
    const counterStore = createMockStore() // create new state

    let updatesCounter = 0 // create counter

    // subscribe on changes
    counterStore.subscribe(() => updatesCounter++)
    counterStore.subscribe(() => updatesCounter++)

    // make some changes expecting subscriptions will update updatesCounter
    counterStore.reducers.increment()
    counterStore.reducers.decrement()

    expect(updatesCounter === 2)

    // clear all subscriptions
    counterStore.clearAllSubscriptions()

    // make more changes
    counterStore.reducers.increment()
    counterStore.reducers.decrement()

    // expect counter still be two
    expect(updatesCounter === 2)
  })
})

function createMockStore() {
  const initialStore = {
    counter: 0
  }

  const counterStore = createStore(initialStore, (state) => ({
    increment: () => state.counter++,
    decrement: () => state.counter--,
    plus: (amount: number) => state.counter += amount,
    minus: (amount: number) => state.counter -= amount,
  }))

  return counterStore
}
# [State manager] - effective solution for state management

### Basic example
---

```ts
const initialStore = {
  counter: 0
}

const counterStore = createStore(initialStore, (state) => ({
  increment: () => state.counter++,
  decrement: () => state.counter--,
  plus: (amount: number) => state.counter += amount,
  minus: (amount: number) => state.counter -= amount,
}))

counterStore.subscribe((state) => console.log(state))

counterStore.reducers.increment()
// { counter: 1 }
counterStore.reducers.decrement()
// { counter: 0 }
```

### Comparing with Redux Toolkit and Zustand
---
[State manager] requires less boilerplate than Redux Toolkit. In comparison with Zustand, it has some pluses like dividing data and reducers saving API effectiveness and ```createStore()``` does not require explicit typing to write reducers (State type is got from ```initialState```). Also, [State manager] both gives an access to the core processes of the state management (initialization, resetting, subscription clearing) and allows not to waste time writing boilerplate. Except of it, [State Manager] is not only for React - you can use wherever you need and for React, there is an especial module (```'@oleksii-pavlov/[State manager]/react```)

### API
---
[State manager] provides an utility to create stores ```createStore()```
It requires two arguments:
- initialState - plain object that contains initial state data
- reducerCreator - function that has a parameter 'state' and returns reducers object. Reducers object has methods that updates state ([example](#basic-example))

```createStore()``` returns store that has properties and methods:
- subscribe(callback) - subscribes on state changes. The callback will be called every time when the state is changed with one argument - new state
- reducers - an object that is used to update state. Reducers object contains all reducers as its methods
- getState() - returns current state
- init() - not-required to use. It triggers calling all subscriptions callbacks
- resetState() - replaces current state with initial one and triggers calling all subscriptions callbacks
- clearAllSubscriptions() - removes all subscriptions
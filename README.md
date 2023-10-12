# Desirable - effective solution for state management

### Basic example

```ts
import { createStore } from '@oleksii-pavlov/desireable'

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

**Desireable** requires less boilerplate than Redux Toolkit. In comparison with Zustand, it has some pluses like dividing data and reducers saving API effectiveness and ```createStore()``` does not require explicit typing to write reducers (State type is got from ```initialState```). Also, **Desireable** both gives an access to the core processes of the state management (initialization, resetting, subscription clearing) and allows not to waste time writing boilerplate. Except of it, **Desireable** is not only for React - you can use wherever you need and for React, there is an especial module (```'@oleksii-pavlov/desireable/react```)

### Create a store

```ts
import { createStore } from '@oleksii-pavlov/desireable'

// define initial state
const initialState = {
  counter: 0
}

// create store by passing initial state and adding reducers
const counterStore = createStore(initialState, (state) => ({
  increment: () => state.counter++,
  decrement: () => state.counter--,
  updateValue: (value: number) => state.counter = value,
}))
```

### Reducers
```ts
createStore(initialState, (state) => ({
  increment: () => state.counter++,
  decrement: () => state.counter--,
  updateValue: (value: number) => state.counter = value,
}))
```

As you can see, to create **reducers** after **initialState** you pass to ```createStore()``` a callback which takes an argument **state** are returns an object with methods which are reducers and they can update state. These methods take **payload** arguments that can be used to update state. 

After creation, you can access your reducers by ```store.reducers``` object that contains the set of reducers. In this example, you would use ```store.reducers.increment()```

### Subscribe on state changes
---

After you learned how to [create](#create-a-store) and [update](#reducers) the state, we need to learn how to subscribe on state changes. Here is an example:

```ts
import { createStore } from '@oleksii-pavlov/desireable'

const initialState = {
  counter: 0
}

const counterStore = createStore(initialState, (state) => ({
  increment: () => state.counter++,
  decrement: () => state.counter--,
}))

counterStore.subscribe((state) => console.log('Counter value:', state.counter))

counterStore.reducers.increment() // Counter value: 1
counterStore.reducers.increment() // Counter value: 2
```

Using ```store.subscribe()``` you can subscribe on a store and listen to its state changes. ```store.subscribe()``` takes a callback as an argument. This callback has one parameter **state** which gives an access to the actual state of the store.
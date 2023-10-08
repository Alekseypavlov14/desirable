# State manager - effective solution for vanilla js

### Basic example

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
This state manager requires less boilerplate than Redux Toolkit. In comparison with Zustand, it has some pluses like dividing data and reducers saving API effectiveness. Also, it both gives an access to the core processes of the state management (initialization, resetting, subscription clearing) and allows not to waste time writing boilerplate. 
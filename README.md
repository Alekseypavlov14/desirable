# Desirable - effective solution for state management

### Basic example

```ts
import { createStore } from '@oleksii-pavlov/desirable'

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

**Desirable** requires less boilerplate than Redux Toolkit. In comparison with Zustand, it has some pluses like dividing data and reducers saving API effectiveness and ```createStore()``` does not require explicit typing to write reducers (State type is got from ```initialState```). Also, **Desirable** both gives an access to the core processes of the state management (initialization, resetting, subscription clearing) and allows not to waste time writing boilerplate. Except of it, **Desirable** is not only for React - you can use wherever you need and for React, there is an especial module (```'@oleksii-pavlov/desirable/react```)

### Create a store

```ts
import { createStore } from '@oleksii-pavlov/desirable'

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

### Reducers. How to update state?
```ts
createStore(initialState, (state) => ({
  increment: () => state.counter++,
  decrement: () => state.counter--,
  updateValue: (value: number) => state.counter = value,
}))
```

As you can see, to create **reducers** after **initialState** you pass to ```createStore()``` a callback which takes an argument **state** are returns an object with methods which are reducers and they can update state. These methods take **payload** arguments that can be used to update state. 

After creation, you can access your reducers by ```store.reducers``` object that contains the set of reducers. In this example, you would use ```store.reducers.increment()```

### Subscribe on state changes. How to listen to state changes?
---

After you learned how to [create](#create-a-store) and [update](#reducers) the state, we need to learn how to subscribe on state changes. Here is an example:

```ts
import { createStore } from '@oleksii-pavlov/desirable'

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

### Subscribe on specific slice. How avoid unnecessary callback calls?

Sometimes we need to do something when some specific pieces of state updated only. For example, there is a store that contains user's data and there are slices with name and with age. We do not want to change "Welcome" message each time the age has been changed and we do not want also to change the age in account settings if the name was changed. We want to make them independent but inside of a single store. For that, we can **subscribe on a specific slice**:

```ts
const initialState = {
  name: 'Bob',
  age: 23
}

const userStore = (initialState, (state) => ({
  updateName: (name: string) => state.name = name,
  updateAge: (age: number) => state.age = age
}))

// subscribe to change "Welcome" message each time the name changes
userStore.on((state) => state.name).subscribe((state) => {
  console.log('The "Welcome" message is updated') // update "Welcome" message
})

userStore.reducers.updateName('Bobby') // console: The "Welcome" message is updated
userStore.reducers.updateAge(17) // nothing was called
```

Here you can see a new method of the store - ```store.on()```. It takes **selector** callback that takes **state** and returns **specific slice** that we want to listen to. ```store.on()``` method return **Subscribable** object. That means that we can call its ```subscribe()``` method and it works the same way as ```store.subscribe()```. In this example, we subscribed name value. We also can subscribe on object and each time it is changed (its properties are changed) the callback will be called. Objects are compared recursively so even changes of nested objects are listened.

Advice: if you want to subscribe a few specific slices in the same state, you could think of splitting the store to some small stores in case it is possible.

### Unsubscribe. How to stop listening changes?

Sometimes we need to stop listening to store changes. For that, you need to use ```unsubscribe()``` function. The same as in most of state managers, this function is returned by ```store.subscribe()``` and by ```store.on(selector).subscribe()``` as well:

```ts
import { createStore } from '@oleksii-pavlov/desirable'

// initial state
const initialState = {
  counter: 0
}

const counterStore = createStore(initialState, (state) => ({
  increment: () => state.counter++,
  decrement: () => state.counter--,
}))

// subscribe
const unsubscribe = counterStore.subscribe((state) => console.log('Counter value:', state.counter))

counterStore.reducers.increment() // Counter value: 1
counterStore.reducers.increment() // Counter value: 2

// stop listening and writing in console
unsubscribe()

counterStore.reducers.increment() // console has not been changed
counterStore.reducers.increment() // console has not been changed
```

### Get state. How to get state not by subscription?

It happens that we need to get state in the moment only once, not subscribe on it. For these cases, there is a method ```store.getState()```. It returns the current state of the store and does not subscribes on changes. Also, this method allows to use data from different stores at the same time:

```ts
// stores/account-store.ts
import { createStore } from '@oleksii-pavlov/desirable'

const initialState = {
  login: 'Luiza',
  followers: 10
}

export const accountStore = createStore(initialState, (state) => ({
  updateLogin: (login: string) => state.login = login,
  updateFollowers: (followers: number) => state.followers = followers,
}))
```

```ts
// stores/language-store.ts
import { createStore } from '@oleksii-pavlov/desirable'

const initialState = {
  language: 'en'
}

export const languageStore = createStore(initialState, (state) => ({
  updateLanguage: (language: string) => state.language = language,
}))
```

```ts
// features/send-email.ts
import { accountStore } from '../stores/account-store'
import { languageStore } from '../stores/language-store'

export function sendLetterByEmail() {
  const accountState = accountStore.getState() // { login: 'Luiza', followers: 10 }
  const languageState = languageStore.getState() // { language: 'en' }

  // do some code with both states
}
```

### Other methods to work with stores

- ```store.init()``` triggers subscriptions call without updating the data
- ```store.resetState()``` updates state by setting it to ```initialState``` given to ```createStore()```
- ```store.clearAllSubscriptions()``` removes all subscriptions by calling ```unsubscribe()``` for each subscription

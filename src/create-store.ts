import { deepMergeAndAssign, Assignable } from "@oleksii-pavlov/deep-merge"

export function createStore<
  State extends Assignable, 
  ReducerCreator extends (state: State) => any,
  Callback extends (state: State) => void
>
(
  initialState: State, 
  reducerCreator: ReducerCreator
) {
	let state = deepObjectClone(initialState)
	const reducers: ReturnType<ReducerCreator> = reducerCreator(state)

  subscribeOnReducerCalls(reducers, runSubscribers)
	
  const subscribers: Callback[] = []

	function getState() {
		return deepObjectClone(state)
	}

	function subscribe(callback: Callback) {
		subscribers.push(callback)
	}
	function runSubscribers() {
		subscribers.forEach(subscriber => subscriber(getState()))
	}

	function resetState() {
		state = deepObjectClone(initialState)
	}

	function init() {
		runSubscribers()
	}

	return {
		getState,
		subscribe,
		reducers,
		init,
		resetState
	}
}

function deepObjectClone<T extends Assignable>(object: T): T {
	return deepMergeAndAssign({}, object)
}

function subscribeOnReducerCalls<Reducers extends Assignable>(reducers: Reducers, onMethodCalled: () => void) {
  Object.keys(reducers).forEach((key: keyof Reducers) => {
    reducers[key] = new Proxy(reducers[key], {
      apply(target, thisArg, argArray) {
        target.apply(thisArg, argArray)
        onMethodCalled()
      },
    })
  })
}

// const initialState = {
//   count: 0,
//   count1: 0
// }

// const store = createStore(initialState, (state) => ({
//   increment: (payload: number) => state.count += payload,
//   decrement: () => state.count -= 1,
//   double: () => {
//     state.count = 1
//     state.count1 = 1
//   }
// }))

// store.subscribe(console.table)

// store.reducers.increment(4)
// store.reducers.increment(7)
// store.reducers.decrement()
// store.reducers.double()
// store.reducers.double()
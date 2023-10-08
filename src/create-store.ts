import { deepMergeAndAssign, Assignable } from "@oleksii-pavlov/deep-merge"
import { IDCreator } from "./id-creator"

interface Subscription<State> {
	callback: SubscriptionCallback<State>
	id: number
}

type SubscriptionCallback<State> = (state: State) => void

export function createStore<
  State extends Assignable, 
  ReducerCreator extends (state: State) => any
>
(
  initialState: State, 
  reducerCreator: ReducerCreator
) {
	let state = deepObjectClone(initialState)
	const reducers: ReturnType<ReducerCreator> = reducerCreator(state)

  subscribeOnReducerCalls(reducers, runSubscribers)
	
  let subscriptions: Subscription<State>[] = []
	const subscriptionIds = new IDCreator()

	function getState() {
		return deepObjectClone(state)
	}

	function subscribe(callback: SubscriptionCallback<State>) {
		const subscription = createSubscription(callback)
		subscriptions.push(subscription)

		return () => unsubscribeById(subscription.id)
	}
	function createSubscription<State>(callback: SubscriptionCallback<State>) {
		return ({ callback, id: subscriptionIds.createId() })
	}
	function unsubscribeById(subscriptionId: number) {
		subscriptions = subscriptions.filter(subscription => subscription.id !== subscriptionId)
	}
	function runSubscribers() {
		subscriptions.forEach(subscription => subscription.callback(getState()))
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

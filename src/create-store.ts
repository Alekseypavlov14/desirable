import { Subscribable, Subscription, SubscriptionCallback, Selector, UnsubscribeFunction } from "./shared/types"
import { Assignable, deepClone, deepCompare } from "@oleksii-pavlov/deep-merge"
import { subscribeOnReducerCalls } from "./shared/utils"
import { IDCreator } from "./id-creator"

export function createStore<
  State extends Assignable, 
  ReducerCreator extends (state: State) => any
>
(
  initialState: State, 
  reducerCreator: ReducerCreator
) {
	let state = deepClone(initialState)
	let previousState = deepClone(state)
	const reducers: ReturnType<ReducerCreator> = reducerCreator(state)

  subscribeOnReducerCalls(reducers, runSubscribers)
	
  let subscriptions: Subscription<State>[] = []
	const subscriptionIds = new IDCreator()

	function getState(): State {
		return deepClone(state)
	}

	function subscribe(callback: SubscriptionCallback<State>): UnsubscribeFunction {
		const subscription = createSubscription(callback)
		subscriptions.push(subscription)

		return () => unsubscribeById(subscription.id)
	}
	function on(selector: Selector<State>): Subscribable<State> {
		return ({
			subscribe: (callback: SubscriptionCallback<State>): UnsubscribeFunction => {
				return subscribe((state) => {
					const previousStateSlice = selector(previousState)
					const updatedStateSlice = selector(state)
	
					if (deepCompare(previousStateSlice, updatedStateSlice)) return

					callback(state)
				})
			}
		})
	}
	function createSubscription<State>(callback: SubscriptionCallback<State>): Subscription<State> {
		return ({ callback, id: subscriptionIds.createId() })
	}
	function unsubscribeById(subscriptionId: number): void {
		subscriptions = subscriptions.filter(subscription => subscription.id !== subscriptionId)
	}
	function clearAllSubscriptions(): void {
		subscriptions = []
	}
	function runSubscribers(): void {
		subscriptions.forEach(subscription => subscription.callback(getState()))
		previousState = deepClone(getState())
	}

	function resetState(): void {
		state = deepClone(initialState)
	}

	function init(): void {
		runSubscribers()
	}

	return {
		getState,
		subscribe,
		on,
		reducers,
		init,
		resetState,
		clearAllSubscriptions
	}
}


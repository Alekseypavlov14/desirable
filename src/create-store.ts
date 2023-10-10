import { Subscribable, Subscription, SubscriptionCallback, Selector, UnsubscribeFunction } from "./shared/types"
import { deepObjectClone, subscribeOnReducerCalls } from "./shared/utils"
import { Assignable } from "@oleksii-pavlov/deep-merge"
import { IDCreator } from "./id-creator"

export function createStore<
  State extends Assignable, 
  ReducerCreator extends (state: State) => any
>
(
  initialState: State, 
  reducerCreator: ReducerCreator
) {
	let state = deepObjectClone(initialState)
	let previousState = deepObjectClone(state)
	const reducers: ReturnType<ReducerCreator> = reducerCreator(state)

  subscribeOnReducerCalls(reducers, runSubscribers)
	
  let subscriptions: Subscription<State>[] = []
	const subscriptionIds = new IDCreator()

	function getState(): State {
		return deepObjectClone(state)
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
	
					if (previousStateSlice === updatedStateSlice) return

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
		previousState = getState()
	}

	function resetState(): void {
		state = deepObjectClone(initialState)
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


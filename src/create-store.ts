import { Subscribable, Subscription, SubscriptionCallback, Selector, UnsubscribeFunction, BaseStore, SubscriptionCondition } from "./shared/types"
import { getDefaultSubscriptionCondition, subscribeOnReducerCalls } from "./shared/utils"
import { Assignable, deepClone, deepCompare } from "@oleksii-pavlov/deep-merge"
import { IDCreator } from "./id-creator"

export function createStore<
  State extends Assignable, 
  ReducerCreator extends (state: State) => any
>(
  initialState: State, 
  reducerCreator: ReducerCreator
): BaseStore<State, ReturnType<ReducerCreator>> {
	let state = deepClone(initialState) // create state variable
	let previousState = deepClone(state) // create previous state variable (is used to check updates)

	const reducers: ReturnType<ReducerCreator> = reducerCreator(state)

  subscribeOnReducerCalls(reducers, runSubscribers) // call runReducers each time reducer is called
	
  let subscriptions: Subscription<State>[] = []
	const subscriptionIds = new IDCreator()

	function getState(): State {
		return deepClone(state)
	}

	function subscribe(callback: SubscriptionCallback<State>): UnsubscribeFunction {
		const subscription = createSubscription(callback, getDefaultSubscriptionCondition())
		subscriptions.push(subscription)

		return () => unsubscribeById(subscription.id)
	}
	function on<SelectedValue>(selector: Selector<State, SelectedValue>): Subscribable<State> {
		return ({
			subscribe: (callback: SubscriptionCallback<State>): UnsubscribeFunction => {
				const condition: SubscriptionCondition<State> = (state: State) => {
					const previousStateSlice = selector(previousState)
					const updatedStateSlice = selector(state)
	
					return !deepCompare(previousStateSlice, updatedStateSlice)
				}

				const subscription = createSubscription(callback, condition) 
				subscriptions.push(subscription)

				return () => unsubscribeById(subscription.id)
			}
		})
	}
	function createSubscription<State>(callback: SubscriptionCallback<State>, condition: SubscriptionCondition<State>): Subscription<State> {
		return ({ callback, condition: condition, id: subscriptionIds.createId() })
	}
	function unsubscribeById(subscriptionId: number): void {
		subscriptions = subscriptions.filter(subscription => subscription.id !== subscriptionId)
	}
	function clearAllSubscriptions(): void {
		subscriptions.forEach(subscription => unsubscribeById(subscription.id))
	}
	function runSubscribers(): void {
		subscriptions
			.filter(subscription => subscription.condition(getState()))
			.forEach(subscription => subscription.callback(getState()))

		previousState = deepClone(getState())
	}

	function resetState(): void {
		state = deepClone(initialState)
	}

	function init(): void {
		subscriptions.forEach(subscription => subscription.callback(getState()))
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


export interface Subscribable<State> {
	subscribe: SubscribeFunction<State>
}

export type SubscribeFunction<State> = (callback: SubscriptionCallback<State>) => UnsubscribeFunction

export type SubscriptionCallback<State> = (state: State) => void

export interface Subscription<State> {
	callback: SubscriptionCallback<State>
	id: number
}

export type UnsubscribeFunction = () => void

export type Selector<State> = (state: State) => void
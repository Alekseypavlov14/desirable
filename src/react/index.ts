import { createStore as createBaseStore } from "../create-store"
import { useEffect, useState } from "react"
import { Assignable } from "@oleksii-pavlov/deep-merge"
import { Selector } from "../shared/types"

export function createStore<
  State extends Assignable,
  ReducerCreator extends (state: State) => any
>(initialState: State, reducerCreator: ReducerCreator) {
  const store = createBaseStore(initialState, reducerCreator)
  const useSelector = createUseSelectorCallback(store)
  return { ...store, useSelector }
}

function createUseSelectorCallback<
  State extends Assignable, 
  ReducerCreator extends (state: State) => any
>(store: ReturnType<typeof createBaseStore<State, ReducerCreator>>) {
  return (selector: Selector<State>) => {
    const [value, updateValue] = useState(selector(store.getState()))

    useEffect(() => {
      const unsubscribe = store.on(selector).subscribe((state) => updateValue(selector(state)))
      return unsubscribe
    }, [])

    return value
  }
}
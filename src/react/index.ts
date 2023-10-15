import { createStore as createBaseStore } from "../create-store"
import { createUseSelectorCallback } from "./utils"
import { Assignable } from "@oleksii-pavlov/deep-merge"
import { ReactStore } from './types'

export function createStore<
  State extends Assignable,
  ReducerCreator extends (state: State) => any
>(
  initialState: State, 
  reducerCreator: ReducerCreator
): ReactStore<State, ReturnType<ReducerCreator>> {
  const store = createBaseStore(initialState, reducerCreator)

  const useSelector = createUseSelectorCallback(store)
  
  return { ...store, useSelector }
}

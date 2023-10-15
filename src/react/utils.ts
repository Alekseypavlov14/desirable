import { useState, useEffect } from "react"
import { Assignable } from "@oleksii-pavlov/deep-merge"
import { BaseStore } from "../shared/types"
import { Selector } from "../shared/types"

export function createUseSelectorCallback<
  State extends Assignable, 
  ReducerCreator extends (state: State) => any
>(store: BaseStore<State, ReturnType<ReducerCreator>>) {
  return <SelectedValue>(selector: Selector<State, SelectedValue>): SelectedValue => {
    const initialValue = selector(store.getState())
    const [value, updateValue] = useState<SelectedValue>(initialValue)

    useEffect(() => {
      const unsubscribe = store.on(selector).subscribe((state) => updateValue(selector(state)))
      return unsubscribe
    }, [])

    return value
  }
}
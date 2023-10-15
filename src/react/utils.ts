import { useState, useEffect } from "react"
import { Assignable } from "@oleksii-pavlov/deep-merge"
import { BaseStore } from "../shared/types"
import { Selector } from "../shared/types"

export function createUseSelectorCallback<
  State extends Assignable, 
  ReducerCreator extends (state: State) => any
>(store: BaseStore<State, ReturnType<ReducerCreator>>) {
  return <SelectedValue>(selector: Selector<State, SelectedValue>): SelectedValue => {
    // create reactive state
    const [value, updateValue] = useState<SelectedValue>(selector(store.getState()))

    useEffect(() => {
      // subscribe on changes to update react state
      const unsubscribe = store.on(selector).subscribe((state) => updateValue(selector(state)))
      // unsubscribe when react component is unmounted (for optimization)
      return unsubscribe
    }, [])

    // return reactive specified value
    return value
  }
}
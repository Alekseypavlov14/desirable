import { createStore } from "./create-store"
import { IDCreator } from "./id-creator"

const initialState = {
  count: 0,
  count1: 0
}

const store = createStore(initialState, (state) => ({
  increment: (payload: number) => state.count += payload,
  decrement: () => state.count -= 1,
  double: () => {
    state.count = 1
    state.count1 = 1
  }
}))

store.subscribe(console.table)

store.reducers.increment(4)
store.reducers.increment(7)
store.reducers.decrement()
store.reducers.double()
store.reducers.double()

const idCreator = new IDCreator()

console.log(idCreator.createId())
console.log(idCreator.createId())
console.log(idCreator.createId())
import React from 'react'
import { render, screen } from '@testing-library/react'
import { createStore } from './index'
import { userEvent } from '@testing-library/user-event'
import '@testing-library/jest-dom'

// this test file extends src/create-store.test.ts

test('Test useSelector reactivity', async () => {
  // render component
  render(<Component />)

  // state updates
  await userEvent.click(screen.getByTestId('increment'))

  // expect counter to contain updated state
  expect(screen.getByTestId('counter')).toHaveTextContent('1')
})

// component
const Component = () => {
  const { store, useCounterSelector } = createMockStore()
  const counter = useCounterSelector((state) => state.counter)

  function increment() {
    store.reducers.increment()
  }

  return (
    <>
      <div>Counter: <span data-testid="counter">{counter}</span></div>
      <button data-testid="increment" onClick={increment}>Increment</button>
    </>
  )
} 

// store
function createMockStore() {
  const initialState = {
    counter: 0
  }

  const store = createStore(initialState, (state) => ({
    increment: () => state.counter++,
    decrement: () => state.counter--
  }))

  const useCounterSelector = store.useSelector

  return { store, useCounterSelector }
}

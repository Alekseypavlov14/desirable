import { IDCreator } from "./id-creator"

test('test id uniqueness', () => {
  const idCreator = new IDCreator()

  // create three different ids
  const id1 = idCreator.createId()
  const id2 = idCreator.createId()
  const id3 = idCreator.createId()

  // expect id uniqueness
  expect(
    id1 !== id2 &&
    id2 !== id3 && 
    id3 !== id1
  )

  // expect ids' difference is 1 
  expect(id2 - id1 === 1)
})
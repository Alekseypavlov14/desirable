export class IDCreator {
  #ids: number[] = []

  createId() {
    let candidateId = Date.now() // create candidate

    while(!this.#isIdUnique(candidateId)) { // if id is not unique
      candidateId += 1 // try new candidate
    }

    this.#ids.push(candidateId) // put id to the list

    return candidateId
  }

  #isIdUnique(candidateId: number) {
    return !this.#ids.includes(candidateId)
  }
}
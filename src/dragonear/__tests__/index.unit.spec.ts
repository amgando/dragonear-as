import { VMContext } from "near-sdk-as";
import { Contract } from "../assembly";

let contract: Contract

beforeEach(() => {
  const owner = "owen"
  contract = new Contract(owner)
})

describe("Contract", () => {
  // VIEW method tests

  it("runs a basic battle", () => {
    const owner = "owen"
    const accounts = ["alice", "bob", "carol"]
    for (let i = 0; i < 3; i++) {
      const account = accounts[i]
      VMContext.setPredecessor_account_id(account)
      contract.create_account()
      VMContext.setPredecessor_account_id(owner)
      contract.dragon_create(account)
    }

    VMContext.setPredecessor_account_id(accounts[1])
    contract.dragon_select(1)
    expect(contract.battle_start()).toBeFalsy()

    VMContext.setPredecessor_account_id(accounts[2])
    contract.dragon_select(2)
    expect(contract.battle_start()).toBeTruthy()

  })
})

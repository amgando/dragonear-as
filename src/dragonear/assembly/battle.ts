import { Context } from "near-sdk-as"
import { Timestamp, CryptoHash, Option } from "../../utils";
import { Dragon } from "./dragon"

const BATTLE_MAX_DURATION: Timestamp = 10 * 60 * 1_000_000;

export class Battle {
  start_timestamp: Timestamp
  hash_actions_a: Option<CryptoHash>
  hash_actions_b: Option<CryptoHash>
  actions_a: Option<Array<u8>>
  actions_b: Option<Array<u8>>

  constructor(
    public dragon_a: u64,
    public dragon_b: u64
  ) {
    this.start_timestamp = Context.blockTimestamp
    this.hash_actions_a = new Option([])
    this.hash_actions_b = new Option([])
    this.actions_a = new Option([])
    this.actions_b = new Option([])
  }

  set_hash_actions(dragon_id: u64, hash_actions: CryptoHash): void {
    assert(this.dragon_a == dragon_id || this.dragon_b == dragon_id, "ERR_NOT_YOUR_BATTLE");
    if (this.dragon_a == dragon_id) {
      this.hash_actions_a = new Option(hash_actions)
    } else {
      this.hash_actions_b = new Option(hash_actions)
    }
  }

  set_actions(dragon_id: u64, actions: Array<u8>): void {
    assert(this.dragon_a == dragon_id || this.dragon_b == dragon_id, "ERR_NOT_YOUR_BATTLE");
    // TODO: check hashes.
    if (this.dragon_a == dragon_id) {
      this.actions_a = new Option(actions);
    } else {
      this.actions_b = new Option(actions);
    }
  }

  complete(): bool {
    // TODO: add expiry
    return this.actions_a.is_some() && this.actions_b.is_some() || Context.blockTimestamp >= this.start_timestamp + BATTLE_MAX_DURATION
  }

  run(dragon_a: Dragon, dragon_b: Dragon): void {
    // TODO: run the battle.
    let i = 0;
    let j = 0;
    let actions_a = this.actions_a.unwrap() || [0];
    let actions_b = this.actions_b.unwrap() || [0];
    let constitution_a = dragon_a.constitution;
    let constitution_b = dragon_b.constitution;
    while (true) {
      dragon_a.apply_skill(constitution_a, constitution_b, actions_a[i]);
      dragon_b.apply_skill(constitution_b, constitution_a, actions_b[i]);
      i = (i + 1) % actions_a.length;
      j = (j + 1) % actions_b.length;
    }
  }
}


/**
 * VERSIONED MODEL

pub enum VBattle {
    V1(Battle)
}

impl From<VBattle> for Battle {
    fn from(c: VBattle) -> this {
        match c {
            VBattle::V1(c) => c
        }
    }
}
*/

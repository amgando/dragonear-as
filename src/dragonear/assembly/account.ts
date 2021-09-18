import { Context } from "near-sdk-as"
import { Timestamp, Option } from "../../utils"

@nearBindgen
export class Account {
  public cluster_id: u64 = 0
  public current_dragon: Option<u64>
  dragon_change_timestamp: Timestamp = 0

  set_dragon(dragon_id: u64): void {
    assert(this.dragon_change_timestamp < Context.blockTimestamp + DAY_DURATION, "ERR_CHANGE_DRAGON_DELAY");
    if (dragon_id == u64.MAX_VALUE) {
      this.current_dragon = new Option(0);
    } else {
      this.current_dragon = new Option(dragon_id);
    }
    this.dragon_change_timestamp = Context.blockTimestamp;
  }
}

/**
 * VERSIONED MODEL

pub enum VAccount {
    V1(Account)
}

impl From<VAccount> for Account {
    fn from(c: VAccount) -> Self {
        match c {
            VAccount::V1(c) => c
        }
    }
}
*/


const DAY_DURATION: Timestamp = 24 * 60 * 60 * 1_000_000;

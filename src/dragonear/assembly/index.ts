import { logging, Context, PersistentUnorderedMap } from "near-sdk-as"

import { AccountId, Base58CryptoHash, Option } from "../../utils"

import { Account } from "./account"
import { Cluster } from "./cluster"
import { Battle } from "./battle"
import { Dragon } from "./dragon"

enum StorageKey {
  Accounts,
  Dragons,
  Clusters,
  Battles,
}

@nearBindgen
export class Contract {
  owner_id: AccountId
  accounts: PersistentUnorderedMap<AccountId, Account>;
  dragons: PersistentUnorderedMap<u64, Dragon>;
  clusters: PersistentUnorderedMap<u64, Cluster>;
  battles: PersistentUnorderedMap<String, Battle>;
  last_dragon_id: u64;

  constructor(
    owner_id: AccountId,
  ) {
    this.owner_id = owner_id
    this.accounts = new PersistentUnorderedMap(StorageKey.Accounts.toString())
    this.dragons = new PersistentUnorderedMap(StorageKey.Dragons.toString())
    this.clusters = new PersistentUnorderedMap(StorageKey.Clusters.toString())
    this.battles = new PersistentUnorderedMap(StorageKey.Battles.toString())
    this.last_dragon_id = 0
    this.set_cluster(0, new Cluster(255, new Option(0)))
  }

  get_account(account_id: AccountId): Account | null {
    const account = this.accounts.get(account_id)
    assert(account, "NO_ACCOUNT")
    return account
  }

  set_account(account_id: AccountId, account: Account): void {
    this.accounts.set(account_id, account);
  }

  get_dragon(dragon_id: u64): Dragon | null {
    const dragon = this.dragons.get(dragon_id)
    assert(dragon, "NO_DRAGON")
    return dragon
  }

  set_dragon(dragon_id: u64, dragon: Dragon): void {
    this.dragons.set(dragon_id, dragon);
  }

  get_cluster(cluster_id: u64): Cluster | null {
    const cluster = this.clusters.get(cluster_id)
    assert(cluster, "NO_CLUSTER")
    return cluster
  }

  set_cluster(cluster_id: u64, cluster: Cluster): void {
    this.clusters.set(cluster_id, cluster);
  }

  get_battle(battle_id: string): Battle | null {
    const battle = this.battles.get(battle_id)
    assert(battle, "NO_BATTLE")
    return battle
  }

  set_battle(battle_id: string, battle: Battle): void {
    this.battles.set(battle_id, battle);
  }

  create_account(): void {
    let account_id = Context.predecessor
    assert(!this.accounts.contains(account_id), "ERR_ACCOUNT_EXISTS");
    this.set_account(account_id, new Account());
  }

  dragon_create(account_id: AccountId): u64 {
    assert(Context.predecessor == this.owner_id, "ONLY_OWNER");
    let dragon = Dragon.random(account_id);
    this.set_dragon(this.last_dragon_id, dragon);
    this.last_dragon_id += 1;
    return this.last_dragon_id - 1
  }

  dragon_select(dragon_id: u64): void {
    let account_id = Context.predecessor
    let account = this.get_account(account_id)!;
    if (dragon_id != u64.MAX_VALUE) {
      let dragon = this.get_dragon(dragon_id)!;
      assert(dragon.owner_id == account_id, "ERR_NOT_OWNER");
    }
    account.set_dragon(dragon_id);
    this.set_account(account_id, account);
  }

  private internal_get_info(): Info {
    let account = this.get_account(Context.predecessor)!;
    let cluster = this.get_cluster(account.cluster_id)!;
    let dragon_id = account.current_dragon.expect("ERR_NO_DRAGON_SELECTED")
    let dragon = this.get_dragon(dragon_id)!;
    return new Info(account, cluster, dragon_id, dragon)
  }

  private internal_create_battle(dragon_a: u64, dragon_b: u64): void {
    let battle = new Battle(dragon_a, dragon_b);
    this.set_battle(`${dragon_a}:${dragon_b}`, battle);
  }

  battle_start(): bool {
    let info = this.internal_get_info();
    assert(info.dragon.level <= info.cluster.max_lvl, "ERR_HIGH_LEVEL");
    let started_battle: bool
    let waiting_dragon_id = info.cluster.waiting_for_battle.unwrap()
    if (waiting_dragon_id) {
      this.internal_create_battle(info.dragon_id, waiting_dragon_id);
      info.cluster.waiting_for_battle = new Option(0);
      started_battle = true
    } else {
      info.cluster.waiting_for_battle = new Option(info.dragon_id);
      started_battle = false
    };
    this.set_cluster(info.account.cluster_id, info.cluster);
    return started_battle
  }

  battle_commit_actions(battle_id: string, hash_actions: Base58CryptoHash): void {
    let info = this.internal_get_info();
    let battle = this.get_battle(battle_id)!;
    battle.set_hash_actions(info.dragon_id, hash_actions);
    this.set_battle(battle_id, battle);
  }

  battle_reveal_actions(battle_id: string, actions: Array<u8>): void {
    let info = this.internal_get_info();

    let battle = this.get_battle(battle_id)!;
    battle.set_actions(info.dragon_id, actions);
    if (battle.complete()) {
      let other_dragon_id = info.dragon_id == battle.dragon_a ? battle.dragon_b : battle.dragon_a;
      let other_dragon = this.get_dragon(other_dragon_id)!;
      if (info.dragon_id == battle.dragon_a) {
        battle.run(info.dragon, other_dragon);
      } else {
        battle.run(other_dragon, info.dragon);
      }
      this.set_dragon(info.dragon_id, info.dragon);
      this.set_dragon(other_dragon_id, other_dragon);
    }
    this.set_battle(battle_id, battle);
  }

  cluster_select(cluster_id: u64): void {
    let account_id = Context.predecessor
    let account = this.get_account(account_id)!;
    // TODO: add more properties of the cluster.
    account.cluster_id = cluster_id;
    this.set_account(account_id, account);
  }
}


class Info {
  constructor(
    public account: Account,
    public cluster: Cluster,
    public dragon_id: u64,
    public dragon: Dragon,
  ) { }
}

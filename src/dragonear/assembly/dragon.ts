import { RNG } from "near-sdk-as";
import { AccountId } from "../../utils"

enum Element {
  Physical,
  Fire,
  Water,
  Air,
  Earth,
}

function randomElement(): Element {
  return Element.Physical
}

@nearBindgen
class Ratio {
  constructor(public num: u32, public denom: u32) { }
}

enum SkillKind {
  Attack,
  Buff,
}

@nearBindgen
class Skill {
  constructor(
    public element: Element,
    public kind: SkillKind,
    public powerup_ratio: Ratio,
    public cooldown: u32) { }

  static physical(): Skill {
    return new Skill(
      Element.Physical,
      SkillKind.Attack,
      new Ratio(1, 1),
      0)
  }

  static random(): Skill {
    return new Skill(
      randomElement(),
      random_number() % 2 == 0 ? SkillKind.Attack : SkillKind.Buff,
      random_powerup(),
      random_cooldown(),
    )
  }
}

function random_number(): u8 {
  const rng = new RNG<u8>(1);
  return rng.next();
}

function random_powerup(): Ratio {
  const rn = random_number()

  if (rn >= 0 && rn <= 99) {
    return new Ratio(1, 1)
  } else if (rn >= 100 && rn <= 174) {
    return new Ratio(5, 4)
  } else if (rn >= 175 && rn <= 224) {
    return new Ratio(3, 2)
  } else if (rn >= 225 && rn <= 250) {
    return new Ratio(2, 1)
  } else {
    return new Ratio(5, 1)
  }
}

function random_cooldown(): u32 {
  const rn = random_number()

  if (rn >= 0 && rn <= 99) {
    return 3
  } else if (rn >= 100 && rn <= 200) {
    return 2
  } else {
    return 1
  }
}

@nearBindgen
class Constitution {
  constructor(
    public max_hp: u32,
    public attack: Array<u32>,
    public defense: Array<u32>) { }
}

@nearBindgen
export class Dragon {
  constructor(
    public owner_id: AccountId,
    public generation: u8,
    public level: u8,
    public exp: u32,
    public element: Element,
    public skills: Array<Skill>,
    public constitution: Constitution,
  ) { }

  /// Create a random dragon of 0th generation.
  static random(account_id: AccountId): Dragon {
    const skills = [Skill.physical()];

    const constitution = new Constitution(
      (random_number() % 10) + 10,
      [1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1],
    );

    return new Dragon(
      account_id,
      0,
      0,
      0,
      randomElement(),
      skills,
      constitution
    );
  }

  /// Mate two dragons and create a new dragon of next generation and of the given properties.
  // pub fn mate(dragon_a: &Dragon, dragon_b: &Dragon) -> Self {
  //     Self::random(dragon_a)
  // }

  uplevel(): void {
    assert(this.exp >= (this.level) * 1000, "NOT_ENOUGH_EXP");
    this.exp -= (this.level) * 1000;
    this.level += 1;
    this.skills.push(Skill.random());
  }

  apply_skill(constitution: Constitution, other_constitution: Constitution, skill_id: u8): void {
    let skill = this.skills[skill_id];
    let element_id = skill.element
    switch (skill.kind) {
      case SkillKind.Attack:
        let attack = constitution.attack[element_id] * skill.powerup_ratio.num / skill.powerup_ratio.denom;
        let defense = other_constitution.defense[element_id];
        attack -= attack < defense ? 1 : attack - defense;
        other_constitution.max_hp -= min(attack, other_constitution.max_hp);
        break;
      case SkillKind.Buff:
        constitution.defense[element_id] = constitution.defense[element_id] * skill.powerup_ratio.num / skill.powerup_ratio.denom;
        break;
    }
  }
}

/**
 * VERSIONED MODEL

  pub enum VDragon {
      V1(Dragon)
  }

  impl From<VDragon> for Dragon {
      fn from(c: VDragon) -> Self {
          match c {
              VDragon::V1(c) => c
          }
      }
  }
*/

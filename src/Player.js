const weaponStrength = 10;
const healthIncrease = 50;
const experienceStep = 10;
const experienceForLevel = 40;
const levelStep = 1;

class Enemy {
  constructor(level = 1, experience = 10, health = 100) {
    this.level = level;
    this.experience = experience;
    this.health = health;
    this.alive = true;
    console.log("Initializing Enemy");
  }
  decreaseHealth(hit) {
    this.health -= hit;
    if (this.health <= 0) {
      this.alive = false;
    }
    console.log("Decreasing Health");
  }
  causeDamage() {
    return getRandomInt(this.level * 40 * 0.7, this.level * 50 * 1.3);
  }
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max + 1 - min)) + min; //Both are inclusive
}

class Player extends Enemy {
  constructor() {
    super();
    this.level = 1;
    this.experience = 1;
    this.health = 100;
    this.weapon = 10;
    this.maxHealth = 100 * 1;
    this.alive = true;
    console.log("Initializing Player ");
  }
  increaseHealth(recharge = healthIncrease) {
    // Max health is 100*experience
    this.health =
      this.health + recharge > this.maxHealth
        ? this.maxHealth
        : this.health + recharge;
  }
  causeDamage() {
    return (
      getRandomInt(this.level * 40 * 0.7, this.level * 50 * 1.3) +
      this.weapon * this.level
    );
  }
  collectWeapon() {
    this.weapon += weaponStrength;
  }
  fightRound(enemy) {
    // Player's move
    var mydamage = this.causeDamage();
    console.log("Player caused damage: ", mydamage);
    enemy.decreaseHealth(mydamage);
    console.log("Enemy health:", enemy.health);
    // Enemy's move
    if (enemy.alive) {
      var damage = enemy.causeDamage();
      console.log("Enemy caused damage: ", damage);
      this.decreaseHealth(damage);
      return false;
    } else {
      this.increaseExperience();
      return true;
    }
  }

  increaseExperience() {
    this.experience += experienceStep;
    if (this.experience >= experienceForLevel) {
      this.experience -= experienceForLevel;
      this.level += levelStep;
    }
  }
}

module.exports = {
  Player: Player,
  Enemy: Enemy,
  experienceForLevel: experienceForLevel
};

var myMap = require("./Map.js");
var myPlayer = require("./Player.js");

var loaded = false;
var loadedImagesCount = 0;

const mainItems = [
  [require("./img/wall.png"), new Image()],
  [require("./img/floor.png"), new Image()],
  [require("./img/main_guy.png"), new Image()],
  [require("./img/boss.png"), new Image()]
];
mainItems.forEach(function(el) {
  el[1].onload = () => {
    loadedImagesCount++;
    if (loadedImagesCount === 19) {
      isLoaded();
    }
  };
});
mainItems.forEach(function(el) {
  el[1].src = el[0];
});

const weaponItems = [
  [myMap.weapons[0], require("./img/weapon1.png"), new Image()],
  [myMap.weapons[1], require("./img/weapon2.png"), new Image()],
  [myMap.weapons[2], require("./img/weapon3.png"), new Image()],
  [myMap.weapons[3], require("./img/weapon4.png"), new Image()],
  [myMap.weapons[4], require("./img/weapon5.png"), new Image()]
];
weaponItems.forEach(function(el) {
  el[2].onload = () => {
    loadedImagesCount++;
    if (loadedImagesCount === 19) {
      isLoaded();
    }
  };
});
weaponItems.forEach(function(el) {
  el[2].src = el[1];
});

const healthItems = [
  [myMap.health[0], require("./img/health1.png"), new Image()],
  [myMap.health[1], require("./img/health2.png"), new Image()],
  [myMap.health[2], require("./img/health3.png"), new Image()],
  [myMap.health[3], require("./img/health4.png"), new Image()],
  [myMap.health[4], require("./img/health5.png"), new Image()]
];
healthItems.forEach(function(el) {
  el[2].onload = () => {
    loadedImagesCount++;
    if (loadedImagesCount === 19) {
      isLoaded();
    }
  };
});
healthItems.forEach(function(el) {
  el[2].src = el[1];
});

const imageEnemy = require("./img/main_enemy.png");
const enemyItems = [
  [myMap.enemies[0], imageEnemy, new Image(), new myPlayer.Enemy()],
  [myMap.enemies[1], imageEnemy, new Image(), new myPlayer.Enemy()],
  [myMap.enemies[2], imageEnemy, new Image(), new myPlayer.Enemy()],
  [myMap.enemies[3], imageEnemy, new Image(), new myPlayer.Enemy()],
  [myMap.enemies[4], imageEnemy, new Image(), new myPlayer.Enemy()]
];
enemyItems.forEach(function(el) {
  el[2].src = el[1];
});
enemyItems.forEach(function(el) {
  el[2].onload = () => {
    loadedImagesCount++;
    if (loadedImagesCount === 19) {
      isLoaded();
    }
  };
});

const isLoaded = function() {
  loaded = true;
  module.exports = {
    mainItems: mainItems,
    healthItems: healthItems,
    weaponItems: weaponItems,
    enemyItems: enemyItems,
    loaded: loaded
  };
};
/*
module.exports = {
  mainItems: mainItems,
  healthItems: healthItems,
  weaponItems: weaponItems,
  enemyItems: enemyItems,
  loaded: loaded
};*/

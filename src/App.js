import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";

import * as myMap from "./Map.js";
import * as myPlayer from "./Player.js";
//import * as myImage from "./ImageLoader.js";

var mainItems, weaponItems, healthItems, enemyItems;

// LOADING images

class App extends Component {
  render() {
    return (
      <div className="App">
        <Board />
      </div>
    );
  }
}

class Board extends Component {
  constructor(props) {
    super(props);
    this.state = {
      player: new myPlayer.Player(),
      dungeonLevel: 1,
      enemy: undefined,
      lastBattle: undefined
    };
  }
  updatePlayer = action => {
    switch (action) {
      case "increaseHealth":
        this.state.player.increaseHealth();
        break;
      case "collectWeapon":
        this.state.player.collectWeapon();
        break;
      case "afterFight":
        break;
    }
    this.setState({ player: this.state.player });
  };
  updateEnemy = enemy => {
    this.setState(
      { enemy: enemy }
      //console.log("Updating enemy: ", this.state.enemy)
    );
  };
  updateBattle = battle => {
    console.log("Updating battle: ", battle);
    this.setState(
      { lastBattle: battle },
      console.log("Battle updated: ", battle)
    );
  };
  render() {
    return (
      <div>
        <div className="title">
          <h1>Roguelike Game</h1>
          <h2>Kill the boss in dungeon 3</h2>
        </div>
        <div className="mainPanel">
          <GameStats
            player={this.state.player}
            dungeonLevel={this.state.dungeonLevel}
          />
          <EnemyStats
            player={this.state.player}
            enemy={this.state.enemy}
            lastBattle={this.state.lastBattle}
          />
          <CanvasComponent
            player={this.state.player}
            updatePlayer={this.updatePlayer}
            updateEnemy={this.updateEnemy}
            updateBattle={this.updateBattle}
            dungeonLevel={this.state.dungeonLevel}
          />
        </div>
      </div>
    );
  }
}

class CanvasComponent extends React.Component {
  constructor(props) {
    super(props);
    this.loadImages();
    this.state = {
      boardSizeX: myMap.mapArray[0].length,
      boardSizeY: myMap.mapArray.length,
      windowSize: 15,
      board: myMap.mapArray,
      boardItems: myMap.itemsArray,
      boardShadow: myMap.shadowArray,
      position: myMap.initialCo,
      enemy: enemyItems,
      imageLoaded: false,
      game: {
        currentLevel: 1,
        notificationOn: false,
        notificationText: "Let's try it..."
      }
    };
  }
  componentDidMount() {
    this.notifyPlayer("Let's play...", 2500);
  }
  notifyPlayer(text, time = 3000) {
    var gamestate = this.state.game;
    gamestate.notificationText = text;
    gamestate.notificationOn = true;
    this.setState({ game: gamestate }, () => {
      this.moveNotAllowed();
      setInterval(() => {
        var gamestate = this.state.game;
        gamestate.notificationText = "";
        gamestate.notificationOn = false;
        this.setState({ game: gamestate }, () => {
          this.moveAllowed();
        });
      }, time);
    });
  }

  loadImages() {
    var loaded = false;
    var loadedImagesCount = 0;

    mainItems = [
      [require("./img/wall.png"), new Image()],
      [require("./img/floor.png"), new Image()],
      [require("./img/main_guy.png"), new Image()],
      [require("./img/boss.png"), new Image(), new myPlayer.Enemy(), []]
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

    weaponItems = [
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

    healthItems = [
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
    enemyItems = [
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

    var isLoaded = () => {
      this.setState({ imageLoaded: true }, function() {
        this.drawMapBackground(15, 15);
        this.updateCanvas();
      });
    };
  }
  moveAllowed() {
    document.addEventListener("keydown", this.test, false);
  }
  moveNotAllowed() {
    document.removeEventListener("keydown", this.test);
  }
  test = e => {
    // space and arrow keys
    if ([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
      e.preventDefault();
      this.handleKeyPress();
    }
  };

  updateCanvas() {
    this.drawWindow();
    this.moveAllowed();
  }
  drawWindow() {
    var NUM_OF_TILES = this.state.windowSize * this.state.windowSize;
    const ctx = this.refs.canvasWindowMap.getContext("2d");

    var xmin, xmax, ymin, ymax;

    if (this.state.position[0] - 7 < 0) {
      xmin = 0;
      xmax = 14;
    } else if (this.state.position[0] + 7 >= this.state.boardSizeX) {
      xmin = this.state.boardSizeX - 15;
      xmax = this.state.boardSizeX - 1;
    } else {
      xmin = this.state.position[0] - 7;
      xmax = this.state.position[0] + 7;
    }

    if (this.state.position[1] - 7 < 0) {
      ymin = 0;
      ymax = 14;
    } else if (this.state.position[1] + 7 >= this.state.boardSizeY) {
      ymin = this.state.boardSizeY - 15;
      ymax = this.state.boardSizeY - 1;
    } else {
      ymin = this.state.position[1] - 7;
      ymax = this.state.position[1] + 7;
    }
    this.drawMapBackground(this.state.windowSize, this.state.windowSize);
    this.drawMap(this.state.windowSize, this.state.windowSize, xmin, ymin);
    this.drawItems(this.state.windowSize, this.state.windowSize, xmin, ymin);
    this.drawShadow(this.state.windowSize, this.state.windowSize, xmin, ymin);
  }
  drawMapBackground(xsize, ysize) {
    const ctxb = this.refs.canvasWindowBackground.getContext("2d");
    ctxb.width = xsize * 26;
    ctxb.height = ysize * 26;

    // Creating floor pattern
    var pat = ctxb.createPattern(mainItems[1][1], "repeat");
    ctxb.rect(0, 0, ctxb.width, ctxb.height);
    ctxb.fillStyle = pat;
    ctxb.fill();
  }
  drawMap(xsize, ysize, xstart, ystart) {
    var board, imageObj, tiles;

    const ctx = this.refs.canvasWindowMap.getContext("2d");

    tiles = [];
    board = this.state.board;
    //console.log(board);
    var tilesize = 26;
    ctx.width = xsize * 26;
    ctx.height = ysize * 26;
    ctx.clearRect(0, 0, xsize * tilesize, ysize * tilesize);
    var draw = function() {
      var theX;
      var theY;
      // 3. DRAW MAP BY ROWS AND COLS
      // console.log(tiles);
      for (var y = 0; y < ysize; y++) {
        for (var x = 0; x < xsize; x++) {
          theX = x * 26;
          theY = y * 26;
          //console.log(x,y)
          //console.log(tiles[x][y]);
          if (tiles[y][x] != undefined) {
            ctx.drawImage(tiles[y][x], theX, theY, 26, 26);
          }
        }
      }
    };
    // 2. SET UP THE MAP TILES
    var tilesIndY = 0;
    //console.log("Board before drawing MAP: ", this.state.board);
    var tiles = [];
    for (var y = ystart; y < ystart + ysize; y++) {
      tiles[tilesIndY] = [];
      for (var x = xstart; x < xstart + xsize; x++) {
        //console.log("x,y: ", x, y);
        if (this.state.board[y][x] === 1) {
          tiles[tilesIndY].push(mainItems[0][1]);
        } else {
          tiles[tilesIndY].push(undefined);
        }
      }
      tilesIndY++;
    }
    draw();
  }
  drawShadow(xsize, ysize, xstart, ystart) {
    var tilesize = 26;
    const ctx = this.refs.canvasWindowShadow.getContext("2d");
    ctx.clearRect(0, 0, xsize * tilesize, ysize * tilesize);

    for (var y = 0; y < ysize; y++) {
      for (var x = 0; x < xsize; x++) {
        if (this.state.boardShadow[y + ystart][x + xstart] === 2) {
          ctx.fillStyle = "black";
          ctx.fillRect(x * tilesize, y * tilesize, tilesize, tilesize);
        } else if (this.state.boardShadow[y + ystart][x + xstart] === 1) {
          ctx.fillStyle = "rgba(0,0,0,0.6)";
          ctx.fillRect(x * tilesize, y * tilesize, tilesize, tilesize);
        }
      }
    }
  }
  findItem = (x, y, array) => {
    for (var i = 0; i < array.length; i++) {
      //console.log("  Array item: ", array[i][0], " comparing with ", [x, y]);
      if (array[i][0][0] === x && array[i][0][1] === y) {
        //console.log("Found item in array", array, i, array[i]);
        return i;
      }
    }
    console.log("Item not found", x, y, array);
  };
  drawItems(xsize, ysize, xstart, ystart) {
    var board, imageObj, items;
    const ctx = this.refs.canvasWindowItems.getContext("2d");

    items = [];

    //console.log(board)
    var tilesize = 26;
    ctx.width = xsize * 26;
    ctx.height = ysize * 26;

    ctx.clearRect(0, 0, xsize * tilesize, ysize * tilesize);
    var draw = function() {
      var theX;
      var theY;
      // 3. DRAW MAP BY ROWS AND COLS
      //console.log("Printing items array");
      //console.log(items);
      for (var y = 0; y < ysize; y++) {
        for (var x = 0; x < xsize; x++) {
          theX = x * 26;
          theY = y * 26;
          //console.log(x,y)
          //console.log(tiles[board[x][y]])
          ctx.drawImage(items[y][x], theX, theY, 26, 26);
        }
      }
    };

    // 2. SET UP THE MAP TILES
    var p;
    var tilesIndY = 0;
    var items = [];
    var noImage = new Image();
    for (var y = ystart; y < ystart + ysize; y++) {
      items[tilesIndY] = [];
      for (var x = xstart; x < xstart + xsize; x++) {
        if (this.state.boardItems[y][x] === 5) {
          items[tilesIndY].push(mainItems[2][1]);
        } else if (this.state.boardItems[y][x] === 4) {
          items[tilesIndY].push(mainItems[3][1]);
        } else if (this.state.boardItems[y][x] === 1) {
          // health item
          p = this.findItem(x, y, healthItems);
          items[tilesIndY].push(healthItems[p][2]);
        } else if (this.state.boardItems[y][x] === 2) {
          // weapon item
          p = this.findItem(x, y, weaponItems);
          items[tilesIndY].push(weaponItems[p][2]);
        } else if (this.state.boardItems[y][x] === 3) {
          // enemy item
          p = this.findItem(x, y, enemyItems);
          items[tilesIndY].push(enemyItems[p][2]);
        } else {
          items[tilesIndY].push(noImage);
        }
      }
      tilesIndY++;
    }
    draw();
  }

  handleKeyPress(e) {
    var dir = "";
    e = e || window.event;

    if (e.keyCode == "38") {
      // up arrow
      console.log("up pressed");
      dir = "up";
    } else if (e.keyCode == "40") {
      // down arrow
      console.log("down pressed");
      dir = "down";
    } else if (e.keyCode == "37") {
      // left arrow
      console.log("left pressed");
      dir = "left";
    } else if (e.keyCode == "39") {
      // right arrow
      console.log("right pressed");
      dir = "right";
    } else {
      return null;
    }
    this.moveNotAllowed();
    this.playerMove(dir);
  }
  gameOver() {
    console.log("Game over");
    this.notifyPlayer("Game over. You lost", 2000);
  }
  playerMove(move) {
    var ox = this.state.position[0];
    var oy = this.state.position[1];
    var nx = ox;
    var ny = oy;
    switch (move) {
      case "up":
        if (oy - 1 >= 0 && this.state.board[oy - 1][ox] === 0) {
          ny = oy - 1;
        }
        break;
      case "down":
        if (
          oy + 1 <= this.state.boardSizeY &&
          this.state.board[oy + 1][ox] === 0
        ) {
          ny = oy + 1;
        }
        break;
      case "left":
        if (ox - 1 >= 0 && this.state.board[oy][ox - 1] === 0) {
          nx = ox - 1;
        }
        break;
      case "right":
        if (
          ox + 1 <= this.state.boardSizeX &&
          this.state.board[oy][ox + 1] === 0
        ) {
          nx = ox + 1;
        }
        break;
    }
    if (ox !== nx || oy !== ny) {
      //health Item
      if (this.state.boardItems[ny][nx] === 1) {
        this.props.updatePlayer("increaseHealth");
        this.updatePlayerPosition(ox, oy, nx, ny);
      } else if (this.state.boardItems[ny][nx] === 2) {
        //weapon Item
        this.props.updatePlayer("collectWeapon");
        this.updatePlayerPosition(ox, oy, nx, ny);
      } else if (
        this.state.boardItems[ny][nx] === 3 ||
        this.state.boardItems[ny][nx] === 4
      ) {
        //enemy
        var p = this.findItem(nx, ny, enemyItems);
        var result =
          this.state.boardItems[ny][nx] === 3
            ? this.props.player.fightRound(enemyItems[p][3])
            : this.props.player.fightRound(mainItems[3][2]);
        this.props.updateBattle(result);
        if (result[2]) {
          this.updatePlayerPosition(ox, oy, nx, ny);
          this.checkIfBossAppear();
          console.log(this.state.boardItems);
        } else {
          this.moveAllowed();
        }
        if (this.props.player.health <= 0) {
          this.gameOver();
        }
        this.props.updatePlayer("afterFight");
      } else {
        //nothing
        this.updatePlayerPosition(ox, oy, nx, ny);
      }
    } else {
      this.moveAllowed();
    }
    //printing closest enemy stats
    var adjacentEnemy = this.findAdjacentEnemy();
    if (adjacentEnemy) {
      this.props.updateEnemy(adjacentEnemy);
    } else {
      this.props.updateEnemy(undefined);
    }
  }
  findAdjacentEnemy() {
    var x = this.state.position[0];
    var y = this.state.position[1];
    //console.log("Finding adjacent enemy: ",this.state.position,this.state.enemy);
    for (var i = 0; i < this.state.enemy.length; i++) {
      if (
        (this.state.enemy[i][0][0] === x + 1 ||
          this.state.enemy[i][0][0] === x ||
          this.state.enemy[i][0][0] === x - 1) &&
        (this.state.enemy[i][0][1] === y + 1 ||
          this.state.enemy[i][0][1] === y ||
          this.state.enemy[i][0][1] === y - 1) &&
        this.state.enemy[i][3].alive
      ) {
        //console.log("Found adj enemy at ", this.state.enemy[i][0]);
        return this.state.enemy[i][3];
      }
    }
    // Looking for boss
    if (
      (mainItems[3][3][0] === x + 1 ||
        mainItems[3][3][0] === x ||
        mainItems[3][3][0] === x - 1) &&
      (mainItems[3][3][1] === y + 1 ||
        mainItems[3][3][1] === y ||
        mainItems[3][3][1] === y - 1) &&
      mainItems[3][2].alive
    ) {
      //console.log("Found adj enemy at ", this.state.enemy[i][0]);
      return mainItems[3][2];
    }
    return false;
  }
  checkIfBossAppear() {
    var empty = true;
    for (var i = 0; i < enemyItems.length; i++) {
      if (enemyItems[i][3].health >= 0) {
        empty = false;
      }
    }
    if (empty) {
      var oldA = this.state.boardItems;
      console.log(oldA);
      var co = myMap.choosePlace(oldA);
      oldA[co[1]][co[0]] = 4;
      console.log("Boss will be created");

      mainItems[3][2] = new myPlayer.Enemy(
        this.state.game.currentLevel + 1,
        0,
        (this.state.game.currentLevel + 1) * 100
      );
      //Adding position to boss item
      mainItems[3][3] = [co[0], co[1]];
      this.setState(
        {
          boardItems: oldA
        },
        () => {
          this.updateCanvas();
          this.notifyPlayer("The boss appeared", 6000);
        }
      );
    }
  }

  updatePlayerPosition = (ox, oy, nx, ny) => {
    // move the guy
    var items = this.state.boardItems;
    items[oy][ox] = 0;
    items[ny][nx] = 5;
    // move the shadow
    var newShadows = myMap.shineLight(this.state.boardShadow, nx, ny);
    // move also a viewpoint
    this.setState(
      {
        position: [nx, ny],
        boardItems: items,
        boardShadow: newShadows
      },
      function() {
        this.updateCanvas();
      }
    );
  };

  render() {
    //console.log(myPlayer.experienceForLevel);
    return (
      <div className="CanvasComponent">
        <canvas
          className="canvasWindow"
          id="canvasWindowBackground"
          ref="canvasWindowBackground"
          width={390}
          height={390}
        />
        <canvas
          className="canvasWindow"
          id="canvasWindowMap"
          ref="canvasWindowMap"
          width={390}
          height={390}
        />
        <canvas
          className="canvasWindow"
          id="canvasWindowItems"
          ref="canvasWindowItems"
          width={390}
          height={390}
        />
        <canvas
          className="canvasWindow"
          id="canvasWindowShadow"
          ref="canvasWindowShadow"
          width={390}
          height={390}
        />
        {this.state.game.notificationOn && (
          <Notification text={this.state.game.notificationText} />
        )}
      </div>
    );
  }
}

class GameStats extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className="GameStats">
        <h3>Game Stats</h3>
        <div className="statsItem">
          Health: <b>{this.props.player.health}</b>
        </div>
        <div className="statsItem">
          Experience: <b>{this.props.player.experience}</b>
          <br />
          Level: <b>{this.props.player.level}</b>
          <br />
          XP needed for the next level:
          <b>{myPlayer.experienceForLevel - this.props.player.experience}</b>
        </div>
        <div className="statsItem">
          Weapon Strength: <b>{this.props.player.weapon}</b>
          <br />
          Attack Range:{" "}
          <b>
            {this.props.player.damageRange()[0]} -
            {this.props.player.damageRange()[1]}
          </b>
        </div>
        <div className="statsItem">
          Dungeon level: <b>{this.props.dungeonLevel}</b>
        </div>
      </div>
    );
  }
}

class EnemyStats extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    if (this.props.lastBattle) {
      var battleWon =
        this.props.lastBattle[0] - this.props.lastBattle[1] > 0 ? true : false;
    }
    return (
      <div className="EnemyStats">
        <div>
          <h3>Last Battle</h3>
          <div className="statsItem">
            Inflicted damage:
            <br />
            You: {this.props.lastBattle && this.props.lastBattle[0]}
            <br />
            Opponent: {this.props.lastBattle && this.props.lastBattle[1]}
            <br />
            {battleWon && "You WON the last battle!"}
            {!battleWon &&
              this.props.lastBattle &&
              "You lost the last battle..."}
          </div>
        </div>
        <div>
          <h3>Enemy</h3>
          <div className="statsItem">
            Health:
            {this.props.enemy && this.props.enemy.health}
            <br />
            Attack Range:
            {this.props.enemy && this.props.enemy.damageRange()[0]} -
            {this.props.enemy && this.props.enemy.damageRange()[1]}
          </div>
        </div>
      </div>
    );
  }
}

class Notification extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      text: this.props.text
    };
  }
  componentDidMount() {
    console.log("Canvas text: ", this.state.text);
    const ctx = this.refs.canvasWindowNotif.getContext("2d");
    ctx.fillStyle = "rgba(0,0,0,0.7)";
    ctx.fillRect(0, 0, 390, 390);
    ctx.font = "40px Frijole";
    //ctx.font = "40px Archivo Black";
    //ctx.font = "60px Amatic SC";

    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.fillText(this.state.text, 195, 195);
  }
  render() {
    return (
      <canvas
        className="canvasWindow"
        id="canvasWindowNotif"
        ref="canvasWindowNotif"
        width={390}
        height={390}
      />
    );
  }
}

export default App;

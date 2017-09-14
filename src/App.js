import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import * as myMap from './Map.js';


const imagePerson = require('./img/main_guy.png')
const imageWall = require('./img/wall.png')
const imageFloor = require('./img/floor.png')
const imageEnemy = require('./img/main_enemy.png')
const imageWeapon = require('./img/sword.png')


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
  constructor(props){
    super(props);
  }
  render() {
    console.log(myMap.doors)
    return (
      <div>
        <CanvasComponent />
      </div>
    );
  }
}

class CanvasComponent extends React.Component {
    constructor(props){
      super(props);
      this.drawMap = this.drawMap.bind(this);
    }
    componentDidMount() {
        this.updateCanvas();
    }
    updateCanvas() {
      const ctx = this.refs.canvasMap.getContext('2d');

        var tilesize = 26
        var imgP = new Image();
        var imgF = new Image();
        //var imgW = new Image();

        imgP.onload = function () {
          console.log("drawing a person")
          ctx.drawImage(imgP,0,0);
        }
    /*    imgW.onload = function (x,y) {
          console.log("drawing a person")
          ctx.drawImage(imgW,x,y);
        }*/
        imgF.onload = function () {
          console.log("drawing a person")
          ctx.drawImage(imgF,26,0);
        }

      //  imgH.onload = load(imgH,130,100)
      //  imgE.onload = load(imgE,160,100)

      //  this.drawMap()
      this.drawMap()
      this.drawItems()

    }
    drawMap(){
      var board, imageObj, tiles;
      var NUM_OF_TILES = 60*40; // starting from ZERO

      const ctx = this.refs.canvasMap.getContext('2d');
      imageObj = new Image();
      tiles = [];
      board = myMap.mapArray;
      console.log(board)

      ctx.width = 60*26;
      ctx.height = 40*26;

      var draw = function() {
        var theX;
        var theY;
        // 3. DRAW MAP BY ROWS AND COLS
        console.log(tiles)
        for (var y = 0; y < myMap.mapArray.length; y++) {
          for (var x = 0; x < myMap.mapArray[y].length; x++) {
            theX = x * 26;
            theY = y * 26;
            //console.log(x,y)
            //console.log(tiles[board[x][y]])
            ctx.drawImage(tiles[y][x], theX, theY, 26, 26);
          }
        }
    }

    var loadedImagesCount = 0;

    // 2. SET UP THE MAP TILES
    for (var y = 0; y < myMap.mapArray.length; y++) {
      tiles[y] = []
      for (var x = 0; x < myMap.mapArray[y].length; x++) {
        var imageObj = new Image(); // new instance for each image
        if (myMap.mapArray[y][x] === 0) {
          imageObj.src = imageFloor;
        }
        else {
          imageObj.src = imageWall;
        }
        imageObj.onload = function() {
          loadedImagesCount++;
          //console.log("Loaded images: ", loadedImagesCount, " needing ", NUM_OF_TILES)
          if (loadedImagesCount===NUM_OF_TILES) draw();
        };
        tiles[y].push(imageObj);
        }
      }
    }
    drawShadow(){
    }
    drawItems(){
      var board, imageObj, items;
      var NUM_OF_ITEMS = 16;
      const ctx = this.refs.canvasItems.getContext('2d');
      imageObj = new Image();
      items = [];
      board = myMap.itemsArray;
      console.log(board)
      ctx.width = 60*26;
      ctx.height = 40*26;

      var draw = function() {
        var theX;
        var theY;
        // 3. DRAW MAP BY ROWS AND COLS
        console.log("Printing items array")
        console.log(items)
        for (var y = 0; y < myMap.mapArray.length; y++) {
          for (var x = 0; x < myMap.mapArray[y].length; x++) {
            theX = x * 26;
            theY = y * 26;
            //console.log(x,y)
            //console.log(tiles[board[x][y]])
            ctx.drawImage(items[y][x], theX, theY, 26, 26);
          }
        }
      }
      var loadedImagesCount = 0;

      // 2. SET UP THE MAP TILES
      for (var y = 0; y < myMap.mapArray.length; y++) {
        items[y] = []
        for (var x = 0; x < myMap.mapArray[y].length; x++) {
          var imageObj = new Image(); // new instance for each image
          if (myMap.itemsArray[y][x] === 4) {
            imageObj.src = imagePerson;
          }
          else if (myMap.itemsArray[y][x] === 1) { // health item
            imageObj.src = imageEnemy;
          }
          else if (myMap.itemsArray[y][x] === 2) { // weapon item
            imageObj.src = imageWeapon;
          }
          else if (myMap.itemsArray[y][x] === 3) { // enemy item
            imageObj.src = imageEnemy;
          }
          else // enemy
          {
            //imageObj.src = undefined;
          }
          imageObj.onload = function() {
            loadedImagesCount++;
            //console.log("Loaded images: ", loadedImagesCount, " needing ", NUM_OF_TILES)
            if (loadedImagesCount===NUM_OF_ITEMS) draw();
          };
          items[y].push(imageObj);
        }
      }
    }

    render() {

        return (
          <div>
            <canvas id="canvasMap" ref="canvasMap" width={1560} height={1040}/>
            <canvas id="canvasItems" ref="canvasItems" width={1560} height={1040}/>
</div>
        );
    }
}
export default App;

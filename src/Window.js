//import Map from './trial.js';
import * as myMap from './Map.js';

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max +1 - min)) + min; //Both are inclusive
}

var initroom = getRandomInt(0,myMap.rooms.length-1)
var initialx1 = myMap.rooms[initroom][0]
var initialx2 = myMap.rooms[initroom][1]
var initialy1 = myMap.rooms[initroom][2]
var initialy2 = myMap.rooms[initroom][3]

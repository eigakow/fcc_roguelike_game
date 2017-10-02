//board constrains
const xmax = 60;
const ymax = 40;
//room constrains
const rxsizemin = 6;
const rxsizemax = 15;
const rysizemin = 4;
const rysizemax = 15;
//door constrains
const doorsize = 3;
const wallsize = 1;
//others
const firstxmax = xmax - 20;
const firstymax = ymax - 20;

const maxGenRooms = 7;
var heathItems = 5;
var weaponItems = 5;
var enemies = 5;

var doors = [];
var rooms = [];
var mapArray = [];
var shadowArray = [];
var itemsArray = [];
var enemyArray = [];
var healthArray = [];
var weaponArray = [];
var initialCo = [];

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max + 1 - min)) + min; //Both are inclusive
}
// Remember, x2,y2 are inclusive!!!!

function genFirstRoom() {
  var sizex = getRandomInt(rxsizemin, rxsizemax);
  var sizey = getRandomInt(rysizemin, rysizemax);
  var x1 = getRandomInt(1, firstxmax);
  var y1 = getRandomInt(1, firstymax);
  return [x1, x1 + sizex, y1, y1 + sizey];
}

function getNextRoom(arr, position) {
  var sizex = getRandomInt(rysizemin, rysizemax);
  //console.log("Random x size: " + sizex)
  var sizey = getRandomInt(rysizemin, rysizemax);
  //console.log("Random y size: " + sizey)
  switch (position) {
    case "top":
      return [
        arr[0],
        arr[0] + sizex,
        arr[2] - wallsize - sizey,
        arr[2] - wallsize
      ];
    case "right":
      return [
        arr[1] + wallsize,
        arr[1] + wallsize + sizex,
        arr[2],
        arr[2] + sizey
      ];
    case "bottom":
      return [
        arr[1] - sizex,
        arr[1],
        arr[3] + wallsize,
        arr[3] + wallsize + sizey
      ];
    case "left":
      return [
        arr[0] - wallsize - sizex,
        arr[0] - wallsize,
        arr[3] - sizey,
        arr[3]
      ];
    default:
      return undefined;
  }
}

function getDoor(froom, sroom, position) {
  var maxtop, maxbottom, doortop, x1, maxleft, maxright, doorleft, y1;
  switch (position) {
    case "right":
      maxtop = froom[2];
      maxbottom = Math.min(froom[3], sroom[3]);
      doortop = getRandomInt(maxtop, maxbottom - doorsize);
      //for now we return smaller x, door should be drawn doorsize to the right
      x1 = froom[1];
      //      return [[x1, doortop],[x1, doortop+doorsize]]
      return [x1, x1 + wallsize, doortop, doortop + doorsize];
    case "left":
      maxtop = Math.max(froom[2], sroom[2]);
      maxbottom = froom[3];
      doortop = getRandomInt(maxtop, maxbottom - doorsize);
      //for now we return smaller x, door should be drawn doorsize to the right
      x1 = sroom[1];
      //      return [[x1, doortop],[x1, doortop+doorsize]]
      return [x1, x1 + wallsize, doortop, doortop + doorsize];
    case "top":
      maxleft = froom[0];
      maxright = Math.min(froom[1], sroom[1]);
      doorleft = getRandomInt(maxleft, maxright - doorsize);
      //for now we return smaller x, door should be drawn doorsize to the bottom
      y1 = sroom[3];
      // return [[doorleft, y1],[doorleft+doorsize, y1]]
      return [doorleft, doorleft + doorsize, y1, y1 + wallsize];
    case "bottom":
      maxleft = Math.max(froom[0], sroom[0]);
      maxright = froom[1];
      doorleft = getRandomInt(maxleft, maxright - doorsize);
      //for now we return smaller x, door should be drawn doorsize to the bottom
      y1 = froom[3];
      //return [[doorleft, y1],[doorleft+doorsize, y1]]
      return [doorleft, doorleft + doorsize, y1, y1 + wallsize];
    default:
      return null;
  }
}
function checkValidRoom(room, newroom) {
  var xover = false;
  var yover = false;
  var separate = false;
  //    withinRange=true;
  //    if (!(newroom[0] >=0 && newroom[1] <= xmax &&
  //        newroom[2] >=0 && newroom[3] <= ymax)){
  //      withinRange = false;
  //    }
  if (room[0] < newroom[1] && room[1] > newroom[0]) {
    //console.log("xover true")
    xover = true;
  }
  if (room[2] < newroom[3] && room[3] > newroom[2]) {
    //console.log("yover true")
    yover = true;
  }
  if (
    (room[1] < newroom[0] || room[0] > newroom[1]) &&
    (room[3] < newroom[2] || room[2] > newroom[3])
  ) {
    //console.log("no overlap")
    separate = true;
  }
  //    if (withinRange){
  if (separate) {
    return true;
  }
  if (xover) {
    if (!yover) {
      //console.log("only xover, valid")
      return true;
    }
  } else {
    if (yover) {
      //console.log("only yover, valid")
      return true;
    }
  }
  //    }
  return false;
  //console.log("Not valid for ",room,newroom)
}

function createNeighbourRooms(centerRoom) {
  var sides = ["top", "right", "bottom", "left"];
  var temproom = [];

  for (var z = 0; z < centerRoom.length; z++) {
    for (var i = 0; i < 4; i++) {
      //console.log("Trying to create " + sides[i] + " of " + centerRoom[z]);
      var newRoom = getNextRoom(centerRoom[z], sides[i]);

      //console.log("Checking " + newRoom)
      var validRoom = true;
      for (var x = 0; x < rooms.length; x++) {
        if (!checkValidRoom(rooms[x], newRoom)) {
          validRoom = false;
        }
      }
      if (
        !(
          newRoom[0] > 0 &&
          newRoom[1] < xmax &&
          newRoom[2] > 0 &&
          newRoom[3] < ymax
        )
      ) {
        validRoom = false;
      }
      if (validRoom) {
        //console.log("Valid room")
        rooms.push(newRoom);
        temproom.push(newRoom);
        var d = getDoor(centerRoom[z], newRoom, sides[i]);
        //console.log("Saving door between: ", centerRoom[z], " and ", newRoom, ": ", d)
        doors.push(d);
        //doors.push(getDoor(centerRoom[z],newRoom));
      }
    }
  }
  return temproom;
}

function buildMap() {
  //console.log("Building map");
  var first = genFirstRoom();
  var centerRooms = [first];
  rooms.push(first);

  for (var i = 0; i < maxGenRooms - 1; i++) {
    var nextGenRooms = createNeighbourRooms(centerRooms);
    centerRooms = nextGenRooms;
  }
  return rooms;
}

function translateIntoArray() {
  //create empty array/ walls (1)
  //create shadow array: 2 - full shadow
  //items - 0 empty
  var y, x, i;
  for (y = 0; y < ymax; y++) {
    mapArray.push([]);
    shadowArray.push([]);
    itemsArray.push([]);
    for (x = 0; x < xmax; x++) {
      mapArray[y].push(1);
      shadowArray[y].push(2);
      itemsArray[y].push(0);
    }
  }
  //console.log(mapArray);
  //Add rooms/floor (0)
  for (i = 0; i < rooms.length; i++) {
    for (y = rooms[i][2]; y < rooms[i][3]; y++) {
      for (x = rooms[i][0]; x < rooms[i][1]; x++) {
        mapArray[y][x] = 0;
      }
    }
  }
  //Add doors/floor (0)
  for (i = 0; i < doors.length; i++) {
    for (y = doors[i][2]; y < doors[i][3]; y++) {
      for (x = doors[i][0]; x < doors[i][1]; x++) {
        mapArray[y][x] = 0;
      }
    }
  }
}

function placeItems() {
  var choice, z;
  //player
  choice = choosePlace(itemsArray);
  itemsArray[choice[1]][choice[0]] = 5;
  initialCo = [choice[0], choice[1]];
  //boss
  //  choice = choosePlace(itemsArray);
  //  itemsArray[choice[1]][choice[0]] = 4;

  for (z = 0; z < heathItems; z++) {
    choice = choosePlace(itemsArray);
    itemsArray[choice[1]][choice[0]] = 1;
    healthArray.push(choice);
  }
  for (z = 0; z < weaponItems; z++) {
    choice = choosePlace(itemsArray);
    //console.log("WEAPON CHOSEN: ", choice)
    itemsArray[choice[1]][choice[0]] = 2;
    weaponArray.push(choice);
  }
  for (z = 0; z < enemies; z++) {
    choice = choosePlace(itemsArray);
    //console.log("ENEMY CHOSEN: ", choice)
    itemsArray[choice[1]][choice[0]] = 3;
    enemyArray.push(choice);
  }
  //console.log("Printing items");
  //console.log(itemsArray);
}

function choosePlace(array) {
  var room = getRandomInt(0, rooms.length - 1);
  var rx = getRandomInt(rooms[room][0], rooms[room][1] - 1);
  var ry = getRandomInt(rooms[room][2], rooms[room][3] - 1);
  console.log(array, rx, ry);
  if (array[ry][rx] === 0) {
    //console.log("Found a place: ",rx, ry)
    return [rx, ry];
  } else {
    //console.log("Not a correct: ",rx, ry)
    return choosePlace(array);
  }
}

function shineLight(shadowArray, x, y) {
  // full light - 0, half-light 1, full shadow 2
  //XXXVVVXXX                             x-1, x,y-4, x+1
  //XXXVOVXXX      x-1,y-3 = x+1,y-3          x-2,y-3; x+2,y-3
  //XXVOOOVXX      x-2,y-2 = x+2,y-2      x-3,y-2; x+3,y-2
  //XVOOOOOVX      x-3,y-1 = x+3,y-1      x-4,y-1; x+4,y-1
  //VOOOTOOOV      x-3,y = x+3,y          x-4,y; x+4,y
  //XVOOOOOVX      x-3,y+1 = x+3,y+1      x-4,y+1; x+4,y+1
  //XXVOOOVXX      x-2,y+2 = x+2,y+2      x-3,y+2; x+3,y+2
  //XXXVOVXXX      x-1,y+3 = x+1,y+3          x-2,y+3; x+2,y+3
  //XXXXVXXXX                             x-1,x,y+4,x+1

  var zeroShadow = [
    [x - 1, y - 3],
    [x, y - 3],
    [x + 1, y - 3],
    [x - 2, y - 2],
    [x - 1, y - 2],
    [x, y - 2],
    [x + 1, y - 2],
    [x + 2, y - 2],
    [x - 3, y - 1],
    [x - 2, y - 1],
    [x - 1, y - 1],
    [x, y - 1],
    [x + 1, y - 1],
    [x + 2, y - 1],
    [x + 3, y - 1],
    [x - 3, y],
    [x - 2, y],
    [x - 1, y],
    [x, y],
    [x + 1, y],
    [x + 2, y],
    [x + 3, y],
    [x - 3, y + 1],
    [x - 2, y + 1],
    [x - 1, y + 1],
    [x, y + 1],
    [x + 1, y + 1],
    [x + 2, y + 1],
    [x + 3, y + 1],
    [x - 2, y + 2],
    [x - 1, y + 2],
    [x, y + 2],
    [x + 1, y + 2],
    [x + 2, y + 2],
    [x - 1, y + 3],
    [x, y + 3],
    [x + 1, y + 3]
  ];
  var halfShadow = [
    [x - 1, y - 4],
    [x, y - 4],
    [x + 1, y - 4],
    [x - 2, y - 3],
    [x + 2, y - 3],
    [x - 3, y - 2],
    [x + 3, y - 2],
    [x - 4, y - 1],
    [x + 4, y - 1],
    [x - 4, y],
    [x + 4, y],
    [x - 4, y + 1],
    [x + 4, y + 1],
    [x - 3, y + 2],
    [x + 3, y + 2],
    [x - 2, y + 3],
    [x + 2, y + 3],
    [x - 1, y + 4],
    [x, y + 4],
    [x + 1, y + 4]
  ];
  //console.log("Zero shadow: ", zeroShadow);
  for (var z = 0; z < zeroShadow.length; z++) {
    if (
      zeroShadow[z][0] >= 0 &&
      zeroShadow[z][0] < xmax &&
      zeroShadow[z][1] >= 0 &&
      zeroShadow[z][1] < ymax
    ) {
      //console.log(z, zeroShadow[z]);
      shadowArray[zeroShadow[z][1]][zeroShadow[z][0]] = 0;
    }
  }
  //console.log("Half shadow: ", halfShadow);
  for (z = 0; z < halfShadow.length; z++) {
    //console.log(z)
    if (
      halfShadow[z][0] >= 0 &&
      halfShadow[z][0] < xmax &&
      halfShadow[z][1] >= 0 &&
      halfShadow[z][1] < ymax &&
      shadowArray[halfShadow[z][1]][halfShadow[z][0]] === 2
    ) {
      //console.log(z, halfShadow[z]);
      shadowArray[halfShadow[z][1]][halfShadow[z][0]] = 1;
    }
  }
  return shadowArray;
}

buildMap();
translateIntoArray();
placeItems();
shadowArray = shineLight(shadowArray, initialCo[0], initialCo[1]);

module.exports = {
  rooms: rooms,
  doors: doors,
  wallsize: wallsize,
  doorsize: doorsize,
  mapArray: mapArray,
  shadowArray: shadowArray,
  itemsArray: itemsArray,
  initialCo: initialCo,
  shineLight: shineLight,
  enemies: enemyArray,
  health: healthArray,
  weapons: weaponArray,
  choosePlace: choosePlace
};

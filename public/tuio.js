var client = new Tuio.Client({
    host: "http://localhost:3333"
}),

onAddTuioCursor = function(addCursor) {
  console.log(addCursor);
},

onUpdateTuioCursor = function(updateCursor) {
  console.log(updateCursor);
},

onRemoveTuioCursor = function(removeCursor) {
  console.log(removeCursor);
},

onAddTuioObject = function(addObject) {
    console.log(addObject);
},

onUpdateTuioObject = function(updateObject) {
    console.log(updateObject);
},

onRemoveTuioObject = function(removeObject) {
    console.log(removeObject);
},

onRefresh = function(time) {
  console.log(time);
};

client.on("addTuioCursor", onAddTuioCursor);
client.on("updateTuioCursor", onUpdateTuioCursor);
client.on("removeTuioCursor", onRemoveTuioCursor);
client.on("addTuioObject", onAddTuioObject);
client.on("updateTuioObject", onUpdateTuioObject);
client.on("removeTuioObject", onRemoveTuioObject);
client.on("refresh", onRefresh);
client.connect();

// external js: draggabilly.pkgd.js
//touching file to push

let draggie = new Draggabilly(".draggable");
draggie.on("staticClick", function () {
  console.log("staticClick");
});

// external js: draggabilly.pkgd.js

let draggie = new Draggabilly(".draggable");
draggie.on("staticClick", function () {
  console.log("staticClick");
});

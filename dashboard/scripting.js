// Initialize Draggabilly for all draggable elements
document
  .querySelectorAll(
    ".draggable1, .draggable2, .draggable3, .draggable4, .draggable5, .draggable6, .draggable7, .draggable8"
  )
  .forEach((item) => {
    new Draggabilly(item);
  });

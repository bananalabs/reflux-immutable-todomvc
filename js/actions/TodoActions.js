var Reflux = require('reflux');

var TodoActions = Reflux.createActions([
  "create",
  "updateText",
  "complete",
  "undoComplete",
  "toggleCompleteAll",
  "destroy",
  "destroyCompleted",
  "historySet",
  "versionSelected",
  "undo",
  "redo"  
]);

module.exports = TodoActions;

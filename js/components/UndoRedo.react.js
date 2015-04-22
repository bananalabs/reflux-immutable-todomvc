var React = require('react');
var TodoActions = require('../actions/TodoActions');

var UndoRedo = React.createClass({

  undo : function() {
      console.log("undo");
      TodoActions.undo();
  },

  redo : function() {
      console.log("redo");
      TodoActions.redo();
  },

  /**
   * @return {object}
   */
  render: function() {

    return <div id="undoredo">
      <div>
        <a onClick={this.undo}>Undo</a>
      </div>
      <div>
        <a onClick={this.redo}>Redo</a>
      </div>
    </div>;

  },
  
});

module.exports = UndoRedo;

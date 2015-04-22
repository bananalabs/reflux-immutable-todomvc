var React = require('react');
var ReactPropTypes = React.PropTypes;
var TodoActions = require('../actions/TodoActions');

var HistoryListItem = React.createClass({

  propTypes: {
    historyIndex : ReactPropTypes.number.isRequired,
    historyEntry: ReactPropTypes.object.isRequired
  },

  versionClicked : function() {
    TodoActions.versionSelected(this.props.historyIndex);    
  },

  /**
   * @return {object}
   */
  render: function() {    

    return <li
      key={"history-entry-" + this.props.historyIndex}>
      <a onClick={this.versionClicked}>{"Version: " + this.props.historyIndex}</a>
    </li>;    

  }
});

module.exports = HistoryListItem;

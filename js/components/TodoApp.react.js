/**
 * Copyright (c) 2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

/**
 * This component operates as a "Controller-View".  It listens for changes in
 * the TodoStore and passes the new data to its children.
 */

var Footer = require('./Footer.react');
var Header = require('./Header.react');
var MainSection = require('./MainSection.react');
var HistoryList = require('./HistoryList.react');
var UndoRedo = require('./UndoRedo.react');
var React = require('react');
var todoStore = require('../stores/TodoStore');
var Reflux = require('reflux');

var TodoApp = React.createClass({

  // this will cause setState({todos:todos}) 
  // whenever the store does trigger(todos)
  mixins: [Reflux.connect(todoStore,"todos")],

  getInitialState: function() {
    return {
      todos : 
      { allTodos: {},
        allHistoryEntries : [],
        areAllComplete: false
      }
    };
  },

  /**
   * @return {object}
   */
  render: function() {
  	return (
      <div>
        <HistoryList allHistoryEntries={this.state.todos.allHistoryEntries} />
        <UndoRedo/>
        <Header />
        <MainSection
          allTodos={this.state.todos.allTodos}
          areAllComplete={this.state.todos.areAllComplete}
        />
        <Footer allTodos={this.state.todos.allTodos} />        
      </div>      
  	);
  },

});

module.exports = TodoApp;

/*
 * Copyright (c) 2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * TodoStore
 */

var Reflux = require('reflux');   
var TodoActions = require('../actions/TodoActions.js');
var assign = require('object-assign');
var Immutable = require('immutable');

var CHANGE_EVENT = 'change';

var _history = [],
    _currentVersion = 0,
    _todos = Immutable.OrderedMap();


var TodoRecord = Immutable.Record({
  id : null,
  complete : false,
  text : 'A brand new thing to do!'
});  

var TodoStore = Reflux.createStore({
  listenables: [TodoActions],

  /**
     * Tests whether all the remaining TODO items are marked as completed.
     * @return {boolean}
     */
    areAllComplete: function() {
      for (var id in _todos) {
        if (!_todos.getIn([id, 'complete'])) {
          return false;
        }
      }
      return true;
    },

    /**
     * Get the entire collection of TODOs.
     * @return {object}
     */
    getAll: function() {
      return _todos.toObject();
    },

    getHistory : function () {
      return _history;
    },

    addHistoryEntry : function() {
      _history.push(_todos);
      _currentVersion = _history.length-1;
    },

    goToHistory : function(index) {
      _todos = _history[index];            
    },

    onVersionSelected : function(index) {
      _todos = _history[index];
      this.trigger({
        allTodos: _todos.toObject(),
        allHistoryEntries : this.getHistory(),
        areAllComplete: this.areAllComplete()
      });
    },
  
    /**
     * Update a TODO item.
     * @param  {string} id
     * @param {object} updates An object literal containing only the data to be
     *     updated.
     */
    update : function(id, updates) {
      _todos = _todos.set(id, _todos.get(id).merge(updates));
      this.trigger({
        allTodos: this.getAll(),
        allHistoryEntries : this.getHistory(),
        areAllComplete: this.areAllComplete()
      });
    },

    updateWithHistory : function (id, updates) {
      this.update(id, updates);
      this.addHistoryEntry();
    },

    /**
     * Delete a TODO item.
     * @param  {string} id
     */
    destroy : function(id) {
      _todos = _todos.delete(id);
      this.trigger({
        allTodos: _todos.toObject(),
        allHistoryEntries : this.getHistory(),
        areAllComplete: this.areAllComplete()
      });
    },

    destroyWithHistory : function(id) {      
      this.destroy(id);
      this.addHistoryEntry();
    },

    /**
     * Create a TODO item.
     * @param  {string} text The content of the TODO
     */
    onCreate : function(text) {
      // Hand waving here -- not showing how this interacts with XHR or persistent
      // server-side storage.
      // Using the current timestamp + random number in place of a real id.
      text = text.trim();
      if (text !== '') {
          var id = (+new Date() + Math.floor(Math.random() * 999999)).toString(36);                    
          if (_todos.length === 0) {
            //Make the first entry the empty list            
            this.addHistoryEntry();      
          }
          _todos = _todos.set(id, new TodoRecord({id : id, text : text}));
          this.addHistoryEntry();      
          this.trigger({
            allTodos: this.getAll(),
            allHistoryEntries : this.getHistory(),
            areAllComplete: this.areAllComplete()
          });
      }
    },

    onUndoComplete : function(id) {
      this.updateWithHistory(id, {complete: false});
    },
    
    /**
     * Update all of the TODO items with the same object.
     * the data to be updated.  Used to mark all TODOs as completed.
     * @param  {object} updates An object literal containing only the data to be
     * updated.
     */
    onToggleCompleteAll : function() {
      var complete = this.areAllComplete();      
      for (var id in _todos.toObject()) {
        this.update(id, {complete : !complete});
      }
      this.addHistoryEntry();
    },

    onComplete : function(id) {        
      this.updateWithHistory(id, {complete: true});      
    },

    onHistorySet : function(id) {        
      this.goToHistory(id);
    },

    onUpdateText : function(id, text) {        
      text = text.trim();
      if (text !== '') {
        this.updateWithHistory(id, {text: text});
      }
    },

    onDestroy : function(id) {        
      this.destroyWithHistory(id);
    },

    /**
     * Delete all the completed TODO items.
     */
    onDestroyCompleted : function() {      
      for (var id in _todos.toObject()) {
        if (_todos.getIn([id, 'complete'])) {
          this.destroy(id);
        }
      }
      this.addHistoryEntry();
    },            

    onUndo : function() {      
      if (_currentVersion)  {
        _currentVersion--;      
      }        
      _todos = _history[_currentVersion];
      this.trigger({
        allTodos: _todos.toObject(),
        allHistoryEntries : this.getHistory(),
        areAllComplete: this.areAllComplete()
      });              
    },

    onRedo : function() {  
      if (_currentVersion < _history.length)  {
        _currentVersion++;      
      }     
      _todos = _history[_currentVersion];
      this.trigger({
        allTodos: _todos.toObject(),
        allHistoryEntries : this.getHistory(),
        areAllComplete: this.areAllComplete()
      });
    }
});

module.exports = TodoStore;

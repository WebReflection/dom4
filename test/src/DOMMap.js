// a WeakMap fallback for DOM nodes as key
var DOMMap = window.WeakMap || (function () {'use strict';

  /*! (C) Andrea Giammarchi */

  var
    Event = window.CustomEvent || function (type) {
      var e = document.createEvent('Event');
      e.initEvent(type, false, false);
      return e;
    },
    counter = 0,
    dispatched = false,
    drop = false,
    value
  ;

  function dispatch(key, ce, shouldDrop) {
    drop = shouldDrop;
    dispatched = false;
    value = undefined;
    key.dispatchEvent(ce);
  }

  function Handler(value) {
    this.value = value;
  }

  Handler.prototype.handleEvent = function handleEvent(e) {
    dispatched = true;
    if (drop) {
      e.currentTarget.removeEventListener(e.type, this, false);
    } else {
      value = this.value;
    }
  };

  function DOMMap() {
    counter++;  // make id clashing highly improbable
    this.__ce__ = new Event(('@DOMMap:' + counter) + Math.random());
  }

  DOMMap.prototype = {
    'constructor': DOMMap,
    'delete': function del(key) {
      return dispatch(key, this.__ce__, true), dispatched;
    },
    'get': function get(key) {
      dispatch(key, this.__ce__, false);
      var v = value;
      value = undefined;
      return v;
    },
    'has': function has(key) {
      return dispatch(key, this.__ce__, false), dispatched;
    },
    'set': function set(key, value) {
      dispatch(key, this.__ce__, true);
      key.addEventListener(this.__ce__.type, new Handler(value), false);
      return this;
    },
  };

  return DOMMap;

}());

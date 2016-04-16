(function (window){'use strict';

  // a WeakMap fallback for DOM nodes as key
  var DOMMap = window.WeakMap || (function () {

    /*! (C) Andrea Giammarchi */

    var
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

  // https://dom.spec.whatwg.org/#interface-eventtarget

  function createEventListener(rEL, type, callback, options) {
    function eventListener(e) {
      if (eventListener.once) {
        rEL.call(e.currentTarget, e.type, eventListener, true);
        eventListener.removed = true;
      }
      if (eventListener.passive) {
        e.preventDefault = createEventListener.preventDefault;
      }
      if (typeof eventListener.callback === 'function') {
        eventListener.callback.call(this, e);
      } else if (eventListener.callback) {
        eventListener.callback.handleEvent(e);
      }
    }
    eventListener.type = type;
    eventListener.callback = callback;
    eventListener.capture = !!options.capture;
    eventListener.passive = !!options.passive;
    eventListener.once = !!options.once;
    eventListener.removed = false;
    return createEventListener;
  }

  createEventListener.preventDefault = function preventDefault() {};

  var
    Event = window.CustomEvent || function (type) {
      var e = document.createEvent('Event');
      e.initEvent(type, false, false);
      return e;
    },
    hOP = Object.prototype.hasOwnProperty,
    dE = window.dispatchEvent,
    aEL = window.addEventListener,
    rEL = window.removeEventListener,
    counter = 0,
    increment = function () { counter++; }
  ;

  try {
    aEL('_', increment, {once: true});
    dE(new Event('_'));
    dE(new Event('_'));
    rEL('_', increment, {once: true});
  } catch(o_O) {}

  if (counter !== 1) {
    (function () {
      var dm = new DOMMap();
      function createAEL(aEL) {
        return function addEventListener(type, handler, options) {
          if (typeof options === 'object') {
            var info = dm.get(this), i, tmp;
            if (!info) dm.set(this, (info = {}));
            if (!hOP.call(info, type)) info[type] = {
              handler: [],
              wrap: []
            };
            tmp = info[type];
            i = tmp.handler.indexOf(handler);
            if (i < 0) {
              i = tmp.handler.push(handler) - 1;
              tmp.wrap[i] = createEventListener(rEL, type, handler, options);
              aEL.call(this, type, tmp.wrap[i], tmp.wrap[i].capture);
            }
          } else {
            aEL.call(this, type, handler, options);
          }
        };
      }
      function createREL(rEL) {
        return function removeEventListener(type, handler, options) {
          if (typeof options === 'object') {
            var info = dm.get(this), i, tmp;
            if (info && hOP.call(info, type)) {
              tmp = info[type];
              i = tmp.handler.indexOf(handler);
              if (-1 < i) {
                rEL.call(this, type, tmp.wrap[i], tmp.wrap[i].capture);
                tmp.handler.splice(i, 1);
                tmp.wrap.splice(i, 1);
                if (tmp.handler.length === 0)
                  delete info[type];
              }
            }
          } else {
            rEL.call(this, type, handler, options);
          }
        };
      }

      window.addEventListener = createAEL(aEL);
      window.removeEventListener = createREL(rEL);

    }());
  }

}(self));
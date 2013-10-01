(function(window){'use strict';
  /* jshint loopfunc: true, noempty: false*/
  // https://dvcs.w3.org/hg/domcore/raw-file/tip/Overview.html#interface-element
  // https://dvcs.w3.org/hg/domcore/raw-file/tip/Overview.html#dom-rootnode-prepend
  function textNodeIfString(node) {
    return typeof node === 'string' ? window.document.createTextNode(node) : node;
  }
  function mutationMacro(nodes) {
    if (nodes.length === 1) {
      return textNodeIfString(nodes[0]);
    }
    for (var
      fragment = window.document.createDocumentFragment(),
      list = slice.call(nodes),
      i = 0; i < nodes.length; i++
    ) {
      fragment.appendChild(textNodeIfString(list[i]));
    }
    return fragment;
  }
  for(var
    property,
    DOMTokenList,
    trim = /^\s+|\s+$/g,
    spaces = /\s+/,
    SPACE = '\x20',
    ElementPrototype = (window.Element || window.HTMLElement || window.Node).prototype,
    properties = [
      'prepend', function prepend() {
        var firstChild = this.firstChild,
            node = mutationMacro(arguments);
        if (firstChild) {
          this.insertBefore(node, firstChild);
        } else {
          this.appendChild(node);
        }
      },
      'append', function append() {
        this.appendChild(mutationMacro(arguments));
      },
      'before', function before() {
        var parentNode = this.parentNode;
        if (parentNode) {
          parentNode.insertBefore(
            mutationMacro(arguments), this
          );
        }
      },
      'after', function after() {
        var parentNode = this.parentNode,
            nextSibling = this.nextSibling,
            node = mutationMacro(arguments);
        if (parentNode) {
          if (nextSibling) {
            parentNode.insertBefore(node, nextSibling);
          } else {
            parentNode.appendChild(node);
          }
        }
      },
      'replace', function replace() {
        var parentNode = this.parentNode;
        if (parentNode) {
          parentNode.replaceChild(
            mutationMacro(arguments),
            this
          );
        }
      },
      'remove', function remove() {
        var parentNode = this.parentNode;
        if (parentNode) {
          parentNode.removeChild(this);
        }
      }
    ],
    slice = properties.slice,
    i = properties.length; i; i -= 2
  ) {
    property = properties[i - 2];
    if (!(property in ElementPrototype)) {
      ElementPrototype[property] = properties[i - 1];
    }
  }
  if (!('classList' in ElementPrototype)) {
    // http://www.w3.org/TR/domcore/#domtokenlist
    DOMTokenList = function (node) {
      var classes = node.className.replace(trim, '').split(spaces);
      classes.push.apply(this, classes);
      this._ = node;
    };
    DOMTokenList.prototype = {
      length: 0,
      add: function add(className) {
        for(var
          classes = className.toLowerCase().replace(trim, '').split(spaces),
          push = classes.push,
          j = 0; j < classes.length; j++
        ) {
          if (!this.contains(classes[j])) {
            push.call(this, classes[j]);
          }
        }
        this._.className = classes.join.call(this, SPACE);
      },
      contains: (function(indexOf){
        return function contains(className) {
          i = indexOf.call(this, className.toLowerCase());
          return -1 < i;
        };
      }([].indexOf || function (className) {
        i = this.length;
        while(i-- && this[i] !== className){}
        return i;
      })),
      remove: function remove(className) {
        for(var
          classes = className.toLowerCase().replace(trim, '').split(spaces),
          splice = classes.splice,
          j = 0; j < classes.length; j++
        ) {
          if (this.contains(classes[j])) {
            splice.call(this, i, 1);
          }
        }
        this._.className = classes.join.call(this, SPACE);
      }
    };
    (Object.defineProperty || function (object, property, descriptor) {
      object.__defineGetter__(property, descriptor.get);
    })(ElementPrototype, 'classList', {
      get: function () {
        return new DOMTokenList(this);
      }
    });
  }
}(window));
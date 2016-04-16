//remove:
var main = require('../build/dom4.node.js');
//:remove

function create(name) {
  return document.createElement(name);
}

wru.test([
  {
    name: 'EventTarget.addEventListener(once)',
    test: function () {
      var div = create('div');
      var i = 0;
      var increment = function () { i++; };
      div.addEventListener('test', increment, {once: true});
      div.dispatchEvent(new CustomEvent('test'));
      div.dispatchEvent(new CustomEvent('test'));
      wru.assert('it was actually executed once', i === 1);
    }
  },
  {
    name: 'EventTarget.addEventListener(passive)',
    test: function () {
      var div = create('div');
      var defaultPrevented;
      var preventDefault = function (e) {
        e.preventDefault();
        defaultPrevented = e.defaultPrevented;
      };
      div.addEventListener('test', preventDefault, {passive: true});
      div.dispatchEvent(new CustomEvent('test'));
      div.removeEventListener('test', preventDefault, {passive: true});
      wru.assert('preventDefault had no effect', false === defaultPrevented);
    }
  },
  {
    name: 'EventTarget.addEventListener(once, passive)',
    test: function () {
      var i = 0;
      var div = create('div');
      var defaultPrevented;
      var preventDefault = function (e) {
        i++;
        e.preventDefault();
        defaultPrevented = e.defaultPrevented;
      };
      div.addEventListener('test', preventDefault, {once: true, passive: true});
      div.dispatchEvent(new CustomEvent('test'));
      div.dispatchEvent(new CustomEvent('test'));
      wru.assert('invoked only once', 1 === i);
      wru.assert('preventDefault had no effect', false === defaultPrevented);
    }
  },
  {
    name: 'EventTarget.addEventListener(capture)',
    test: function () {
      var div = create('div');
      var regularPhase;
      var objectPhase;
      var test = function (e) {
        regularPhase = e.eventPhase;
      };
      div.addEventListener('test', test, true);
      div.removeEventListener('test', test, true);
      div.addEventListener('test', function (e) {
        objectPhase = e.eventPhase;
      }, {once: true, capture: true});
      wru.assert('it worked', regularPhase === objectPhase);
    }
  },
  {
    name: "prototype has methods",
    test: function () {
      var div = create('div');
      wru.assert('.prepend()', div.prepend);
      wru.assert('.append()', div.append);
      wru.assert('.before()', div.before);
      wru.assert('.after()', div.after);
      wru.assert('.replace()', div.replace);
      wru.assert('.remove()', div.remove);
    }
  },{
    name: 'document.head',
    test: function () {
      wru.assert('found it', !!document.head);
    }
  },{
    name: 'prepend',
    test: function () {
      var div = create('div'),
          first = div.appendChild(create('div')),
          another = create('div');
      div.prepend(another);
      wru.assert(
        "Pre-insert node into the context object before the context object's first child.",
        div.firstChild === another &&
        div.lastChild === first
      );
      div.prepend(
        create('one'),
        'two',
        create('three')
      );
      wru.assert(
        'works with multiple nodes',
        div.childNodes.length === 5 &&
        div.firstChild.nodeName.toLowerCase() === 'one' &&
        div.childNodes[1].nodeType !== 1 &&
        div.childNodes[1].nodeValue === 'two' &&
        div.childNodes[2].nodeName.toLowerCase() === 'three' &&
        div.childNodes[3] === another &&
        div.childNodes[4] === first
      );
    }
  }, {
    name: 'append',
    test: function () {
      var div = create('div'),
          first = div.appendChild(create('div')),
          another = create('div');
      div.append(another);
      wru.assert(
        "Append node to the context object.",
        div.firstChild === first &&
        div.lastChild === another
      );
      div.append(
        create('one'),
        'two',
        create('three')
      );
      wru.assert(
        'works with multiple nodes',
        div.childNodes[0] === first &&
        div.childNodes[1] === another &&
        div.childNodes[2].nodeName.toLowerCase() === 'one' &&
        div.childNodes[3].nodeType !== 1 &&
        div.childNodes[3].nodeValue === 'two' &&
        div.childNodes[4].nodeName.toLowerCase() === 'three'
      );
    }
  }, {
    name: 'before',
    test: function () {
      var div = create('div'),
          first = div.appendChild(create('div')),
          node = create('div');
      wru.assert(
        'If the context object does not have a parent, terminate these steps',
        !div.before(node)
      );
      first.before(node);
      wru.assert(
        "Pre-insert node into the context object's parent before the context object.",
        div.firstChild === node
      );
      first.before(create('one'), 'two');
      wru.assert(
        'works with multiple nodes',
        div.childNodes[0] === node &&
        div.childNodes[1].nodeName.toLowerCase() === 'one' &&
        div.childNodes[2].nodeType !== 1 &&
        div.childNodes[2].nodeValue === 'two' &&
        div.childNodes[3] === first
      );
    }
  }, {
    name: 'after',
    test: function () {
      var div = create('div'),
          first = div.appendChild(create('div')),
          node = create('div');
      wru.assert(
        'If the context object does not have a parent, terminate these steps',
        !div.after(node)
      );
      first.after(node);
      wru.assert(
        "Pre-insert node into the context object's parent before the context object's next sibling.",
        div.lastChild === node
      );
      first.after(create('one'), 'two');
      wru.assert(
        'works with multiple nodes',
        div.childNodes[0] === first &&
        div.childNodes[1].nodeName.toLowerCase() === 'one' &&
        div.childNodes[2].nodeType !== 1 &&
        div.childNodes[2].nodeValue === 'two' &&
        div.childNodes[3] === node
      );
    }
  }, {
    name: 'replaceWith',
    test: function () {
      var div = create('div'),
          first = div.appendChild(create('div')),
          node = create('div');
      wru.assert(
        'If the context object does not have a parent, terminate these steps',
        !div.replace(node)
      );
      first.replace(node);
      wru.assert(
        "Replace the context object with node within the context object's parent.",
        div.firstChild === node &&
        div.childNodes.length === 1
      );
      node.replace(create('one'), 'two');
      wru.assert(
        'works with multiple nodes',
        div.childNodes[0].nodeName.toLowerCase() === 'one' &&
        div.childNodes[1].nodeType !== 1 &&
        div.childNodes[1].nodeValue === 'two' &&
        div.childNodes.length === 2
      );
    }
  }, {
    name: 'remove',
    test: function () {
      var div = create('div'),
          first = div.appendChild(create('div'));
      wru.assert(
        'If the context object does not have a parent, terminate these steps',
        !div.remove()
      );
      first.remove();
      wru.assert(
        "Remove the context object from the context object's parent.",
        div.childNodes.length === 0
      );
    }
  }, {
    name: 'DOMTokenList',
    test: function () {
      wru.assert('it exists', create('div').classList);
    }
  }, {
    name: 'DOMTokenList#length',
    test: function () {
      var div = create('div'),
          classList = div.classList;
      wru.assert('no tokens', classList.length === 0);
      div.className = 'a b c';
      classList = div.classList;
      wru.assert('3 tokens', classList.length === 3);
      classList.remove('a', 'b');
      wru.assert('1 token', classList.length === 1);
      classList.remove('c');
      wru.assert('no tokens', classList.length === 0);
    }
  }, {
    name: 'DOMTokenList#item(i)',
    test: function () {
      var div = create('div'),
          classList = div.classList;
      wru.assert('returns null', classList.item(0) === null);
      // ASHA returns empty string in here o_O
      wru.assert('returns falsy', !classList[0]);
      classList.add('z');
      wru.assert('returns z', classList.item(0) === 'z');
      wru.assert('returns [] z', classList[0] == 'z');
      classList.add('Z');
      wru.assert('returns Z', classList.item(1) === 'Z');
      wru.assert('returns [] Z', classList[1] == 'Z');
      wru.assert('returns still z', classList.item(0) === 'z');
      wru.assert('returns still [] z', classList[0] == 'z');
    }
  }, {
    name: 'DOMTokenList#contains(token)',
    test: function () {
      var div = create('div'),
          classList = div.classList;
      wru.assert('no bla', classList.contains('bla') === false);
      div.className = 'bla';
      classList = div.classList;
      wru.assert('yes bla', classList.contains('bla') === true);
      wru.assert('no Bla', classList.contains('Bla') === false);
      classList.add('Bla');
      wru.assert('yes Bla', classList.contains('Bla') === true);
      wru.assert('still bla', classList.contains('bla') === true);
      try {
        classList.contains('');
      } catch(e) {
        wru.assert('throws with empty strings', 1);
        try {
          classList.contains('a ');
        } catch(e) {
          wru.assert('throws with spaces', 1);
        }
      }
    }
  }, {
    name: 'DOMTokenList#add(tokens...)',
    test: function () {
      var div = create('div'),
          classList = div.classList;
      classList.add('a', 'b', 'c');
      wru.assert('added all the things', div.className === 'a\x20b\x20c');
      classList.add('z');
      wru.assert('added z too', div.className === 'a\x20b\x20c\x20z');
      classList.add('b');
      wru.assert('did not add b again', div.className === 'a\x20b\x20c\x20z');
    }
  }, {
    name: 'DOMTokenList#remove(tokens...)',
    test: function () {
      var div = create('div'),
          classList;
      div.className = 'a\x20b\x20c';
      classList = div.classList;
      classList.remove('a', 'c');
      wru.assert('removed two tokens', div.className === 'b');
      classList.remove('b');
      wru.assert('removed last token', div.className === '');
      classList.remove('b');
      wru.assert('nothing happened', div.className === '');
    }
  }, {
    name: 'DOMTokenList#toggle(token, force)',
    test: function () {
      var div = create('div'),
          classList = div.classList;
      classList.add('a');
      wru.assert('If token is a case-sensitive match for one of tokens and force is not true (either false or omitted)',
        classList.toggle('a') === false && classList.length === 0);
      classList.add('b');
      wru.assert('If token is a case-sensitive match for one of tokens and force is true (neither false nor omitted)',
        classList.toggle('b', true) && classList.length === 1 && classList[0] === 'b');
      wru.assert('If force is false (neither true nor omitted)',
        classList.toggle('z', false) === false && !classList.contains('z'));
      wru.assert('If force is true',
        classList.toggle('z', true) === true && classList.contains('z'));
      wru.assert('If force is omitted same as true',
        classList.toggle('t', true) === true && classList.contains('t'));

      wru.assert('If token is NOT in tokens append token to tokens and return true.',
        classList.toggle('not-there') === true && classList.contains('not-there'));
      wru.assert('If token is in tokens and force is either not passed or is false, remove token from tokens and return false',
        classList.toggle('not-there') === false && !classList.contains('not-there'));
    }
  }, {
    name: 'DOMTokenList#toString()',
    test: function () {
      var div = create('div');
      div.className = 'a\x20b\x20c\x20d';
      wru.assert('same as classname', div.className == div.classList);
    }
  }, {
    name: 'CustomEvent',
    test: function () {
      var
        detail = {},
        e = new CustomEvent('type')
      ;
      wru.assert('right type', e.type === 'type');
      wru.assert('detail not attached', e.detail == null);
      wru.assert('not cancelable', e.cancelable === false);
      wru.assert('not bubbling', e.bubbles === false);
      // in Chrome,  once you access detail you cannot define it
      // https://code.google.com/p/chromium/issues/detail?id=529185
      e = new CustomEvent('type');
      e.initCustomEvent('retype', true, true, detail);
      // TODO: WTF should happen here ?
      //  FF says type, other redefine ergardless
      //  wru.assert('right type', e.type === 'retype');
      wru.assert('detail attached', e.detail === detail);
      wru.assert('not cancelable', e.cancelable === true);
      wru.assert('not bubbling', e.bubbles === true);
      e = new CustomEvent('other-type', {
        cancelable: true,
        bubbles: true,
        detail: detail
      });
      wru.assert('right type', e.type === 'other-type');
      wru.assert('detail attached', e.detail === detail);
      wru.assert('not cancelable', e.cancelable === true);
      wru.assert('not bubbling', e.bubbles === true);
    }
  }, {
    name: 'CustomEvent#initCustomEvent',
    test: function () {
      e = new CustomEvent('type only');
      wru.assert('right type', e.type === 'type only');
      wru.assert('detail not attached', e.detail == null);
      wru.assert('not cancelable', e.cancelable === false);
      wru.assert('not bubbling', e.bubbles === false);
      e = new CustomEvent('type only');
      e.initCustomEvent(e.type, true, true, 123);
      wru.assert('still right type', e.type === 'type only');
      wru.assert('detail attached', e.detail === 123);
      wru.assert('not cancelable', e.cancelable === true);
      wru.assert('not bubbling', e.bubbles === true);
    }
  }, {
    name: 'CustomEvent is dispatchable',
    test: function () {
      var detail = {};
      document.addEventListener('what:ever', wru.async(function (e) {
        wru.assert('right detail', e.detail === detail);
      }));
      document.dispatchEvent(new CustomEvent('what:ever', {detail: detail}));
    }
  }, {
    name: 'adding twice same class does NOT results in duplicated',
    test: function () {
      var div = create('div');
      div.classList.add('a', 'a');
      wru.assert('no duplicated args', div.className === 'a');
    }
  }, {
    name: 'Element#matches',
    test: function () {
      var
        indexOf = [].indexOf || function indexOf(value){
          var length = this.length;
          while(length--) {
            if (this[length] === value) {
              break;
            }
          }
          return length;
        };
      function matches(selector) {
        var parentNode = this.parentNode;
        return !!parentNode && -1 < indexOf.call(
          parentNode.querySelectorAll(selector),
          this
        );
      }
      wru.assert('works even on HTML', document.documentElement.matches('html'));
      wru.assert('returns false when wrong', !document.createElement('div').matches('whatever'));
      wru.assert('even the shim works with HTML', matches.call(document.documentElement, 'html'));
      wru.assert('even the shim returns false when does not match', !matches.call(
        document.createElement('div'), 'whatever'
      ));
      // WARNING, this is not normalized at all across browsers even if native
      // wru.assert('works with non in DOM nodes', document.createElement('div').matches('div'));
    }
  }, {
    name: 'closest',
    test: function () {
      wru.assert('inclusive', document.body.closest('body') === document.body);
      wru.assert('exclusive', document.body.closest('html') === document.documentElement);
      wru.assert('nullable', document.body.closest('.null') === null);
    }
  }, {
    name: 'DOMTokenList in SVG',
    test: function () {
      var shape = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      // actually not clear why some browser exposes the className as object
      // check only this case
      if (typeof shape.className !== 'string') {
        wru.assert('it has className as object', typeof shape.className === 'object');
        shape.classList.add('a', 'b', 'c');
        wru.assert('classList works as expected', shape.classList.contains('b'));
        shape.classList.remove('a', 'b');
        wru.assert('classList removes values too',
          !shape.classList.contains('a') &&
          !shape.classList.contains('b') &&
          shape.classList.contains('c')
        );
      }
    }
  }, {
    name: 'query',
    test: function () {
      var div = document.body.appendChild(document.createElement('div'));
      div.innerHTML = '<ul><li></li><li></li></ul>';
      wru.assert('find just one node', div.query('li') === div.querySelector('li'));
      wru.assert('on document too', document.query('body') === document.body);
      wru.assert('while querySelector returns absolute nodes', div.querySelector('body ul') === div.firstChild);
      wru.assert('query returns only relative', div.query('body ul') === null);
      div.remove();
    }
  }, {
    name: 'queryAll',
    test: function () {
      var div = document.createElement('div');
      div.innerHTML = '<ul><li></li><li></li></ul>';
      var li = div.queryAll('li');
      var oldWay = div.querySelectorAll('li');
      wru.assert('find all of them',
        li[0] === oldWay[0] &&
        li[1] === oldWay[1]
      );
      wru.assert('is an instanceof Array', li instanceof Array);
      wru.assert('on document too', document.queryAll('body') instanceof Array);
      wru.assert('and it has the right length', document.queryAll('body').length === 1);
      wru.assert('and contains the right element', document.queryAll('body')[0] === document.body);
      document.body.appendChild(div);
      wru.assert('while querySelectorAll returns absolute nodes', div.querySelectorAll('body ul')[0] === div.firstChild);
      wru.assert('queryAll returns only relative', div.queryAll('body ul').length === 0);
      div.remove();
    }
  }, {
    name: 'DocumentFragment query/queryAll',
    test: function () {
      var df = document.createDocumentFragment();
      wru.assert('DocumentFragment#query', df.query);
      wru.assert('DocumentFragment#queryAll', df.queryAll);
    }
  }, {
    name: 'requestAnimationFrame',
    test: function () {
      requestAnimationFrame(wru.async(function () {
        wru.assert('OK');
      }));
    }
  }, {
    name: 'cancelAnimationFrame',
    test: function () {
      var called = false, ok = wru.async(function () {
        wru.assert('never executed', !called);
      });
      cancelAnimationFrame(requestAnimationFrame(function () {
        called = true;
      }));
      setTimeout(ok, 250);
    }
  }, {
    name: 'comments',
    test: function () {
      var c = document.createComment('this is a comment');
      wru.assert('comment has methods', !!c.remove);
    }
  }, {
    name: 'select',
    test: function  () {
      var
        select = document.body.appendChild(
          document.createElement('select')
        ),
        option = select.appendChild(
          document.createElement('option')
        )
      ;
      wru.assert('option is present', select.firstChild === option);
      select.remove(0);
      wru.assert('select.remove(index) works', select.firstChild !== option);
      wru.assert('select.remove(index) did not remove the select', !!select.parentNode);
      select.remove();
      wru.assert('select.remove() removed the select', !select.parentNode);
    }
  },{
    name: 'requestAnimationFrame',
    test: function () {
      requestAnimationFrame(wru.async(function () {
        wru.assert('OK');
      }));
    }
  }, {
    name: 'cancelAnimationFrame',
    test: function () {
      var i = 0;
      cancelAnimationFrame(requestAnimationFrame(function () {
        ++i;
      }));
      setTimeout(wru.async(function () {
        wru.assert('canceled', i === 0);
      }), 250);
    }
  }, {
    name: 'contains',
    test: function () {
      wru.assert('self aware', document.body.contains(document.body));
      wru.assert('can fail aware', !document.body.contains(document));
      wru.assert('can work', document.contains(document.body));
    }
  }, {
    name: 'DocumentFragment implements ParentNode interface',
    test: function () {
      var df = document.createDocumentFragment();
      wru.assert('it has an append method', typeof df.append === 'function');
      wru.assert('it has an prepend method', typeof df.prepend === 'function');
    }
  }, {
    name: 'KeyboardEvent',
    test: function () {
      var ke = new KeyboardEvent('keypress', {metaKey: true});
      var div = document.createElement('div');
      div.addEventListener('keypress', wru.async(function (e) {
        wru.assert('info passed through', e.metaKey);
      }));
      setTimeout(function () { div.dispatchEvent(ke); }, 100);
    }
  }, {
    name: 'MouseEvent',
    test: function () {
      var ke = new MouseEvent('mousedown', {clientX: 123});
      var div = document.createElement('div');
      div.addEventListener('mousedown', wru.async(function (e) {
        wru.assert('info passed through', e.clientX === 123);
      }));
      setTimeout(function () { div.dispatchEvent(ke); }, 100);
    }
  }
].concat(
  typeof ShadowRoot === 'function' ?
  [{
    name: 'ShadowRoot query/queryAll',
    test: function () {
      wru.assert('ShadowRoot#query', ShadowRoot.prototype.query);
      wru.assert('ShadowRoot#queryAll', ShadowRoot.prototype.queryAll);
    }
  }] :
  []
));
//remove:
var main = require('../build/dom4.node.js');
//:remove

function create(name) {
  return document.createElement(name);
}

wru.test([
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
  },{
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
  },{
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
  },{
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
  },{
    name: 'replace',
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
  },{
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
  }
]);
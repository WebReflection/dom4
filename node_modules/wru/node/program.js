#!/usr/bin/env node
//! wru :: (C) Andrea Giammarchi - Mit Style License
var
  CWD = process.cwd(),
  path = require('path'),
  args = resolveArguments(process.argv),
  wru = require(path.join(__dirname, 'wru.console.js')),
  inline = [],
  test = [consoleAssert],
  wru_test = wru.test,
  interval = 0
;
function consoleAssert() {
  inline.forEach(function (args) {
    args.length < 2 ?
      wru.assert(args[0]) :
      wru.assert(args[1], args[0])
    ;
  });
}
function execute() {
  inline.length || test.shift();
  wru_test.call(wru, test);
}
function resolveArguments(args, keepProgramName) {
  var a = [].slice.call(args, 0);
  if (/(?:^|\/|\\)node(?:\.exe)?$/.test(a[0])) a.shift();
  keepProgramName || a.shift();
  return a;
}
global.wru = wru;
global.assert = wru.assert;
global.async = wru.async;
global.test = wru.test = function () {
  clearTimeout(interval);
  test = test.concat.apply(test, arguments);
  interval = setTimeout(execute, 10);
};
global.log = wru.log;
/* maybe too obtrusive ...
global.console.assert = function assert() {
  inline.push(arguments);
};
*/
if (args.length) {
  args.forEach(function (fileName) {
    require(path.join(CWD, fileName));
  });
} else {
  console.log('');
  console.log('Usage:');
  console.log('wru ~/path/with/test.js ~/more?if/necessary.js');
  console.log('');
  process.exit();
}

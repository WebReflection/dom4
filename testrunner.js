var url = 'index.html';
console.log('Loading: ' + url);

var Nightmare = require("nightmare");
var fs = require("fs");
var path = require("path");

Nightmare({show: false})
  .goto('file://' + path.join(__dirname, url))
  .wait(1000)
  .evaluate(function () {
    // remove the first node with the total from the following counts
    var passed = Math.max(0, document.querySelectorAll('.pass').length - 1);
    return {
      // retrieve the total executed tests number
      total: ''.concat(
        passed,
        ' blocks (',
        document.querySelector('#wru strong').textContent.replace(/\D/g, ''),
        ' single tests)'
      ),
      passed: passed,
      failed: Math.max(0, document.querySelectorAll('.fail').length - 1),
      errored: Math.max(0, document.querySelectorAll('.error').length - 1)
    };
  })
  .then(function (results) {
    console.log('- - - - - - - - - -');
    console.log('total:   ' + results.total);
    console.log('- - - - - - - - - -');
    console.log('passed:  ' + results.passed);
    console.log('failed:  ' + results.failed);
    console.log('errored: ' + results.errored);
    console.log('- - - - - - - - - -');
    if (0 < results.failed + results.errored)
      process.exit(1);
    else
      process.exit(0);
  })
  .catch(function (err) {
    console.error(err);
    process.exit(1);
  });

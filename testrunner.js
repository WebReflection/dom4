/* jshint devel: true, node: true, phantom: true */
var url = 'index.html';
var page = require('webpage').create();
console.log('Loading: ' + url);
page.open(url, function (status) {
  if (status === 'success') {
    setTimeout(function () {
      var results = page.evaluate(function() {
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
      });
      console.log(results.asd);
      console.log('- - - - - - - - - -');
      console.log('total:   ' + results.total);
      console.log('- - - - - - - - - -');
      console.log('passed:  ' + results.passed);
      console.log('failed:  ' + results.failed);
      console.log('errored: ' + results.errored);
      console.log('- - - - - - - - - -');
      if (0 < results.failed + results.errored) {
        status = 'failed';
      }
      phantom.exit(0);
    }, 2000);
  } else {
    phantom.exit(1);
  }
});

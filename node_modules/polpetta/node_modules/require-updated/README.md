require-updated
===============

node.js require with watcher to simplify local modules development

[![build status](https://secure.travis-ci.org/WebReflection/require-updated.png)](http://travis-ci.org/WebReflection/require-updated)

### Simplified Reload
[polpetta](https://github.com/WebReflection/polpetta#-polpetta) is just one of those cases where modified files could be reloaded automatically in order to have easy updates of the `.njs` logic but any module development could be simplified testing, even in console, same stuff over and over without passing manually through the require cache.

```JavaScript
// npm install -g require-updated
var requireUpdated = require('require-updated');

// any time the file should be reloaded once modified
requireUpdated(moduleName).onCall();
```

### Tests Included
As usual, and those are good to understand how `requireUpdated` works, [here tests](test/require-updated.js)

### License
The usual [Mit Style](LICENSE.txt)
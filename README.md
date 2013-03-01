DOM4
====

This is just a fully tested and covered polyfill for [new DOM Level 4 entries](https://dvcs.w3.org/hg/domcore/raw-file/tip/Overview.html#interface-element)

  * Element#prepend()
  * Element#append()
  * Element#before()
  * Element#after()
  * Element#replace()
  * Element#remove()

The [implemented test](test/dom4.js) is conform to [current specifications](https://dvcs.w3.org/hg/domcore/raw-file/tip/Overview.html#dom-rootnode-prepend).

If you need other polyfills too [have a look at DOM-shim repo](https://github.com/Raynos/DOM-shim).

The **DOM4** license is Mit Style

### Compatibility
Theoretically compatible with all browsers you know that are truly used these days, here a list:

  * Android 2.1+
  * Safari Mobile since iOS 3.0
  * Opera Mobile
  * Midori and probably any WebKit based
  * Chrome Mobile and Desktop (indeed)
  * Firefox Mobile and Desktop
  * IE8+ and IE Mobile

It's way easier if you tell me which browser in a current relevant market share is not supported :-)

### Which File
The [minified version is here](build/dom4.js), while the [max one here](build/dom4.max.js). If you want to test directly [try this page](http://webreflection.github.com/dom4/test/), it should be green.
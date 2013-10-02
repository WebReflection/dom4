wru :: JavaScript tests have never been that easy
=================================================

*wru* is an **essential general purpose test framework** compatible with **web** environment, [node.js](http://nodejs.org/), [Rhino](http://www.mozilla.org/rhino/), and now [PhantomJS](http://www.phantomjs.org/) too.


features
--------

  * **runs in both client and server environments**, compatible with html files, node.js, Rhino, PhantomJS, and JavaScriptCore.
  * **both synchronous and asynchronous tests** in an absolutely intuitive way
  * **ES5 and JS.next ready**, compatible with `"use strict"` directive which means no `with` statements, `eval`, or misused `this` references
  * **easy**, probably the easiest way to test JS code out there thanks to its simplified API: `test`, `assert`, `async`, and `log` ... you already remember "*all of them*", isn't it?
  * **unobtrusive** and **self defensive**, since everything that could possibly change in such dynamic environment as JS is, is "*sandboxed*" inside the *wru closure*. This means no matter how "*nasty*" your code is, *wru* won't pollute or change the global environment, neither it will rely in native *constructor.prototypes* changes (`Array.prototype.push = ...` or `Object.prototype.hasOwnProperty = ...`? not a problem!)
  * **cursor included in both web and console** ... you gonna realize how much "[THE CURSOR](http://www.3site.eu/cursor/)" is important, specially to understand if your test is **stuck** or simply "*waiting for*" ... cursor is working in both Unix and OSX consoles (unfortunately PhantomJS does not support the cursor while jsc does not support timers at all)
  * **tiny**, even if it's not important in tests world, *wru* fits into about 2Kb (1.2Kb *minzpped*) which means not much to fix or change here, just a simple, reliable, and essential framework for your tests
  * **under your control**, since there is absolutely **no magic behind the *wru* scene**. You assert what you want, you async what you need, you describe what's needed, and you are *ready to go* in less than 5 minutes

If you can't believe it check [html](https://github.com/WebReflection/wru/blob/master/test/test.html), [node.js](https://github.com/WebReflection/wru/blob/master/test/testnode.js), [Rhino](https://github.com/WebReflection/wru/blob/master/test/testrhino.js), or [PhantomJS](https://github.com/WebReflection/wru/blob/master/test/phantom.js) test and see how *wru* does work ;-)


compatibility
-------------

*wru* is compatible with basically all possible browsers out there included **IE5.5**, **IE6**, **IE7**, **IE8**, **IE9**, **IE10**, **Chrome**, **Firefox**, **Safari**, **Webkit** based, **Mobile Browsers**, and **Opera**.

On server side *wru* is compatible with latest **node.js**, **Rhino**, **PhantomJS**, and **JavaScriptCore** versions. I swear if *I find an easy way to* easily *test Spider/Iron/JagerMonkey I will support them* too.


how to test wru
---------------

The simplest way to test wru is to use [template.html](https://raw.github.com/WebReflection/wru/master/build/template.html) for **web** tests or [template.js](https://raw.github.com/WebReflection/wru/master/build/template.js) for **node**, **rhino**, and **jsc** tests or [template.phantom.js](https://github.com/WebReflection/wru/blob/master/build/template.phantom.js) for **PhantomJS** tests.

With these 3 options you don't even need to fork or download the entire repository ... but if you do that ...

From *wru* root directory, simply run these commands accordingly with what you want to test:

    // node.js test
    node test/test.js
    
    // Rhino
    java -jar builder/jar/js.jar test/test.js
	
    // PhantomJS test
    phantomjs test/phantom.js
    
    // JavaScriptCore test
    jsc test/test.js
    
    // web (through Mac OSX but you can open test.html with any browser)
    open test/test.html

**PhantomJS** supports tests for both plain JavaScript in a blank page, or any url adding it as argument.

	// PhantomJS test on about:blank
	phantomjs build/template.phantom.js
	
    // PhantomJS test on any url
    phantomjs build/template.phantom.js "http://yourwebsite.com"

**PhantomJS** tests should always starts when the DOM has been already parsed.

**JavaScriptCore** does not implement (yet) setTimeout and setInterval so it's not possible to test via `async()` calls.

If you forked the project, you made some change, and you want to **rebuild wru**, this is all you have to do:

    // still inside wru folder
    python builder/build.py
    
    // or now with node
    node builder/build.js

After the build process is finished, no more than 3 seconds with forced waiting time included to read stats if build has been *double-clicked*, you should be able to run again the test for your own environment.

Please bear in mind **JSbuilder.(js|py)** works with **node-js 0.4+** or **Python < 3** (2.6 or 2.7 are fine) so be sure you have it (you should by default on Mac or Linux).


wru basics
----------

    // probably all you need as "one shot" test
    wru.test({
        name: "Hello wru!",
        test: function () {
            wru.assert("it works!", 1);
        }
    });
    
    // for multiple tests ... pass an Array
    wru.test([{
        name: "test #1",
        setup: function () {
            // setup before the test
        },
        test: function () {
            // async test example
            setTimeout(wru.async(function () {
                wru.assert("executed", true);
            }), 1000);
        },
        teardown: function () {
            // clean up after the test
        }
    },{
        name: "test #2",
        test: function () {
            // do other stuf here
        }
    }]);

To know more about *wru* possibilities ... please keep reading ;-)


wru API
=======

There are truly few things you need to know, and even less properties you need to configure!


methods
-------

  * `test(object)` or `test([object, ..., object])` to execute one or more tests. A generic test object may have one or more properties:
      * `test` property, as **function**, to execute the test with one or more `wru.assert()` or `wru.async()` calls. **optional** but recommended
      * `name` or `description` property, as **string**, to have visual knowledge of the current test **optional**
      * `setup` property, as **function**, that will be executed right before the test: **optional**
      * `teardown` property, as **function**, that will be executed right after the test: **optopnal**
  * `assert("description", truishOrFalsyValue)` to manually assert whatever you want where **description is optional** (but suggested) and the assertion is compatible with *truish* or *falsy* values. You are in charge of strictly compared results if necessary by *===* operator, nothing new to learn here
  * `async("description", callback, timeout)` to tell *wru* that a test will be executed at some point later and where **both description and timeout are optionals**
  * `log(anything, forceFallback)` the equivalent of *console.log(obj)* where supported, the equivalent of *alert()* or *print()* if the *forceFallback* flag is set to true (or better, *truish*)


properties
----------

  * `random`, as `true` or `false`, to make tests order execution random (by default `false`)
  * `node` on **web version only** to set a different node from the default one (which is an element with `id == "wru"`or the `document.body` or the `document.documentElement` if `body` is not present yet)


test properties
---------------
Each test can be either an object or, if you are that lazy typer, a function.

  * `name` as test *title* or *test name*, if the test is a function the function name (expression or declared) will be used where available, anonymous otherwise.
  * `setup` as function to do something before the test is executed. Bear in mind every test will receive a freshly baked object as argument, from setup, to test, and teardown, the same object. Use it if you need.
  * `test` as function to execute if the test is not a function itself. Receives the shared object per test as first argument.
  * `teardown` as function to do something after the test is executed. Receives the same shared object setup and test receive as argument.


how does wru work
=================

following a list of explained tasks that are possible with *wru*


synchronous tests and wru.assert()
----------------------------------
Every test **may** have one or more `wru.assert()` calls inside. The method itself accepts one or two arguments. Following a sequence of valid operations.

    // the test object ...
    {
        name: "existance test",
        test: function () {
            
            // example only: if next property is not
            // null, undefined, 0, false, "", or NaN
            // the assertion will pass the test
            wru.assert("callback exists", window.onload);
            
            // if necessary, assertion can be strict without problems
            wru.assert(
                "it is a callback",
                typeof window.onload === "function"
            );
            
            // the description is visually useful
            // if the test fails but it's not mandatory
            // next example is still valid, no description
            wru.assert("isArray" in Array);
            
            // if a condition supposes to be truish
            // wru.assert can make test life easier
            // returning the asserted value
            if (wru.assert("defineProperty" in Object)) {
                wru.assert(
                    Object.defineProperty({}, "_", {value: true})._
                );
            }
            
        }
    }


asynchronous tests and wru.async()
----------------------------------
Every test is performed synchronously unless there is one or more `wru.async()` calls. In latter case all tests after the current one will be waiting for the asynchronous call to be executed.
When it happens, if the asynchronous call performed one or more assertions, the framework keep going without requiring any extra step: **is that easy!**

    // the test object ...
    {
        name: "load content",
        test: function () {
            // asynchronous test example
            
            // this will be synchronous
            wru.assert("condition accepted", true);
            
            // this will be asynchronous
            var xhr = new XMLHttpRequest;
            xhr.open("get", "file.txt", true);
            xhr.onreadystatechange = wru.async(function () {
                if (this.readyState === 4) {
                    
                    // only on readyState 4 there is an assertion
                    wru.assert("text is not empty", this.responseText.length);
                    
                    // if necessary, async call can be nested
                    setTimeout(wru.async(function () {
                        wru.assert(
                            "DOM changed in the meanwhile",
                            docment.body.innerHTML != storedLayout
                        );
                    }, 500));
                }
            });
            xhr.send(null);
            
            // this will be performed regardless
            wru.assert("something else to check", 1);
        }
    }

In above example, the `onreadystatechange` function may be executed many times on different `readyState`. The *wru* logic cannot care less about it since an asynchronous callback is considered *done* when **at least one assertion has been performed**.
If this does not happen the internal `TIMEOUT` constant, by default 10 seconds, will kill the procedure.
You have to admit there is no reason to create an asynchronous test without performing some assertion inside the callback ... and this is where *wru* is smart.
If many assertions have been defined and one of them is not reached is most likely because there was an error or a failure in the test.
*wru* tracks all tests without problems so forget things such `lib.expectedAssertions(3)` and "*friends*" ... you really may not need that!


the temporary object
--------------------

If needed, every `setup`, `test`, or `teardown` function will receive a "*freshly new backed*" object for the current test.
This can be handy to store some reference or value on `setup`, use them during the `test`, and drop them during the `teardown` if necessary.

    // the test object ...
    {
        name: "tmp object all over",
        setup: function (tmp) {
            tmp.global = window;
            tmp.global.random = Math.random();
        },
        test: function (tmp) {
            wru.assert(
                tmp.global === window // true
            );
            wru.assert(
                typeof tmp.global.random == "number" // true again
            );
        },
        teardown: function (tmp) {
            delete tmp.global.random;
            delete tmp.global;
        }
    }


the build process
=================

*wru* is based on [javascript-builder](http://code.google.com/p/javascript-builder/) which is able to aggregate distributed files in order to produce the final library/framework even if the source/JS logic is split in more files.

This is the *wru* case, where some file is dedicated for web environment rather than console/shell one.
If you fork the project and you make some change/improvement, first of all let me know :-), secondly remember to re-build the script.
This is the list of files actually created by *wru build process* inside the *build* folder:

  * **wru.console.max.js** is the full script console/shell related, suitable for *node.js* or *rhino* tests
  * **wru.console.js** is the minified version of the precedent one with `wru.debug()` stripped out
  * **wru.dom.js** is the full script DOM related, suitable for *web* and *browsers*
  * **wru.min.js** is the minified version of the precedent one with `wru.debug()` stripped out

`wru.debug()` is a method used to export, track, test, or change internals. You should never use this method unless strictly necessary but it's there for debugging purpose.
`wru.debug()` is automatically removed from built versions so that no evaluation of internals can be possible.

If you want to have an overall view of the framework check already built output since if not familiar with this build process it may be hard at the beginning.

This is the [HTML version](https://github.com/WebReflection/wru/blob/master/build/wru.dom.js), and this is the [console one](https://github.com/WebReflection/wru/blob/master/build/wru.console.max.js), you will notice things make sense there since the order is specified in the [build.py](https://github.com/WebReflection/wru/blob/master/builder/build.py) file.

Please remember all you have to do to build *wru* is this call in the *wru* project root

    python builder/build.py


wru against others
==================

Other tests frameworks may offer more than what *wru* does but this rarely comes for free.
Some of them may have such complicated/articulated logic that it may happens is the test framework itself that's failing rather than your code.
Also you need to read a lot of documentation and most likely to obtain something already possible with *wru*.
I am not saying *wru* is the best test framework out there, I am just saying you should consider your requirements before you chose a test framework ;-)
In any case, *wru* aim is to make any sort of test simplified and under control.

As example: "*do you really need so much 'magic' to perform these tasks?*"

    // rather than specify expected arguments
    // via magic/complicated operations
    function (a, b, c) {
        wru.assert("received numbers",
            typeof a == "number"
            &&
            typeof b == "number"
            &&
            typeof c == "number"
        );
    }
    
    // rather than specify returned values
    // via magic/complicated operations
    wru.assert(typeof callbac() != "undefined");
    
    // did you know the console object
    // may have already an assert() method
    // since that's basically all you need?
    wru.assert(
        "if true, I can get rid of wru since all I need is 'assert'",
        "assert" in console
    );
    
    // the only reason wru may be handy is the
    // cross platform/environment compatibility
    // and its async method interlaced with
    // current environment layout (HTML or shell/console/bash)
    wru.assert("oh come on but this is so easy!", 1);

Just give it a try ;-)


HTML VS console
===============

*wru* core functionality is exactly the same in both environments ... it cannot be easier to maintain, imo.
However, there are few substantial differences between HTML results and those shown in the console


HTML tests
----------

  * based on classes, easily to customize via [CSS](https://github.com/WebReflection/wru/blob/master/test/wru.css)
  * differential colors accordingly with test results: green if successful, red if failed, black if cryptical (e.g. unmanaged exceptions)
  * failures or errors are not shown by default, **one click** to see the list of problems in any of those non green tests
  * summary on top, no need to scroll 'till the end of the document to understand how it was. A nice summary with all passed, failed, or unmanaged errors test is shown on top


console tests
-------------

  * based on `stdout`
  * differential prefixes accordingly with test results: `[OK]` if successful, `[FAILURE]` if failed, `[ERROR]` if cryptical (e.g. unmanaged exceptions)
  * failures and errors are always listed in the output
  * summary always at the end of the test


I need a setup per each test!
=============================

Sure you do :-)

    // just create a simple wrapper before your tests
    // to fully automate the procedure
    wru.test = (function (test) {
        
        // we got a closure here, do whaveter you want!
        function whateverSetupIsNeeded(tmp) {
            // do setup stuff
        }
        
        return function (testObjects) {
            // be sure it's an array, convert otherwise
            testObjects = [].conca(testObjects);
            
            // per each object
            for (var
                // reassign the setup if present
                reassign = function (setup) {
                    testObjects[i].setup = function (tmp) {
                        whateverSetupIsNeeded(tmp);
                        setup && setup(tmp);
                    };
                },
                i = testObjects.length; i--;
                reassign(testObjects[i].setup)
            );
            
            // invoke wru.test() which is self bound
            test(list);
            
            // that's pretty much it
        };
        
    }(wru.test));

Similar technique if you need same teardown call per each test.


I need other edge cases too !
=============================

The cool part is that being simple, *wru* is also highly customizable.
Please keep an eye in the [solutions.html](https://github.com/WebReflection/wru/blob/master/test/solutions.html) file.
I will try to update it as soon as some *request or edge case* comes up.


wrap it if you want
===================

If you think *wru* is too simple, you still have a chance to improve it wrapping its basic methods and create something wonderful out of it.
Arguments automations? Returned values? Expected number of calls per callback?

The *wru* cross environment core is easy to hack for anybody, check [wru.js](https://github.com/WebReflection/wru/blob/master/src/wru.js) and your are already half way through ;-)


license
=======

*wru* general purpose test framework and the rest of the project is under Mit Style License

    Copyright (C) 2011 by Andrea Giammarchi, @WebReflection
    
    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to deal
    in the Software without restriction, including without limitation the rights
    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:
    
    The above copyright notice and this permission notice shall be included in
    all copies or substantial portions of the Software.
    
    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
    THE SOFTWARE.


OT: some fun during wru development
-----------------------------------

If you check the built source you will realize that a `wru.test()` lifecycle is between a call to internal `isGonnaBeLegen()` function, passing through the `waitForIt` variable if some asynchronous call has been required, and ending up into the `Dary()` callback.

I know you don't care but at least now you know how is the `wru.test()` lifecycle :{D
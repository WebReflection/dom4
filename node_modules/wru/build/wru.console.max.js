/*!
(C) Andrea Giammarchi, @WebReflection - Mit Style License
*/
/**@license (C) Andrea Giammarchi, @WebReflection - Mit Style License
*/
// revisited by Andrea Giammarchi, @WebReflection
// compatible with both Rhino and Node
// now it is possible to include this file in the server console without rhinoTimers dependencies
// @link http://stackoverflow.com/questions/2261705/how-to-run-a-javascript-function-asynchronously-without-using-settimeout
// glory and fortune to to Weston C for the inital hint
// but it's also RIDICULOUS Rhino does not implement in core timers properly!

// condition to avoid problems with jsc
if (typeof global != "undefined") {

    var
        setTimeout = global.setTimeout,
        setInterval = global.setInterval,
        clearInterval = global.clearInterval,
        clearTimeout = global.clearTimeout
    ;

    setTimeout || (function (timer, ids, slice, counter) {

        // did you know?
        //  all browsers but IE accept one or more arguments
        //  to pass to the callbacl after the timer/delay number
        //  ... so does Rhino now!

        setInterval = global.setInterval = function setInterval(fn, delay) {
            return schedule(fn, delay, slice.call(arguments, 2), 1);
        };

        setTimeout = global.setTimeout = function setTimeout(fn, delay) {
            return schedule(fn, delay, slice.call(arguments, 2));
        };

        clearInterval = global.clearInterval =
        clearTimeout = global.clearTimeout = function clearInterval(id) {
            ids[id].cancel();
            timer.purge();
            delete ids[id];
        };

        function schedule(fn, delay, args, interval) {
            var id = ++counter;
            ids[id] = new JavaAdapter(java.util.TimerTask,{run: function () {
                fn.apply(null, args);
            }});
            interval ?
                timer.schedule(ids[id], delay, delay)
                :
                timer.schedule(ids[id], delay)
            ;
            return id;
        }

    })(new java.util.Timer(), {}, [].slice, 0);

} else { // jsc specific hack
    !function (global, i, cbs, slice) {
        function setTimeout(cb, delay) {
            var t = new Date;
            while (new Date - t < delay);
            cb.apply(null, slice.call(arguments, 2));
        }
        slice = cbs.slice;
        global.setTimeout = global.setInterval = setTimeout;
        global.clearInterval = global.clearTimeout = function () {};
    }(this, 0, []);
}

var wru = function (window) {"use strict";
    
    /**
     * Copyright (C) 2011 by Andrea Giammarchi, @WebReflection
     * 
     * Permission is hereby granted, free of charge, to any person obtaining a copy
     * of this software and associated documentation files (the "Software"), to deal
     * in the Software without restriction, including without limitation the rights
     * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
     * copies of the Software, and to permit persons to whom the Software is
     * furnished to do so, subject to the following conditions:
     * 
     * The above copyright notice and this permission notice shall be included in
     * all copies or substantial portions of the Software.
     * 
     * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
     * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
     * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
     * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
     * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
     * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
     * THE SOFTWARE.
     */
    
    // console specific version
    function isGonnaBeLegen() {
        current = shift.call(queue);
        if (current) {
            if (typeof current == "function") {
                current = {name: current[NAME] || "anonymous", test: current};
            }
            log(OUTPUT_SEPARATOR);
            log(
                (iHasIt(current, NAME) && current[NAME])
                ||
                (iHasIt(current, DESCRIPTION) && current[DESCRIPTION])
                ||
                UNKNOWN
            );
            pass = [];
            fail = [];
            fatal = [];
            tmp = {};
            giveItATry("setup");
            fatal[LENGTH] || giveItATry("test");
            waitForIt || Dary();
        } else {
            showSummary();
        }
    }

    function log(info, avoidNewLine) {
        info = info + (avoidNewLine ? "" : "\n");
        try {
          // node 0.11+ alternative ...
          process.stdout.write(info);
        } catch(up) {
          try {
              // node 0.6
              require("util").print(info);
          } catch(up) {
              try {
                  // node 0.4
                  require("sys").print(info);
              } catch(up) {
                  try {
                      // hello Rhino
                      // print uses println ... while we need print without \n
                      java.lang.System.out.print(info);
                  } catch(up) {
                      try {
                          // phantomjs or default fallback
                          console.log(info);
                      } catch(up) {
                          // jsc and others
                          print(info);
                      }
                  }
              }
          }
        }
    }

    function showSummary() {
        var code = 0, status;
        log(EMPTY);
        log(OUTPUT_SEPARATOR);
        switch (true) {
            case !!overallFatal:
                code++;
                status = "error";
                log(ERROR + "   " + overallFatal + " Errors");
                break;
            case !!overallFail:
                code++;
                status = "fail";
                log(FAILURE + EMPTY + overallFail + " Failures");
                break;
            default:
                status = "pass";
                log(OK + "      " + overallPass + " Passes");
        }
        wru.status = status;
        log(OUTPUT_SEPARATOR);
        log(EMPTY);
        wru.after();
        try {
            // node.js
            process.exit(code);
        } catch(up) {
            // rhino
            quit();
        }
    }

    function writeItOrdered(fail) {
        for (var
            i = 0, length = fail[LENGTH];
            i < length;
            log("    " + (++i) + ". " + fail[i - 1])
        );
    }

    function Dary() {
        clearDaryTimeou();
        overallPass += pass[LENGTH];
        overallFail += fail[LENGTH];
        overallFatal += fatal[LENGTH];
        if (fatal[LENGTH]) {
            prefix = ERROR;
            writeItOrdered(fatal);
        } else if(fail[LENGTH]) {
            prefix = FAILURE;
            writeItOrdered(fail);
        } else {
            prefix = OK;
        }
        log(prefix + " passes: " + pass[LENGTH] + ", fails: " + fail[LENGTH] + ", errors: " + fatal[LENGTH]);
        ci = 0;
        prefix = EMPTY;
        isGonnaBeLegen();
    }

    // common functions for all versions
    function giveItATry(name) {
        if (iHasIt(current, name)) {
            try {
                current[name](tmp);
            } catch(doooodeThisIsBAD) {
                push.call(fatal, EMPTY + doooodeThisIsBAD);
            }
        }
    }
    
    function iHasIt(object, name) {
        return hasOwnProperty.call(object, name);
    }
    
    function messItUp() {
        return random() < .5 ? -1 : 1;
    }
    
    function clearDaryTimeou() {
        if (daryTimeout) {
            clearTimeout(daryTimeout);
            daryTimeout = 0;
        }
        giveItATry("teardown");
    }
    

    var // wru library core
        wru = {
            timeout: TIMEOUT,
            assert: function assert(description, result) {

                // if no description provided, variables are shifted
                // these are both valid wru.assert calls indeed
                // wru.assert(truishValue);
                // wru.assert("test description", truishValue);
                if (arguments[LENGTH] == 1) {
                    result = description;
                    description = UNKNOWN;
                }

                // flag used in wru.async to verify at least
                // one assertion was performed
                called = TRUE;

                // store the result in the right collection
                push.call(result ? pass : fail, prefix + description);

                // just to add a bit of sugar
                return result;
            },
            async: function async(description, callback, timeout, p) {
                var delay = timeout || wru.timeout || (wru.timeout = TIMEOUT);
                // p is used as sentinel
                // it defines the anonymous name
                // if necessary and it's used to flag the timeout
                p = ++waitForIt;

                // if no description provided, variables are shifted
                // these are all valid wru.async calls indeed, timeout is optional
                // wru.async(function () { ... })
                // wru.async("test description", function () { ... })
                // wru.async(function () { ... }, timeout)
                // wru.async("test description", function () { ... }, timeout)
                if (typeof description == "function") {
                    delay = callback || wru.timeout;
                    callback = description;
                    description = "asynchronous test #" + p;
                }

                // if in *TIMEOUT* time nothing happens ...
                timeout = setTimeout(function () {

                    // p is flagged as 0
                    p = 0;

                    // timeout is handled as failure, not error (could be the server)
                    push.call(fail, description);

                    // if there is no reason to waitForIt then is time to call Dary()
                    --waitForIt || (daryTimeout = setTimeout(Dary, 0));
                },
                    // timeout can be specified
                    // this procedure ensure that it's
                    // a number and it's greater than 0
                    abs(delay) || wru.timeout
                );

                // the async function is a wrap of the passed callback
                return function async() {

                    // if it's executed after the timeout nothing happens
                    // since the failure has been already notified
                    if (!p) return;

                    // called is always set as *TRUE* during any assertion
                    // this indicates if the callback made at least one assertion
                    // as example, in this case the callback could be called many time
                    // with different readyState ... however, only on readyState 4
                    // there is the assertion we are interested about, e.g.
                    //
                    // xhr.onreadystatechange = wru.async(function (){
                    //      if (this.readyState == 4)
                    //          wru.assert("content", this.responseText.length)
                    //      ;
                    // });
                    //
                    // in above example called will be flagged as true
                    // only during last readyState call
                    called = FALSE;

                    // simply recycled "string" variable
                    // prefix will be internally used by assert during function execution
                    prefix = description + ": ";

                    // the original callback is called with proper *this* if specified
                    try {
                        callback.apply(this, arguments);
                    } catch(doooodeThisIsBAD) {
                        // if there is an Error
                        // the test is screwed up
                        // called has to be set as *TRUE* to invalidate the test
                        called = TRUE;
                        // message is "casted" to avoid IE host objects errors problem
                        // (or any other possible edge case)
                        push.call(fatal, prefix + doooodeThisIsBAD);
                    }

                    // prefix can be *EMPTY* string again now
                    prefix = EMPTY;

                    // a failure or at least an assertion
                    if (called) {

                        // timeout not necessary anymore
                        clearTimeout(timeout);

                        // if there is no reason to waitForIt then is time to call Dary()
                        --waitForIt || (daryTimeout = setTimeout(Dary, 0));
                    }
                };
            },

            // wru.test({...test...})
            // wru.test([{...test...}, {...test...}, ...])
            // the {...test...} object should have a string name and a function test property
            // optionally a function setup and a function teardown too
            test: function test(list, after) {

                // in case you need to do something after
                wru.after = after || function () {};

                // test may be called multiple times
                // queue should simply concatenate other calls
                queue = concat.apply(queue, [list]);

                // if wru.random is true, the queue is ranodomized
                // this is to make tests indipendent from each others
                wru.random && sort.call(queue, messItUp);

                // if there is no test to waitForIt
                // Dary() has been called already
                // we can procede with next test
                // invoking isGonnaBeLegen()
                waitForIt || isGonnaBeLegen();
            }
        },

        // common private variables / constants / shortcuts
        TRUE = true,
        FALSE = !TRUE,
        TIMEOUT = 100,
        EMPTY = " ",
        UNKNOWN = "unknown",
        LENGTH = "length",
        NAME = "name",
        DESCRIPTION = "description",
        LISTART = "<li>",
        LIEND = "</li>",
        cursor = "\\|/-",
        hasOwnProperty = wru.hasOwnProperty,
        prefix = EMPTY,
        charAt = prefix.charAt,
        slice = prefix.slice,
        queue = [],
        concat = queue.concat,
        join = queue.join,
        push = queue.push,
        shift = queue.shift,
        sort = queue.sort,
        waitForIt = 0,
        ci = 0,
        overallPass = 0,
        overallFail = 0,
        overallFatal = 0,
        daryTimeout = 0,
        

        // these variables are used on console version only
        ERROR = "\x1B[1;31mERROR\x1B[0m",
        FAILURE = "\x1B[0;31mFAILURE\x1B[0m",
        OK = "\x1B[0;32mOK\x1B[0m",
        OUTPUT_SEPARATOR = "------------------------------",
        
        // shared across the whole private scope
        Math, abs, random, setTimeout, clearTimeout,
        current, node, pass, fail, fatal, tmp, called
    ;
    

    wru.log = function (obj, printOnly) {
        try {
            if (printOnly) {
                throw new Error;
            }
            console.log(obj);
        } catch(o_O) {
            log(obj, 0);
        }
    };

    // node.js exports
    if (typeof __dirname != "undefined") {

        window.wru = wru;
        window.assert = wru.assert;
        window.async = wru.async;
        window.test = wru.test;
        window.log = wru.log;
        window.random = false;
        Object.defineProperty(window, "status", {get: function () {
          return wru.status;
        }});
        Object.defineProperty(window, "timeout", {
          get: function () {
            return wru.timeout;
          },
          set: function (value) {
            wru.timeout = parseInt(value, 10) || wru.timeout;
          }
        });

        // re-assign window to make it global
        window = global;
    }

    // these are window/global object dependent
    // must be eventually defined after wru.export.js, if used
    Math = window.Math;
    abs = Math.abs;
    random = Math.random;
    setTimeout = window.setTimeout;
    clearTimeout = window.clearTimeout;
        
    // "THE CURSOR" http://3site.eu/cursor
    window.setInterval(function () {
        waitForIt && log(EMPTY + charAt.call(cursor, ci++%4) + "\b\b", true);
    }, TIMEOUT);
    
    
    //^ this is useful to test internals on non minified version
    wru.debug = function (O_o) {
        return eval("(" + O_o + ")");
    };
    //$ and this block is removed at build time
    
    
    TIMEOUT *= TIMEOUT; // by default, timeout is 10000 (10 seconds)
                        // this is the place you can set it, e.g.
                        // TIMEOUT = 2000; // 2 seconds
    
    wru.random = FALSE; // by default tests order is preseverd
                        // set wru.random = TRUE to randomly sort them
    
    return wru;
    
}(this);
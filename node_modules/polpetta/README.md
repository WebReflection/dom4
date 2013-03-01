(က) Polpetta
===========================
any folder is served spiced

![polpetta at work](http://www.3site.eu/images/polpetta_shell.png)
___________________________


What Is Polpetta
----------------
*polpetta* is a script able to initialize a [node.js](http://nodejs.org/) server in any folder you want and behave like *CGI* or, if you prefer *PHP*, too, in order to have **not static files serving only but dynamic content as well**.


`node polpetta ~/path` is basically all you need to start surfing the `~/path` folder as if it is a web-server with the plus that any *file.njs* inside that folder will act as *node.js* module.
Here [the most basic example of an *index.njs* file](https://github.com/WebReflection/polpetta/blob/master/test/index.njs).

In few words, **polpetta is the easiest way for quick prototyping with both client files and node.js modules**.


How Is Polpetta Different From Python SimpleHTTPServer, serverdir, etc
----------------------------------------------------------------------
The JavaScript weekly description couldn't be more precise


    Runs up a Node-powered HTTP server in any folder you want whereupon '.njs' files get executed CGI-style.


And this is almost it, except it finds automatically an available port if not specified, so you don't have to bother inventing numbers by your own, it allows interceptions on files via *.htaccess* like mechanism, and it `require("folder/file.njs")` to let you test modules for node.js in the possible easiest way ever, without writing from scratch again and again something able to run a web server.


Can I Use Polpetta In Production ?
----------------------------------
You are using node.js which is not even at release 1.0 so I would say yes, you can :{D

However, there are more mature projects such [Express](http://expressjs.com) probably with some hosting possibility.
You can still test Express node.js modules in *polpetta* with a "*zero effort kick-in*" process: type *polpetta* in that folder and you are basically done.

Moreover, *polpetta* can be a solution for embedded devices able to run node.js thanks to all possible techniques used to minimize creation of pointless objects, recycle as much as possible in a single thread, and a simplified behavior able to cover most of web cases.
Last, but not least, I am willing to rent a server and use *polpetta* there so .. stay tuned :-)


Does It Run This And That ?
---------------------------
*polpetta* runs everything available with **npm** with a secured mechanism that disable browsers from reading any **node_modules** folder present in your project tree (together with hidden files prefixed via a simple **.** dot).
If you have written a node.js module, *polpetta* will be more than happy to let you use it, or test it, in a simple, and familiar, *onload* exported callback.


Supported Platforms
-------------------
*polpetta* should just work wherever a recent version of node.js is available.
Known platforms are **Linux**, **Mac**, and **Windows** where for latter one the *polpetta.cmd* file will simply start a polpetta server through double click.


Usage
-----
Same as [serverdir](https://github.com/remy/servedir)

    polpetta [path] [port]

  * **path**, the folder you want to use as web-server root, by default is where *polpetta* is
  * **port**, the port you want to use, by default *polpetta* finds a free port automatically

Bear in mind if you specify a port and it's not available, *polpetta* will exit with a notice in console.

If you don't remember later on ... `polpetta --help` or `polpetta -h` to have some hint.


OK, How Do I Start
------------------
Well, the very first step is to grab *polpetta*, either via `git clone git://github.com/WebReflection/polpetta.git` or simply getting the unique file.

You can install *polpetta* through `npm install polpetta -g` or you can grab directly a freshly baked polpetta:

    # go in a directory, if emty is better
    # grab the built file from this repo
    curl -0 https://raw.github.com/WebReflection/polpetta/master/build/polpetta >polpetta

    # if you don't want to make
    # polpetta executable
    # point to polpetta via node
    node ~/the/path/where/is/polpetta

    # if you want make it executable
    # be sure polpetta firstline points to the right
    # bin folder with node then chmod it
    chmod +x polpetta

    # if that is the case, test if it runs via
    # and exit via Ctrl+C or simply go to
    # the http://address:port/ showed and start playing
    ./polpetta

You should see something like this in your console (I have used the /tmp folder here)

![polpetta at work](http://www.3site.eu/images/polpetta_shell.png)


    # if you want make your life easier and call
    # polpetta from anywhere, hoping you have not
    # configured node as super user ( this could hurt )
    which node
    # output: /usr/local/bin/node

    # move the file into that bin folder
    [sudo] mv polpetta /usr/local/bin

    # now, whatever folder you want ..
    polpetta ~/myhtml/only/website/

    # and you are ready to go

If you want clone this repository, help me improving *polpetta* or do some test/change, remember to `make` in order to build *polpetta* in the build folder then `node build/polpetta test` or any other path you like.


Make options
------------
  * **build**, the default one, creates a freshly new backed *polpetta* in the *build/* folder
  * **clean**, remove the build folder and everything included
  * **types**, grab the Apache file, parse it, overwrite the [EXTENSION_TO_MIME.js](https://github.com/WebReflection/polpetta/blob/master/src/EXTENSION_TO_MIME.js) file and build *polpetta* again


What About .njs Files
---------------------
If the file extension is **.njs** it is **executed CGI (or PHP) style** but with the whole power of node.js.
You can `require("module")` and do what you want and you receive per each web-server call the **request** and the **response** object.
All you have to do in your file is to export an `onload` function. This function will be called with a spiced up *polpetta* with some utility but you don't really have to use them, just do what you want.

    // generic.njs file
    this.onload = function (
      request,
      response,
      polpetta
    ) {
      var fs = require("fs");
      fs.writeFileSync("gotcha.txt", "it works");
      response.end();
      // note that polpetta here points
      // to a new polpetta instance
      // per each request lifecycle
    };


What About External npm Modules
-------------------------------
There are two options here, the easy one and the even easier.
The easy one is about putting your modules in a folder called **node_modules** inside your project.
This folder is forbidden by default so nobody can read it through the url but you can `require(module)` without problems.

The even easier way is to install your most used modules globally via `npm install module -g` so that these will be available in any case through the node.js `require()` mechanism and you update one place rather than all of them, if necessary.


What About Polpetta as Module
-----------------------------
If you `require("./polpetta")` file you gonna have a module with a *Polpetta* constructor.
Any time you want to initialize a Polpetta instance you can `new Polpetta(request, response)`.
As easy way to use it for generic http server response, you can `http.createServer(Polpetta.factory);`


What About .htaccess file
-------------------------
The *.htaccess* file is a feature that lets you intercept few calls such *onrequest*, *onstaticfile*, and *onerror*.
You can find a
[.htaccess example here](https://github.com/WebReflection/polpetta/blob/master/test/weird folder/.htaccess).
The .htaccess file works only if present in the root folder you chose for a polpetta instance. In all other folders this will be threaten as an hidden file rather than being parsed per each folder request. This simplifies and boost up **a lot** the server logic and is most likely everything you need. Here a summary of all current methods invoked, if present, with the .htaccess file.

  * **onrequest**, performed *while polpetta is still backing*, you can use this event to create your own redirects, internals or external, or do any sort of crazy things you might think about.
  * **onstaticfile**, performed once a non CGI/.njs file is going to be served. Here you can serve gzipped content or a completely different layout, accordingly with the file type.
  * **onerror**, performed when something bad occurs. Usually, for bad we mean a forbidden 403, a not found 404, or an internal server error, with code 500. Here you can serve an alternative nice page, informing the user something went wrong or so something else, if you think it's necessary.

Every time a callback is invoked, the [event object](https://github.com/WebReflection/polpetta/blob/master/src/htaccess/invokedHtaccess.js) will be sent. If you want to stop a default polpetta behavior, simply use `even.preventDefault()` or `return false` at some point in the callback. This works like DOM Level 3 or DOM 0 events ... as easy as that.


Polpetta API
------------
You can find almost everything documented in the [prototype.js](https://github.com/WebReflection/polpetta/blob/master/src/Polpetta/prototype.js) file.
Look closer and you will find a `polpetta.get(key[, default])` method, used to retrieve query string properties as it is for the PHP `$_GET[$key]` global, a `polpetta.post(key[, default])` method to retrieve posted data, a `polpetta.cookie(key[, default])` method, to get cookie, followed by `polpetta.cookie.set(key, value)` to set them.
All these objects have a `obj.keys()` method too to retrieve all parsed keys for *get*, *post*, *cookie*, or *file*.

You can see an examples for [cookie](https://github.com/WebReflection/polpetta/blob/master/test/cookie.njs), [get or post](https://github.com/WebReflection/polpetta/blob/master/test/post.njs), and [files upload](https://github.com/WebReflection/polpetta/blob/master/test/file.njs) in the test folder.

Last, but not least, there is a `polpetta.output` **Array** property where you can push your content and `polpetta.output.flush([type || [code, type]])` once you have done.
Bear in mind this is not a good technique to serve big files on the fly but that's not the purpose of the `output` property.

    // example of get and output
    this.onload = function (req, res, p) {
      p.output.push(
        "Hello ",
          p.get("name",
            // default if not present
            "unknown"
          ),
        "!"
      );
      p.output.flush("txt");
    };

    // produced output for localhost:port
    Hello unknown!

    // produced output for localhost:port/?name=Polpetta
    Hello Polpetta!


License
-------
This *polpetta* project is under the Mit Style License

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


TODOs
-----
  * pipe/stream files bigger than a predefined amount of MB (or just pipe them all)
  * reach more coverage through [wru](https://github.com/WebReflection/wru) tests (integrated in the build system)
  * add default favicon with polpetta logo (or maybe not ....)
  * ... something else you can suggest me :-)


Logo
----
Polpetta means meatball and I am not a graphic designer at all ... so this is all I could do but if you want to create a better logo, you'll be credited and I'll pay you a beer, cheers :D

![logo](https://github.com/WebReflection/polpetta/raw/master/test/img/polpetta.png)


Oh Gosh ... Why
---------------
I am maintaining different projects and I am sick of setting up a web-server per each project.
You might have noticed that most **recent browsers do not let us test through the *file://* protocol anymore** and this is the most annoying thing ever for a developer, imho.
You might be a *node.js* modules developer too and sometimes an easy way to test your modules is all you need.
With *polpetta* you can create as many server as you want per each folder and test them without setting up a damn thing.
Accordingly, if you develop anything for the web or the *node.js* community, *polpetta* could be exactly the solution to all your problems.

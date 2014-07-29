<<<<<<< HEAD
# Marionette HTML Application Foundation

## Features

* Compass
* Saas
* RequireJS
* Marionette
* Backbone
* Handlebars
* Underscore
* Jasmine
* Jasmine jQuery
* Karma

## Requirements

* [Node.js](http://nodejs.org/download/)
* RequireJS
* Compass

Download and install Node.js then run the following.

```
gem install compass sass
sudo npm install -g requirejs

```


## Testing Requirements:

* Karma
* Jasmine
* RequireJS
* Jasmine-jQuery

### To install testing dependencies:

You must have installed node.js and npm for this to work, see above.
Run this from your shell:

```
make install-test-reqs
```

To continuously run your tests:

```
./node_modules/karma/bin/karma start
```

That's horrible, so lets simplify that:

```
make install-test-cli
```

Now to run your tests, from the root of your project run:

```
karma start
```

**NOTE** you will only need to `make install-test-cli` once, no matter the
project. It will install the karma shortcut globally on your system.
If you already have the karam cli tool installed, running this command
may simply generate an error. Nothing will break.



## Quick start

This will not install the testing requirements.

```
make all
```
=======
# Agency UI Foundation

[jQuery v2.1.1]: http://api.jquery.com/
[Modernizr v2.6.2 : Custom Build]: http://modernizr.com/download/#-fontface-backgroundsize-borderimage-borderradius-boxshadow-flexbox-flexboxlegacy-hsla-multiplebgs-opacity-rgba-textshadow-cssanimations-csscolumns-generatedcontent-cssgradients-cssreflections-csstransforms-csstransforms3d-csstransitions-applicationcache-canvas-canvastext-draganddrop-hashchange-history-audio-video-indexeddb-input-inputtypes-localstorage-postmessage-sessionstorage-websockets-websqldatabase-webworkers-geolocation-inlinesvg-smil-svg-svgclippaths-touch-webgl-cssclasses-teststyles-testprop-testallprops-hasevent-prefixes-domprefixes
[Lodash v2.4.1]: http://lodash.com/
[Backbone v1.1.2]: http://backbonejs.org/
[Backbone : Marionette v2.0.3]: http://marionettejs.com/
[Backbone : Stickit v0.8.0]: http://nytimes.github.io/backbone.stickit/
[Handlebars : v1.3.0]: http://handlebarsjs.com/
[HBS : v0.4.0]: https://github.com/SlexAxton/require-handlebars-plugin
[RequireJS : 2.1.14]: http://github.com/jrburke/requirejs
[Famo.us : 0.2.1]: http://github.com/famous/famous


A UI Foundation with a Unix-like philosophy.

## Getting Started
    $ make install-test-reqs
    $ make install-test-cli

## Run Tests
    $ karma start

- open browser at: http://localhost:9876/
- Click Debug button

## Development Status

Development Status :: 2 - Pre-Alpha

## Current Vendor Dependencies

Vendor dependencies are not versioned with the main AUF codebase. Check out `tests/lib/vendor/` for an up to date list.

Below is a list of dependencies as of July 28th, 2014:

- [jQuery v2.1.1]
- [Lodash v2.4.1]
- [Backbone v1.1.2]
- [Backbone : Marionette v2.0.3]
- [Backbone : Stickit v0.8.0]
- [Handlebars : v1.3.0]
- [HBS : v0.4.0]
- [RequireJS : 2.1.14]
- [Famo.us : 0.2.1]

## Components that need to be built
- Marquee/Carousel


## Additional common libs we use
- YepNope
- famous
- greensock
- scroll magic
- velocity
- d3.js



## Want docs? ok... ##
``` bash
npm install
pip install sphinx sphinx_rtd_theme
make doc
make serve-doc
```
[view local docs](http://localhost:8000/)

## How to write docs
1. clone this repo and run 'git branch -r | grep docs' to see what has been taken already.  choose something that has not yet been claimed.
2. create a new branch off the 'develop' branch named 'docs-YOURITEMHERE' (ie docs-controls, docs-gestures, etc etc).   
3. check out the 'Want docs? ok...' bit above and make sure you can build the docs/view them locally
4. after picking what you want to work on, check out either built/core/calendar/calendar.js or built/core/controls/dragdrop/list.js to see how to format the code that will be used to create the docs
5. create a new .rst file in the docs/examples folder (ie dragdrop.rst) - NOTE that you will need to git add -f this new file as it will be ignored by default
6. again, look at the other files in here and model your examples after them
7. dive into the source code and start doc'ing away!  it is super helpful to find the page with unit tests corresponding to your feature/module (these are found at built/tests/spec/built-control-drag-drop-list.js, for example)
8. when writing docs/examples, be as verbose as possible.  you can use my list examples as a guide.  generally, i will do something like put a console.log(whatever) in the example, and then show the expected output in a comment
9. IMPORTANT: You really should spin up another devbot instance/project so that you can test things out and really get a feel for it.  When you're writing examples, put them into your new project, run them, and confirm that they work!

## Version

0.0.0
>>>>>>> 16651653a311587ab593897471e723586d5dcd06

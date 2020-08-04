# generator-sparkproj [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url]
> Project generator for SPARK javascript projects

## Installation

First, install [Yeoman](http://yeoman.io) and generator-sparkproj using [npm](https://www.npmjs.com/) (we assume you have pre-installed [node.js](https://nodejs.org/)).

```bash
npm install -g yo
npm install -g generator-sparkproj
```

Then generate your new project:

```////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //
  //  NOTE:  Use TAB key to traverse fields of inserted snippet !!!
  //
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //
  // PREFIX       BODY
  // - - -        - - - -
  //
  // spprop       Object.defineProperty()
  // spcfg        px.configImport()
  // spimp        px.import()
  // spobj        px.create({ t: 'object') ...
  // spobjp       px.create({ t: 'object') .then() ...
  // spim         px.create({ t: 'image') ...
  // spimp        px.create({ t: 'image') .then() ...
  // spir         px.create({ t: 'imageResource') ...
  // spirp        px.create({ t: 'imageResource') .then() ...
  // spfr         px.create({ t: 'fontResource') ...
  // spfrp        px.create({ t: 'fontResource') .then() ...
  // sprect       px.create({ t: 'rect') ...
  // sprectp      px.create({ t: 'rect') .then() ...
  // sptext       px.create({ t: 'text') ...
  // sptextp      px.create({ t: 'text') .then() ...
  // sptbox       px.create({ t: 'textBox') ...
  // sptboxp      px.create({ t: 'textBox') .then() ...
  //
  // sptonkdn     xx.on('onKeyDown', ...
  // sptonkup     xx.on('onKeyUp', ...
  // sptonmdn     xx.on('onMouseDown' ...
  // sptonmup     xx.on('onMouseUp', ...
  // sptonfocus   xx.on('onFocus', ...
  // sptonblur    xx.on('onBlur', ...
```

## Getting To Know Yeoman

 * Yeoman has a heart of gold.
 * Yeoman is a person with feelings and opinions, but is very easy to work with.
 * Yeoman can be too opinionated at times but is easily convinced not to be.
 * Feel free to [learn more about Yeoman](http://yeoman.io/).

## License

Apache-2.0 © [Hugh Fitzpatrick]()


[npm-image]: https://badge.fury.io/js/generator-sparkproj.svg
[npm-url]: https://npmjs.org/package/generator-sparkproj
[travis-image]: https://travis-ci.org//generator-sparkproj.svg?branch=master
[travis-url]: https://travis-ci.org//generator-sparkproj
[daviddm-image]: https://david-dm.org//generator-sparkproj.svg?theme=shields.io
[daviddm-url]: https://david-dm.org//generator-sparkproj

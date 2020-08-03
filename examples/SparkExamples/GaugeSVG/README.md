# GuageSVG !

## Introduction

This *Spark* app demonstrates the use of WebPack, SVG, and a pattern for project organization.

## Setup - Prerequsites

The following prequistes should be installed.

* VS Code      <
* node
* npm
* webpack      <
* webpack-cli  <
* webpack-dev-server

NOTE:  '<' indicates package should be installed globally.


## Setup - npm install

Run 'npm install' from the project root folder - where this README.md file lives.



## Recommended - VS Code

Open this project folder in VS Code.

In the 1st Terminal pane, execute 

  _webpack -p_ to build the project with webpack.  Webpack will "watch" the source 
  files and automatically rebuild as needed.

In the Terminal pane, open an additional pane via the "+" button.  You may navigate 
the two terminals via the listbox to the left of the "+" button.

In the 2nd Terminal pane, execute 

  _sudo webpack-dev-server_ to start a http server using the configuration in *webpack.config.js*.



## API

The following API is provided ...

# Properties

 *  `ready`s - ready promise
 *  `parent` - parent object in scene graph
 *  `alpha`  - alpha transparency 
 *  `x`      - x position
 *  `y`      - y position
 *  `px`     - px anchor
 *  `py`     - py anchor
 *  `d`      - "diameter" dimension
 *  `wt`     - weight of ring stroke
 *  `t`      - animation duration for fill/empty to %
 *  `fc`     - foreground color
 *  `bc`     - background color


# Methods

 *  `setPos(percentage, [duration])`  - percentage filled, optionally animated over `[duration]` seconds.
 *  `fillRing()`                      - percentage filled, optionally animated over `[duration]` seconds.
 *  `setPos(percentage, [duration])`  - percentage filled, optionally animated over `[duration]` seconds.
fillRing

## Running

Included in the VS Code *launch.json* configuration are the following options...

 *  "DBG file in pxscene"
 *  "DBG App"
 *  "WebPack App (Release)"
 *  "WebPack Web (Release)"

Note: The last option will run the App from the _webpack-dev-server_ hosted files


## Versions

1.0   Initial Release

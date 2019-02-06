# Spark Coverflow Example

This coverflow example demonstrates some of the powerful features of Spark.  To run it, launch the following Url in Spark: 
https://www.sparkui.org/examples/coverflow/coverflow_launch.js

If you don't yet have Spark installed, get it here: https://www.sparkui.org/docs/getting_started.html

Coverflow presents a number of poster art assets for various movies. Navigate via the RIGHT and LEFT ARROWs on your keyboard or remote control. Press ENTER an any focused asset to bring up an animated Detail overlay.  Press RIGHT or LEFT ARROW to exit the Detail overlay.

Things to notice:
- Navigating right and left will bring a new movie poster into focus by scaling it and displaying its title and star rating.  Non-focused movie posters will be slightly rotated to give a 3-D effect. 
- The yellow ratings stars below the movie title are slowly rotating via Spark animation
- A random set of movie posters will display a rotating sparkle image at their upper right corner, also animtating via Spark animation.  Pressing ENTER on a movie poster displaying the sparkle will bring up the animated Detail overlay with an extra "Featured" banner, further demonstrating Spark's abilities at rotation and transparencies. 
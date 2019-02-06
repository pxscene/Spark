# Spark Polaroid Picture Pile Example

This Picture Pile example demonstrates some of the powerful features of Spark.  To run it, launch the following Url in Spark: 
https://www.sparkui.org/examples/polaroid/pp_polaroid.js

If you don't yet have Spark installed, get it here: https://www.sparkui.org/docs/getting_started.html

Polaroid Picture Pile presents a number of personal photos dropped onto a cork bulletin board in a random pile. The pictures are framed to look like old-fashioned Polaroid photos with captions written on them.

Things to notice:
- The Polaroid pictures 'fly in' via native Spark animations.
- The Polaroid pictures are rotated using native Spark rotation.
- Pictures slowly disappear as they are removed from the bottom of the stack.  This is accomplished by using native Spark animation of the 'alpha' property. 

Try passing the following query parameters on the url to create different effects:
- *numimages*:  Pass different value to change the total number of pictures rotated through the picture pile.  E.g., https://www.sparkui.org/examples/polaroid/pp_polaroid.js?numimages=11.  Defaults to 8; Maximum supported is 11. 
- *doRotation*: Pass 0 or 1 to turn rotation off or on, respectively.  E.g., https://www.sparkui.org/examples/polaroid/pp_polaroid.js?doRotation=0.  Defaults to 1.
- *pics*: Pass 'flickr' to change to using some pictures captured from flickr service.  E.g., https://www.sparkui.org/examples/polaroid/pp_polaroid.js?pics=flickr. Defaults to using pictures of the Spark development team.

Multiple query parameters can be passed using standard '?' and '&' syntax, for example, https://www.sparkui.org/examples/polaroid/pp_polaroid.js?numimages=11&doRotation=0.
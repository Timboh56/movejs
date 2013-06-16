movejs
======

Move.js is a javascript library that incorporates movement with your website's javascript events/functions.

Using the user's webcam, Move.js detects for movement in regions of the user's webcam video feed and triggers
any function passed in.

To use, create a video tag with any id.
E.G.
  	<video id="camera_stream" width="640" height="480" autoplay></video>
      
Create two canvases of the same width and height. The first canvas is for receiving and interfacing with video. 
The second one is responsible for detecting for motion. 

E.G.

	<canvas id="canvas" width="640" height="480"></canvas>
	<canvas id="canvas_blended" width="640" height="480"></canvas>

To initialize Move.js, simply pass the id's of the video and canvases into the constructor. Additionally, to
define regions in the video feed you want to detect for movement, you can create Region objects. A Region
object is used for drawing rectangles and takes in x y coordinates, a width, height, a 
color to be drawn on the blended canvas, and a callback function that is executed when motion is detected
in the region.

E.G.

  	var regions = [
		region1 = new Region(0,0,100,100,'#00FF00'),
		region2 = new Region(540,0,100,100,'#00FF00', function() {
			console.log('this function was executed!');
		})
	];
        
Move's constructor takes in the id of the video tag, the id of a canvas you want to use 
for video data interfacing, the id of a canvas you want to use for detecting motion, and an
array of regions you want used.
        
	var move = new Move('camera_stream','canvas','canvas_blended',regions);
        
Don't just sit there; Move JS!!


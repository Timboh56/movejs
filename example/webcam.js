
jQuery($(
	function() {
		var regions = [
			region1 = new Region(0,0,100,100,'#00FF00'),
			region2 = new Region(540,0,100,100,'#00FF00', 
				function() {
					console.log('this function was executed!');
				}
			)
		];
		cam_processing.initialize('camera_stream','canvas','canvas_blended',regions);
	}
));;
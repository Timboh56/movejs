
var Region = function(x,y,width,height,fill_color,moveFunction) {
	this.x = x, this.y = y, this.width = width, this.height = height, this.fill_color = fill_color;
	if (typeof moveFunction == 'function') {
		this.moveFunction = moveFunction;
	}
}

Region.prototype.draw = function(ctxt) {
	ctxt.strokeStyle = this.fill_color;
	ctxt.strokeRect(this.x,this.y,this.width,this.height);
}

Region.prototype.onMove = function() {
	if (this.moveFunction != null) this.moveFunction();
}

var move = (function($) {
	return { 
		
		// initialize constructor takes parameters:
		// 	id of video tag, 
		// 	id of canvas to be drawn on, 
		// 	regions array containing region objects,
		//	properties object that defines properties for class
		initialize: function(camera_id, canvas_id, blend_id, regions, properties) {
			var self = this;
			
			// set properties or use default properties			
			var properties = properties || { 'display_canvas': 'none', 'interval': 1000 };			
			
			this.stream = $('#' + camera_id)[0];
			this.cnvs = $('#' + canvas_id)[0];
			this.cnvs_blended = $('#' + blend_id)[0];
			
			// get contexts of canvases
			this.cnvs_ctxt = this.cnvs.getContext('2d');
			this.blended_ctxt = this.cnvs_blended.getContext('2d');
			
			// apply properties
			this.stream.style.display = properties.display_canvas, 
				this.cnvs.style.display = properties.display_canvas,
				this.interval = properties.interval;
			
			this.regions = regions;
			this.timeout = false;					
		    this.last_image_data;
			
			this.cnvs_ctxt.translate(this.cnvs.width,0);
			this.cnvs_ctxt.scale(-1,1);
		    
			this.webcamSetup().done( function() { self.update(); });
		},
	
		webcamSetup: function() {
			var self = this;
			navigator.usermedia = (navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);
			var dfd_setup = $.Deferred();
			if (navigator.usermedia !== null) {
				navigator.usermedia(
					{
						video: true,
						audio: false
					},
					function(success) {
						self.stream.src = window.webkitURL.createObjectURL(success);
						dfd_setup.resolve();
					},
					function(error) {
						console.log('Your browser returned the following error: ' + error);
						dfd_setup.reject();
					}
				);
			} else {
				console.log('Sorry, your browser does not support user media');
				dfd_setup.reject();
			}
			
			return dfd_setup.promise();
		},
	
		update: function() {
			this.draw();
			this.blend();
			this.timeOut = setTimeout(this.update.bind(this), 10);
		},
	
		draw: function(region1) {
			this.cnvs_ctxt.drawImage(this.stream,0,0,this.stream.width,this.stream.height);
		},
	
		difference: function(target,data1,data2) {
			if (data1.length != data2.length) return null;
		
			var i = 0;
			var end =  data1.length;
			var motion_detected = false;			
		
			while (i  < end) {
				var avg_diff = (this.fastAbs(data1[i] - data2[i]) + 
					this.fastAbs(data1[i + 1] - data2[i + 1]) + 
					this.fastAbs(data1[i + 2] - data2[i + 2]))/3;
				var val;
			
				if ((val = this.threshold(avg_diff,0x33)) == 0xFF) {
					motion_detected = true;
				}
				target[i] = val;
				target[i+1] = val;
				target[i+2] = val;
				target[i+3] = 0xFF;		
				i = i + 4;	
			}
		},
	
		fastAbs: function(value) {
			return (value ^ (value >> 31)) - (value >> 31);
		},
	
		threshold: function(value,threshold) {
			return (value > threshold) ? 0xFF : 0;
		},
	
		blend: function() {
			var width = this.cnvs.width;
			var height = this.cnvs.height;

			var src_data = this.cnvs_ctxt.getImageData(0,0,width,height);
			if (!this.last_image_data)
				this.last_image_data = this.cnvs_ctxt.getImageData(0,0,width,height);
							
			var blended_data = this.cnvs_ctxt.createImageData(width,height);

			this.difference(blended_data.data,src_data.data,this.last_image_data.data);
			this.blended_ctxt.putImageData(blended_data,0,0);
			this.last_image_data = src_data;
			
			this.checkRegions();			
		},
		
		checkRegions: function() {
			for (var i in this.regions) {
				this.checkRegion(this.regions[i]);
				this.regions[i].draw(this.blended_ctxt);		
			}
		},
		
		checkRegion: function(region) {
			var i = 0;
			var self = this;
			
			var region_data = this.blended_ctxt.getImageData(region.x,region.y,region.width,region.height);
			
			while (i < region_data.data.length) {
				var sum = region_data.data[i] + region_data.data[i + 1] + region_data.data[i + 2];
				if (sum != 0 && self.timeout == false) {
					region.onMove();
					self.timeout = true;

					// when motion is detected, time out for some time
					// until the event can be triggered again.
					setTimeout(function() {
						self.timeout = false;					
					}, self.interval);
				}
				i = i + 4;
			}
		}
	};
})(jQuery);
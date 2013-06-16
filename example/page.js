(function($){
	titles = ['1','2','3'];
	
	$(function() {
		var pages = [$('.page1'),$('.page2'),$('.page3')],
			pageContainer = $('.pages-container'),
			pageWidth = (100/pages.length) + '%',
			anchors = $('a'), n = 0, 
			isSmooth = false;
			
		init();
			
			
		function init() {
			pageContainer.css('width', pages.length+'00%');	

			for (var i = 0, page; page = pages[i]; i++) {
				page.css('width',pageWidth);
			}
		}
		
		function move(n) {
			pageContainer.animate(
					{
						'margin-left': '-'+n+'00%'
					},500);	
		}
		
	
		window.addEventListener("keydown", function(evt) {
			evt = evt.keyCode || window.event.keyCode;
			if (evt == 37) {
				(n === 0) ? n = 2 : n--;
				move(n);
			}
			
			if (evt == 39) {
				(n === 2) ? n = 0 : n++;
				move(n);
			}
		}, false);
	
	});
})(jQuery);
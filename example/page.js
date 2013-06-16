(function($){
	titles = ['1','2','3'];
	
	$(function() {
		var pages = [$('.page1'),$('.page2'),$('.page3')],
			pageContainer = $('.pages-container'),
			pageWidth = (100/pages.length) + '%',
			anchors = $('a'), n = 0, 
			isSmooth = false;			
			
		function init() {
			pageContainer.css('width', pages.length+'00%');	

			for (var i = 0, page; page = pages[i]; i++) {
				page.css('width',pageWidth);
			}
		}
		
		function movePage(n) {
			pageContainer.animate(
					{
						'margin-left': '-'+n+'00%'
					},500);	
		}
		
	
		function moveLeft(){
			(n === 0) ? n = 2 : n--;
			movePage(n);
		}
		
		function moveRight(){			
			(n === 2) ? n = 0 : n++;
			movePage(n);
		}
		
		var regions = [
			region1 = new Region(0,0,50,50,'#00FF00', moveLeft),
			region2 = new Region(270,0,50,50,'#00FF00', moveRight)
		];
		var move = new Move('camera_stream','canvas','canvas_blended',regions);
		init();
	
	});
})(jQuery);
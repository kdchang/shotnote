jQuery(function($){
	window.MainView = Backbone.View.extend({
		el: $("body"),

		events: {
			'click #camera': 'cameraActivity',
			'click #left-btn': 'leftPanel',
			'click #right-btn': 'rightPanel'
		},

		initialize: function(){
			console.log('AppView');
			_.bindAll(this, 'cameraActivity', 'leftPanel', 'rightPanel');
		},

		leftPanel: function(){
			console.log('left-btn');
			if($('.wrap').hasClass('left')){
				$('.wrap').removeClass('left');
				$('.left-panel').hide();
			}
			else{
				$('.wrap').addClass('left');
				$('.left-panel').show();
			}
		},

		rightPanel: function(){
			console.log('right-btn');
			if($('.wrap').hasClass('right')){
				$('.wrap').removeClass('right');
				$('.right-panel').hide();
			}
			else{
				$('.wrap').addClass('right');
				$('.right-panel').show();
			}
		},

		cameraActivity: function(e){
		    var ele = document.getElementById('result');
		    ele.innerHTML = '';
		    var activityRequest = new MozActivity({
		      name: 'pick',
		      data: {
		        type: 'image/jpeg',
		        width: 320,
		        height: 480
		      }
		    });
		    activityRequest.onsuccess = function onPickSuccess() {
		      if (!activityRequest.result.blob)
		        return;
		      ele.textContent = activityRequest.result.blob; 
		    };
		    activityRequest.onerror = function onPickError() {
		      console.warn('pick failed!');
		    };
		}

	});

	window.LeftPanelView = Backbone.View.extend({
		className: 'left-panel',
		initialize: function(){
			console.log('left-panel!');
		}
	});

	window.RightPanelView = Backbone.View.extend({
		className: 'right-panel',
		initialize: function(){
			console.log('right-panel!');
		}
	});

	window.Main = new MainView;
	window.LeftPanel = new LeftPanelView;
	window.RightPanel = new RightPanelView;
});
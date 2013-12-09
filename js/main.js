jQuery(function($){
	window.Note = Backbone.Model.extend({
		initialize: function(){
			console.log("Model");
		},
		defaults: {
			title: null,
			group: null,
			tag: null,
			time: null,
			memo: null,
			img: null,
			time: null,
		}
	});

	window.Notes = Backbone.Collection.extend({
		initialize: function(){
			console.log("collection!");
		},
		model: Note
	});

	window.Notebook = Backbone.Model.extend({
		initialize: function(){
			console.log('Notebook!')
		},
		defaults: {
			booktitle: null,
			time: null 
		}
	});

	window.Notebooks = Backbone.Collection.extend({
		initialize: function(options){
			console.log('Notebooksss!');
			this.bind('add', options.view.render);
		},
		model: Notebook
	});

	window.MainView = Backbone.View.extend({
		el: $("body"),

		events: {
			'click #init-img': 'cameraActivity',
			'click #left-btn': 'leftPanel',
			'click #right-btn': 'cameraActivity',
			'click #musk': 'muskSlide'
		},

		initialize: function(){
			console.log('AppView');
			_.bindAll(this, 'cameraActivity', 'leftPanel', 'rightPanel', 'muskSlide');
		},

		leftPanel: function(){
			console.log('left-btn');
			if($('.wrap').hasClass('left')){
				$('.wrap').removeClass('left');
				$('.left-panel').hide();
				$('.toolbars').show();
			}
			else{
				$('.wrap').addClass('left');
				$('.left-panel').show();
				$('.toolbars').hide();
				$('.musk').show();
			}
		},

		rightPanel: function(){
			console.log('right-btn');
			if($('.wrap').hasClass('right')){
				$('.wrap').removeClass('right');
				$('.right-panel').hide();
				$('.toolbars').show();
			}
			else{
				$('.wrap').addClass('right');
				$('.right-panel').show();
				$('.toolbars').hide();
			}
		},

		muskSlide: function(){
			if($('.wrap').hasClass('left')){
				$('.wrap').removeClass('left');
				$('.left-panel').hide();
				$('#musk').hide();
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
		el: '#left-panel',
		template: $('#nb-list-tmpl').template(),

		initialize: function(){
			console.log('left-panel!');
			_.bindAll(this, 'render', 'newNoteBook', 'writeNewNote', 'deleteNoteBook');
			this.notebooks = new Notebooks({view: this});
		},
		events: {
			'click #add-notebook': 'newNoteBook',
			'dblclick .nb-list-items': 'deleteNoteBook'
		},
		newNoteBook: function(){
			var title = prompt('Key the Notebook name');
			this.notebookModel = new Notebook({'booktitle': title});
			this.notebooks.add(this.notebookModel);
			this.notes = new Notes({});
		},
		writeNewNote: function(){
			if($('.wrap').hasClass('left')){
				$('.wrap').removeClass('left');
				$('.left-panel').hide();
			}
			else{
				$('.wrap').addClass('left');
				$('.left-panel').show();
			}
		},
		deleteNoteBook: function(e){
			$(e.currentTarget).remove();
			this.notebooks.remove(this.notebooks.models);
		},
		render: function(){
			var element = jQuery.tmpl(this.template, this.notebooks.toJSON());
			$('#nb-list-item').html(element);
			return this;
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
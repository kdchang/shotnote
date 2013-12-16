jQuery(function($){
	//using setTimeout to fire a function when the user stops scrolling
	var timer;
    $(window).bind('scroll', function () {
    	$('.toolbars').hide();
        clearTimeout(timer);
        timer = setTimeout( refresh , 2000);
    });

    var refresh = function () { 
        $('.toolbars').show();
        console.log('Stopped Scrolling'); 
    };

    //Backbone
	var cid = 1;
	window.Note = Backbone.Model.extend({
		initialize: function(){
			console.log("Model");
			//alert('New Model');
			this.bind("remove", function() {
			  this.destroy();
			});
		},
		defaults: {
			id: 0,
			title: 'Mozilla Rock',
			tag: 'Firefox',
			time: '2013/12/10',
			memo: 'Firefox OS is awesome',
			img: './img/firefox-256.jpg'
		}
	});

	window.Notes = Backbone.Collection.extend({
		initialize: function(options){
			console.log("Collection!");
			//alert(options.view);
			//this.bind('add', options.view.render);
		},

		localStorage: new Store("store-note"),

		model: Note
	});

	window.MainView = Backbone.View.extend({
		el: $("body"),

		template: $('#main-view').template(),

		navTemplate: $('#main-nav').template(),

		mainListTemplate: $('#main-list').template(),

		emptyTemplate: $('#empty-list').template(),

		createNoteTemplate: $('#create-a-note').template(),

		editNoteTemplate: $('#edit').template(),

		editTitleTemplate: $('#edit-title').template(), 

		saveTitleTemplate: $('#save-title').template(),

		events: {
			'click #right-btn': 'search',
			'click #camera': 'cameraActivity',
			'click #check': 'leftNote',
			'click #edit-done': 'doneNote',
			'click #info': 'showNote',
			'click #edit-note': 'editNote',
			'click #edit-title': 'editTitle',
			'click #save-title-btn': 'saveTitle',
			//click the list in the main view
			'click .list-items': 'showNote',
			'click #delete-note': 'delteNote',
			'click #musk': 'muskSlide'

		},

		initialize: function(collection){
			console.log('AppView');
			_.bindAll(this, 'search', 'render', 'showNote', 'leftNote', 'doneNote', 'editNote', 'delteNote', 'editTitle', 'saveTitle', 'cameraActivity');
			// this.noteModel = new Note();
			// this.noteModel.save();
			this.notes = collection;
			//var storeVar = localStorage["store-note"];
 			//alert(this.notes.length);
			this.notes.fetch();
			this.notes.toJSON();
			this.render();
			//this.notes.on("add", this.renderThing, this);
			// this.model.bind('change', this.render);
			// this.model.bind('destory', this.remove);
		},

		search: function(){
			var title = prompt('Please Key Title');
		    this.noteModel = new Note({'title': title});
		    var element = jQuery.tmpl(this.template, this.notes.toJSON());
			$('#view-port').html(element);
			this.notes.add(this.noteModel);
		},

		render: function(){
			// alert('render');
			if(this.notes.length > 0){
				var element = jQuery.tmpl(this.mainListTemplate, this.notes.toJSON());
				$('#item-list').html(element);		
			}
			else{
				var element = jQuery.tmpl(this.emptyTemplate);
				$('#view-port').html(element);
			}
			return this;
		},

		showNote: function(e){
			//alert(1);
			console.log($(e.currentTarget).attr('data-id'));
			//alert($(e.currentTarget).attr('data-id'));
			var element = jQuery.tmpl(this.createNoteTemplate, this.notes.get($(e.currentTarget).attr('data-id')).toJSON());
			//alert(this.notes.get($(e.currentTarget).attr('data-id')).toJSON());
			$('#view-port').html(element);

		    // var img = document.createElement("img");

		    // img.src = this.notes.get($(e.currentTarget).attr('data-id'))['img'];
		    // // Present that image in your app
		    // var imagePresenter = document.querySelector("#take-img");
		    // imagePresenter.appendChild(img);
			return this;
		},

		leftNote: function(){
			var check = confirm('Left ?');
			if(check){
				var mainView = jQuery.tmpl(this.template);
				$('#view-port').html(mainView);
				var element = jQuery.tmpl(this.mainListTemplate, this.notes.toJSON());
				$('#item-list').html(element);
			}
		},

		doneNote: function(){
			alert('edit-done');
			var mainView = jQuery.tmpl(this.template);
			$('#view-port').html(mainView);
			var element = jQuery.tmpl(this.mainListTemplate, this.notes.toJSON());
			$('#item-list').html(element);
		},

		editNote: function(e){
			alert($(e.currentTarget).attr('data-id'));
			var element = jQuery.tmpl(this.editNoteTemplate, this.notes.get($(e.currentTarget).attr('data-id')).toJSON());
			$('#view-port').html(element);
		},

		editTitle: function(e){
			var element = jQuery.tmpl(this.editTitleTemplate, this.notes.get($(e.currentTarget).attr('data-id')).toJSON());
			$('#note-content').html(element);
		},

		saveTitle: function(e){
			var editTitle = $('#input-title').val();
			var editTag = $('#input-tag').val();
			var editTime = $('#input-time').val();
			var editMemo = $('#input-memo').val();
			// alert(editTitle);
			this.notes.get($(e.currentTarget).attr('data-id')).set({'title': editTitle, 'tag': editTag, 'time': editTime, 'memo': editMemo});
			//alert(this.noteModel);
		    			
			var element = jQuery.tmpl(this.saveTitleTemplate, this.notes.get($(e.currentTarget).attr('data-id')).toJSON());
			
			$('#note-content').html(element);
			this.notes.get($(e.currentTarget).attr('data-id')).save();
			
		},

		delteNote: function(e){
			//alert($(e.currentTarget).attr('data-id'));

			// cid--;
			// for(var i = this.notes.models[$(e.currentTarget).attr('data-id')]+1; i < this.notes.length; i++){
			// 	alert('id!!!');
			// 	alert(this.notes.models[i].get('id'));
			// 	this.notes.models[i].set({'id': parseInt(this.notes.models[i].get('id')) - 1});
			// }
			var de = confirm('Delete or NOT ?');
			if(de){
				this.notes.remove(this.notes.get($(e.currentTarget).attr('data-id')));
	
				if(this.notes.length > 0){
					alert($(e.currentTarget).attr('data-id'));
					var mainView = jQuery.tmpl(this.template);
					$('#view-port').html(mainView);
					var element = jQuery.tmpl(this.mainListTemplate, this.notes.toJSON());
					$('#item-list').html(element);
				}
				else{
					alert('empty');
					var element = jQuery.tmpl(this.emptyTemplate);
					$('#view-port').html(element);
				}
			}

		},

		cameraActivity: function(e){
			var self = this;
		    // var ele = document.getElementById('result');
		    // ele.innerHTML = '';
		    
		    var activityRequest = new MozActivity({
		      name: 'pick',
		      data: {
		        type: 'image/jpeg',
		        width: 320,
		        height: 480
		      }
		    });
		    activityRequest.onsuccess = function onPickSuccess(e) {
		        // if (!activityRequest.result.blob){
		        // pick.onsuccess = function () { 
			    // Create image and set the returned blob as the src
			    self.noteModel = new Note();
			    self.noteModel.set({'id': self.noteModel.cid});
			    // cid++;
			    //alert(cid);
				self.notes.add(self.noteModel);
				self.noteModel.save();
		    	var element = jQuery.tmpl(self.createNoteTemplate, self.noteModel.toJSON());
				$('#view-port').html(element);
			    var img = document.createElement("img");
			    $('#show-img').hide();

			    img.src = window.URL.createObjectURL(this.result.blob);
			    img.className = 'create-photo';
			    // Present that image in your app
			    var imagePresenter = document.querySelector("#take-img");
			    imagePresenter.appendChild(img);
			    self.noteModel.set({'img': img.src});
			    self.noteModel.save();
				// }
			};
 
		    activityRequest.onerror = function onPickError() {
		      console.warn('pick failed!');
		    };
		}

	});

	var collection = new Notes;
	window.Main = new MainView(collection);
	//window.LeftPanel = new LeftPanelView;
	//window.RightPanel = new RightPanelView;
});

		// leftPanel: function(){
		// 	console.log('left-btn');
		// 	if($('.wrap').hasClass('left')){
		// 		$('.wrap').removeClass('left');
		// 		$('.left-panel').hide();
		// 		$('.toolbars').show();
		// 	}
		// 	else{
		// 		$('.wrap').addClass('left');
		// 		$('.left-panel').show();
		// 		$('.toolbars').hide();
		// 		$('.musk').show();
		// 	}
		// },



		// muskSlide: function(){
		// 	if($('.wrap').hasClass('left')){
		// 		$('.wrap').removeClass('left');
		// 		$('.left-panel').hide();
		// 		$('#musk').hide();
		// 	}
		// },

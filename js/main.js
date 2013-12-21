jQuery(function($){
	//using setTimeout to fire a function when the user stops scrolling
	var timer;
    $(window).bind('scroll', function () {
    	$('.toolbars').hide();
        clearTimeout(timer);
        timer = setTimeout( refresh , 1500);
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
		defaults: function(){
			return {
				id: 0,
				title: 'Mozilla Rock',
				tag: 'Firefox',
				time: '2013/12/10',
				memo: 'Firefox OS is Awesome!',
				img: './img/firefox-os.png'
			}
		}
	});

	window.Notes = Backbone.Collection.extend({
		initialize: function(options){
			console.log("Collection!");
			//alert(options.view);
			//this.bind('add', options.view.render);
		},

		model: Note,

		localStorage: new Backbone.LocalStorage("notes")

		
	});

	window.MainView = Backbone.View.extend({
		el: $("body"),

		template: $('#main-view').template(),

		navTemplate: $('#main-nav').template(),

		mainListTemplate: $('#main-list').template(),

		emptyTemplate: $('#empty-list').template(),

		searchListTemplate: $('#search-list').template(),

		createNoteTemplate: $('#create-a-note').template(),

		drawModeTemplate: $('#draw-mode').template(),

		editNoteTemplate: $('#edit').template(),

		editTitleTemplate: $('#edit-title').template(), 

		saveTitleTemplate: $('#save-title').template(),

		events: {
			'click #right-btn': 'search',
			'click #camera': 'cameraActivity',
			'click #check': 'leftNote',
			'click #edit-done': 'doneNote',
			'click #info': 'showNote',
			'click #draw': 'drawNote',
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
			_.bindAll(this, 'search', 'render', 'showNote', 'leftNote', 'doneNote', 'drawNote', 'editNote', 'delteNote', 'editTitle', 'saveTitle', 'cameraActivity');
			// this.noteModel = new Note();
			// this.noteModel.save();
			this.notes = collection;
			// var storeVar = localStorage["store-note"];
 			// alert(this.notes.length);
			this.notes.fetch();
			this.notes.toJSON();
			this.render();
			// this.notes.on("add", this.renderThing, this);
			// this.model.bind('change', this.render);
			// this.model.bind('destory', this.remove);
		},

		search: function(){
			var title = prompt('Please Key Title');
			if(title){
				var outcome = this.notes.where({'title': title});
				
				//alert(outcome.length);
				// _.each(filteredList, function(item){
				// 	var element = jQuery.tmpl(this.mainListTemplate, item.toJSON());
				// 	$('#item-list').html(element);
				// });
				var element = jQuery.tmpl(this.searchListTemplate, outcome.toJSON());
				$('#view-port').html(element);



				//this.notes.add(this.noteModel);
			}
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
			var check = confirm('Left The Note?');
			if(check){
				var mainView = jQuery.tmpl(this.template);
				$('#view-port').html(mainView);
				var element = jQuery.tmpl(this.mainListTemplate, this.notes.toJSON());
				$('#item-list').html(element);
			}
		},

		doneNote: function(){
			//alert('Create a Note!');
			var mainView = jQuery.tmpl(this.template);
			$('#view-port').html(mainView);
			var element = jQuery.tmpl(this.mainListTemplate, this.notes.toJSON());
			$('#item-list').html(element);
		},

		drawNote: function(e){
			var self = this;
			//alert(e);
			//init();
			var element = jQuery.tmpl(this.drawModeTemplate, this.notes.get($(e.currentTarget).attr('data-id')).toJSON());
			$('#view-port').html(element);

			//Load Draw Image
			var canvas, context, image;
	        canvas = document.createElement('canvas');
	        canvasDraw = document.createElement('canvas');

	        document.getElementById('take-img').appendChild(canvas);
	        //document.getElementById('take-img').appendChild(canvasDraw);
	        canvas.setAttribute('id',  'draw-canvas');

	        canvas.width = 300;
	        canvas.height = 400;
	        canvasDraw.width = 300;
	        canvasDraw.height = 400;
	        context = canvas.getContext('2d');
	        contextDraw = canvasDraw.getContext('2d');
	        //alert(this.notes.get($(e.currentTarget).attr('data-id')).get('img'));
	        image = new Image();
	        image.addEventListener('load', function(){
	            context.drawImage(image, 0, 0, canvas.width, canvas.height);

	            //callback(context.getImageData(0, 0, canvas.width, canvas.height));
	        }, false);
	        image.src = this.notes.get($(e.currentTarget).attr('data-id')).get('img');

		    var draw; //是否在繪圖狀態
		    var m, c; //繪圖物件
	        m = document.getElementById("m");
	        p = document.getElementById("po"); //取得畫布物件參考
	        c = m.getContext("2d"); //建立2d繪圖物件

	        m.addEventListener('mousedown', md, false);
			m.addEventListener('mousemove', mv, false);
			m.addEventListener('mouseup', mup, false);

		    document.getElementById('Radio1').addEventListener('click', Radio1_onclick, false);
		    document.getElementById('Radio2').addEventListener('click', Radio2_onclick, false);
		    document.getElementById('Radio3').addEventListener('click', Radio3_onclick, false);
		    document.getElementById('Radio4').addEventListener('click', Radio4_onclick, false);
		    document.getElementById('Radio5').addEventListener('click', Radio5_onclick, false);
		    document.getElementById('Radio6').addEventListener('click', Radio6_onclick, false);
		    document.getElementById('Radio7').addEventListener('click', Radio7_onclick, false);
		    document.getElementById('Radio8').addEventListener('click', Radio8_onclick, false);
		    document.getElementById('Radio9').addEventListener('click', Radio9_onclick, false);
		    document.getElementById('Button1').addEventListener('click', Button1_onclick, false);
		    document.getElementById('Button2').addEventListener('click', Button2_onclick, false);
	        
	        function md(event) {
	        	//alert(event.clientX);
	            c.moveTo(event.clientX, event.clientY); //起點
	            draw = true; //進入繪圖模式
	            c.beginPath(); //本次繪圖筆畫開始
	            c.closePath();
	        }
	        function mv(event) {   
	            c.lineTo(event.clientX - 50, event.clientY - 50); //下一點
	            c.stroke(); //繪圖
	            
	        }
	        function mup(event) {
	            draw = false; //離開繪圖模式
	            c.closePath(); //繪圖筆畫結束
	        }

	        function Radio1_onclick() { c.strokeStyle = "rgb(255,0,0)"; }
	        function Radio2_onclick() { c.strokeStyle = "rgb(0,255,0)"; }
	        function Radio3_onclick() { c.strokeStyle = "rgb(0,0,255)"; }
	        function Radio4_onclick() { c.strokeStyle = "rgb(0,0,0)"; }

	        function Radio5_onclick() { c.lineWidth = 1; }
	        function Radio6_onclick() { c.lineWidth = 2; }
	        function Radio7_onclick() { c.lineWidth = 3; }
	        function Radio8_onclick() { c.lineWidth = 5; }
	        function Radio9_onclick() { c.lineWidth = 10; }

	        function Button1_onclick() { c.clearRect(0,0); }

	        function Button2_onclick() { 
                //script block

                function loadImages(sources, callback) {
                    var images = {};
                    var loadedImages = 0;
                    var numImages = 0;
                    // get num of sources
                    for (var src in sources) {
                        numImages++;
                    }
                    for (var src in sources) {
                        images[src] = new Image();
                        images[src].onload = function () {
                            if (++loadedImages >= numImages) {
                                callback(images);
                            }
                        };
                        images[src].src = sources[src];
                    }
                }

               //Canvas final here.
                var can = document.createElement("canvas");
                var context = can.getContext("2d");
                //document.getElementById('canvas').appendChild(can);

                var sources = {
                    darthVader: canvas.toDataURL("image/png"),
                    yoda: m.toDataURL("image/png")
                };

                loadImages(sources, function (images) {
                    context.drawImage(images.darthVader, 100, 30, 200, 137);
                    context.drawImage(images.yoda, 350, 55, 93, 104);
//finalimage  here which has two canvas data
                	var finalimage = document.createElement("img");

        			finalimage.src = canvas.toDataURL("image/png"); 
        			document.getElementById('m').appendChild(finalimage);
        			this.notes.get($(e.currentTarget).attr('data-id')).set({'img': finalimage.src});
					this.notes.get($(e.currentTarget).attr('data-id')).save();
                });
               
               
	        }

		},

		editNote: function(e){
			//alert($(e.currentTarget).attr('data-id'));
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
		    this.notes.get($(e.currentTarget).attr('data-id')).save();			

			var element = jQuery.tmpl(this.saveTitleTemplate, this.notes.get($(e.currentTarget).attr('data-id')).toJSON());
			$('#note-content').html(element);		
		},

		delteNote: function(e){
			var de = confirm('Delete This Note or NOT ?');
			if(de){
				this.notes.remove(this.notes.get($(e.currentTarget).attr('data-id')));
	
				if(this.notes.length > 0){
					//alert($(e.currentTarget).attr('data-id'));
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

		    //File API To Save The Image
		    var handleFileSelect = function(evt) {
		    			          	//alert(evt)
			    var f = evt.target.result.blob; // FileList object
			    console.log(evt);
			    var reader = new FileReader();

				// Closure to capture the file information.
				reader.onload = (function(theFile) {
				return function(e) {
				  // Render thumbnail.
				  
				    //alert(theFile);
				    self.noteModel.set({'img': e.target.result});
					self.noteModel.save();
				};
				})(f);
				//alert(11);
				// Read in the image file as a data URL.
				reader.readAsDataURL(f);
			    // Loop through the FileList and render image files as thumbnails.
			}
		    
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
			    var imagePresenter = document.querySelector("#take-img");
			    imagePresenter.appendChild(img);
			    img.className = 'create-photo';
			    //alert(e.target.result);
			    handleFileSelect(e);

			};
 
		    activityRequest.onerror = function onPickError() {
		      console.warn('Pick Image Failed!');
		    };
		}

	});

	var collection = new Notes;
	window.Main = new MainView(collection);
	//window.LeftPanel = new LeftPanelView;
	//window.RightPanel = new RightPanelView;
});



jQuery(function($){

	window.AppView = Backbone.View.extend({
		el: $('#wrap'),

		event: {
			'click #camera': 'cameraActivity'
		},

		initialize: function(){
			console.log('AppView');
		},

		cameraActivity: function(){
			var getphoto = new MozActivity({
 name: "pick",
 data: {
 type: ["image/png", "image/jpg", "image/jpeg"]
 }
 });

 getphoto.onsuccess = function () {
 var img = document.createElement("img");
 if (this.result.blob.type.indexOf("image") != -1) {
 img.src = window.URL.createObjectURL(this.result.blob);
 }
 };

 getphoto.onerror = function () {
 // erro!
 };
		}
	});
	window.App = new AppView;
})
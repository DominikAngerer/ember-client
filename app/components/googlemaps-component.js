/*global google */

import Ember from 'ember';

export default Ember.Component.extend({
	polygonCoords: [],
	firstTime: true,
	lastMarker: null,
	insertMap: function() {
	    var container = this.$(".map-canvas");
	    var options = {
			center: new google.maps.LatLng("48.311196", "14.29829"),
			zoom: 15,
			mapTypeId: google.maps.MapTypeId.ROADMAP,
			styles:[{"featureType":"water","stylers":[{"visibility":"on"},{"color":"#acbcc9"}]},{"featureType":"landscape","stylers":[{"color":"#f2e5d4"}]},{"featureType":"road.highway","elementType":"geometry","stylers":[{"color":"#c5c6c6"}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#e4d7c6"}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#fbfaf7"}]},{"featureType":"poi.park","elementType":"geometry","stylers":[{"color":"#c5dac6"}]},{"featureType":"administrative","stylers":[{"visibility":"on"},{"lightness":33}]},{"featureType":"road"},{"featureType":"poi.park","elementType":"labels","stylers":[{"visibility":"on"},{"lightness":20}]},{},{"featureType":"road","stylers":[{"lightness":20}]}]
		};
		this.set('map', new google.maps.Map(container[0], options));
	}.on('didInsertElement'),

	setMarkers: function() {
		var _self = this;
		setTimeout(function (){
			var map = _self.get('map'),
			markers = _self.get('markers'),
			latitude = "48.311196",
			longitude = "14.29829";
			var polygonCoords = [];
			var old = _self.get('lastMarker');
			// set first marker
			/*var gMapsMarker = new google.maps.Marker({
				position: new google.maps.LatLng(markers.get('firstObject').get('latitude'), markers.get('firstObject').get('longitude')),
				map: map,
				icon: 'http://adtime.at/img/marker30x30.png'
			});*/

			// fill up middle points with polylines
			markers.forEach(function(marker){
				if(typeof(marker.get('latitude')) !== "undefined" && typeof(marker.get('longitude')) !== "undefined" ) {
					polygonCoords.push(new google.maps.LatLng(marker.get('latitude'), marker.get('longitude')));
					latitude = marker.get('latitude');
					longitude = marker.get('longitude');
				}
			}, this);
			// trigger setPolyline
			_self.set('polygonCoords', polygonCoords);
			
			// set last marker
			_self.set('lastMarker', new google.maps.Marker({
				position: new google.maps.LatLng(latitude, longitude),
				map: map,
				icon: 'http://adtime.at/img/marker30x30.png'
			}));
			setTimeout(function (){
				if(old) {
					old.setMap(null);
				}
			}, 500);
			// center map on last marker
			if(_self.firstTime){
				map.setCenter(new google.maps.LatLng(latitude, longitude));
				_self.firstTime = false;
			}
		}, 500);
	}.observes('markers.@each.latitude', 'markers.@each.longitude'),

	setPolyline: function(){
		this.polyline = new google.maps.Polyline({
			path: this.polygonCoords,
			strokeColor: "#4b4b4b",
			strokeOpacity: 1.0,
    		strokeWeight: 2
		});
		this.polyline.setMap(this.get('map'));
	}.observes('polygonCoords')
});

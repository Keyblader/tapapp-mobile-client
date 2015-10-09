// Tomar posición actual

$(function(){

	if (navigator.geolocation)
	{

		navigator.geolocation.getCurrentPosition(getCoords, getError); /* obtiene la geolocalizaicon del navegador*/
	}
	else{
		initialize(13.30272, -87.194107);
	}

	function getCoords(position){

		var lat = position.coords.latitude;
		var lng = position.coords.longitude;

		initialize(lat, lng);
		document.getElementById('id_latitud').value=lat;
		document.getElementById('id_longitud').value=lng;
		$('#id_latitud').val(lat)
		$('#id_longitud').val(lng)

	}

	function getError(err){ /*Para cuando hay un error al tratar de obtener la posicion*/
		initialize(13.30272, -87.194107);
	}

	function initialize(lat, lng){

		var latlng = new google.maps.LatLng(lat, lng);

		var mapSettings = {
			center: latlng,
			zoom: 15,
			mapTypeId: google.maps.MapTypeId.ROADMAP
		}

		map = new google.maps.Map($('#mapa').get(0), mapSettings); /*El #mapa es el identificador del div en index.html*/

		var marker = new google.maps.Marker({
			position: latlng,
			map: map,
			draggable: false,
			title: 'Arrastrame'
		});

		google.maps.event.addListener(marker, "position_changed", function(){
			var markerCoords = marker.getPosition();
			$('#id_latitud').val(markerCoords.lat());
			$('#id_longitud').val(markerCoords.lng());
		});

		/*$('#form_bar').submit(function(e){
			e.preventDefault();
			var nom = (document.getElementById('id_nombre').value);
			var descripcion = (document.getElementById('id_descripcion').value);
			$.ajax({
				data:{'lat':lat, 'lng':lng, 'nom':nom, 'descripcion':descripcion},
				url: '/tapas/guardarBar/',
				type: "GET",
				success: function(datos){window.location.href = "/";}
			});
		});*/
		
	}
});

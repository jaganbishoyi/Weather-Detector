// JavaScript Document
function displayLocation(latitude,longitude){
        var request = new XMLHttpRequest();
        var method = 'GET';
		var url = 'http://maps.googleapis.com/maps/api/geocode/json?latlng='+latitude+','+longitude+'&sensor=true';
        var async = true;

        request.open(method, url, async);//Request prepration
        request.onreadystatechange = function(){
          if(request.readyState == 4 && request.status == 200){
            var data = JSON.parse(request.responseText);// Holding response in variable
            var address = data.results[0];
			var result = document.getElementById("address");
            result.innerHTML += address.formatted_address;
			}
        };
        request.send();//Request sending
      };

      var successCallback = function(position){
        var x = position.coords.latitude;// Geting latitude
        var y = position.coords.longitude;//Geting Longitude
        displayLocation(x,y);
		myMap(x,y);
		myWeather(x,y);
      };

      var errorCallback = function(error){
        var errorMessage = 'Unknown error';
        switch(error.code) {
          case 1:
            errorMessage = 'Permission denied';
            break;
          case 2:
            errorMessage = 'Position unavailable';
            break;
          case 3:
            errorMessage = 'Timeout';
            break;
        }
		address.innerHTML = errorMessage;
      };

      var options = {
        enableHighAccuracy: true,
        timeout: 1000000,
        maximumAge: 0
      };

      navigator.geolocation.getCurrentPosition(successCallback,errorCallback,options);

	function myMap(latitude,longitude) {
		var mapCanvas = document.getElementById("googleMap");
  		var myCenter = new google.maps.LatLng(latitude,longitude); 
  		var mapOptions = {center: myCenter, zoom: 19};
  		var map = new google.maps.Map(mapCanvas,mapOptions);
  		var marker = new google.maps.Marker({
    		position: myCenter,
    		animation: google.maps.Animation.BOUNCE
  			});
  		marker.setMap(map);
  
    	var myPosition = new google.maps.Circle({// making a circle around the current location
    	center: myCenter,
    	radius: 8,
    	strokeColor: "#0000FF",
    	strokeOpacity: 0.8,
    	strokeWeight: 2,
    	fillColor: "#0000FF",
    	fillOpacity: 0.4
  		});
  		
		myPosition.setMap(map);
  		var infowindow = new google.maps.InfoWindow({// Tool tip like think or information
    	content: "<h4>Your are Here</h4>"
  		});
  		infowindow.open(map,marker);

	}
	function myWeather(latitude,longitude){
		/*document.getElementById("displayWeather").innerHTML = "Latitude is "+latitude+"
     And Longitude is "+longitude;*/
		//var apiKey = "ef062a08a2033bb11b5c7e0864da3b4e";
  		//var baseURL = "http://api.openweathermap.org/data/2.5/weather";
		//var URL =  "baseURL+'?lat='+latitude+'&lon='+longitude+'&APPID='+apiKey";
		$.getJSON("http://api.openweathermap.org/data/2.5/weather?lat="+latitude+"&lon="+longitude+"&APPID=ef062a08a2033bb11b5c7e0864da3b4e",function(json){
            //document.getElementById("weather").innerHTML = (JSON.stringify(json));
			//var JSONData = (JSON.stringify(json));
			//document.getElementById("weather").innerHTML += json.weather[0].description;
			document.getElementById("weatherNow").innerHTML+= json.weather[0].description;
			document.getElementById("CTemp").innerHTML+= Math.round((json.main.temp - 273.15))+String.fromCharCode(176)+"C";
			document.getElementById("wind").innerHTML+= json.wind.speed+" m/s";
			document.getElementById("pressure").innerHTML+= json.main.pressure+" hpa";
			//document.getElementById("visibility").innerHTML+= json.visibility;
			document.getElementById("Humidity").innerHTML+= json.main.humidity;
      var icon_url = "http://openweathermap.org/img/w/" + json.weather[0].icon +".png";
      document.getElementById("icon").src = icon_url;

      // UNIX To local time conversion.
        function unixToLocal(unix) {
          // multiplied by 1000 so that the argument is in milliseconds, not seconds.
          var date = new Date(unix * 1000);
          var hours = date.getHours();
          var minutes = date.getMinutes();
          if(hours>12) {
            hours -= 12;
          }
          return time = hours+':'+minutes;
        }
      document.getElementById("Sunrise").innerHTML+= unixToLocal(json.sys.sunrise)+" AM";
			document.getElementById("Sunset").innerHTML+= unixToLocal(json.sys.sunset)  + " PM";
			});
		};

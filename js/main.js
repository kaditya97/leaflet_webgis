var map = L.map('map').setView([27.25, 84.11], 5);
var scale = L.control.scale().addTo(map);

var osm = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map),
  OpenTopoMap = L.tileLayer(
    "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
    {
      maxZoom: 19,
      attribution:
        'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)',
    }
  ),
  Stamen_Watercolor = L.tileLayer(
    "https://stamen-tiles-{s}.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.{ext}",
    {
      attribution:
        'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      subdomains: "abcd",
      minZoom: 1,
      maxZoom: 19,
      ext: "jpg",
    }
  ),
  CartoDB_DarkMatter = L.tileLayer(
    "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
    {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: "abcd",
      maxZoom: 19,
    }
  ),
    esri =  L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', {
        attribution: '&copy ESRI'
    });
    baseLayer = {
        "Open Street Map": osm,
        "Open Topo Map": OpenTopoMap,
        "Stamen Water color": Stamen_Watercolor,
        "Dark matter": CartoDB_DarkMatter,
        "Esri": esri,
      };

// Mouse Position Script
L.control.mousePosition().addTo(map);

// Search Bar Script
var osmGeocoder = new L.Control.OSMGeocoder({
    collapsed: false, 
    position: 'topright', 
    text: 'Search',
    placeholder: 'Search Places',
    bounds: null, /* a L.LatLngBounds object to limit the results to */
    email: null, /* an email string with a contact to provide to Nominatim. Useful if you are doing lots of queries */
});
map.addControl(osmGeocoder);

// Adding baselayer
L.control.layers(baseLayer).addTo(map);

// Adding Measure Tool
var measureControl = new L.Control.Measure({
  primaryLengthUnit: 'kilometers',
  secondaryLengthUnit: 'miles',
  primaryAreaUnit:'sqmeters',
  secondaryAreaUnit: 'acres',
  activeColor: "#ed3833",
  completedColor: "#63aabc"
});
measureControl.addTo(map);

// DrawItems control script
var drawnItems = new L.FeatureGroup();
map.addLayer(drawnItems);
var drawControl = new L.Control.Draw({
     	// position: 'topright',
		draw: {
		    polygon: {
		     shapeOptions: {
		      color: 'purple'
		     },
		     allowIntersection: false,
		     drawError: {
		      color: 'orange',
		      timeout: 1000
		     },
		    },
		    polyline: {
		     shapeOptions: {
		      color: 'red'
		     },
		    },
		    rect: {
		     shapeOptions: {
		      color: 'green'
		     },
		    },
		    circle: {
		     shapeOptions: {
		      color: 'steelblue'
		     },
        },
        marker: false
		   },
        edit: {
             featureGroup: drawnItems,
             edit: false,
             remove: false
         }
     });
map.addControl(drawControl);
map.on('draw:created', function (e) {
            drawnItems.addLayer(e.layer);
        });
map.on(L.Draw.Event.CREATED, function (e) {
		var type = e.layerType,
			layer = e.layer;
		if (type === 'marker') {
      var cord = layer.getLatLng().toString();
			layer.bindPopup(cord).openPopup();
		}
map.addLayer(layer);
});

// User Location script
function userLocation() {
  if (navigator.geolocation) {
      if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(displayLocationInfo);
          }
          function displayLocationInfo(position) {
          const lng = position.coords.longitude;
          const lat = position.coords.latitude;

          L.circle([lat, lng], {
            radius: 1000,
            opacity: 1,
            weight:1,
            fillopactity: 1,
            fillColor: 'blue'
          })
          .addTo(map)
          .bindPopup(`longitude: ${ lng } | latitude: ${ lat }`).openPopup();
          map.setView([lat,lng],12);
      }
  } else {
      console.log('You dont have geolocation');
  }
};

// User Location Button
L.easyButton('fa-crosshairs fa-lg', function(){
    userLocation();
},'Get Your Location').addTo(map);

// Building view
L.easyButton('fa-home fa-lg', function(){
  osmb = new OSMBuildings(map).load('https://{s}.data.osmbuildings.org/0.2/anonymous/tile/{z}/{x}/{y}.json'); 
},"Show 2.5D Buildings",'topleft').addTo(map);

// Full Screen Toogle
function fullScreen() {
    let e = document,
      t = e.documentElement;
    t.requestFullscreen
      ? e.fullscreenElement
        ? e.exitFullscreen()
        : t.requestFullscreen()
      : t.mozRequestFullScreen
      ? e.mozFullScreen
        ? e.mozCancelFullScreen()
        : t.mozRequestFullScreen()
      : t.msRequestFullscreen
      ? e.msFullscreenElement
        ? e.msExitFullscreen()
        : t.msRequestFullscreen()
      : t.webkitRequestFullscreen
      ? e.webkitIsFullscreen
        ? e.webkitCancelFullscreen()
        : t.webkitRequestFullscreen()
      : console.log("Fullscreen support not detected.");
  }
  var stateChangingButton = L.easyButton({
    states: [{
            stateName: 'expand',        // name the state
            icon:      'fa fa-expand fa-lg',       // and define its properties
            title:     'Full Screen',      // like its title
            onClick: function(btn) {       // and its callback
                fullScreen();
                btn.state('collapse');    // change state on click!
            }
        }, {
            stateName: 'collapse',
            icon:      'fa fa-compress fa-lg',
            title:     'Minimize',
            onClick: function(btn) {
                fullScreen();
                btn.state('expand');
            }
    }]
});
stateChangingButton.addTo(map);

// Print Option script
L.control.browserPrint({
  title: "Print current Layer",
  documentTitle: "Map",
  printModes: [
    L.control.browserPrint.mode.landscape("Tabloid VIEW", "Tabloid"),
    L.control.browserPrint.mode.landscape(),
    "PORTrait",
    L.control.browserPrint.mode.auto("Auto", "B4"),
    L.control.browserPrint.mode.custom("Selected area", "B5"),
  ],
  manualMode: !1,
  closePopupsOnPrint: !0,
}).addTo(map);

// PopUp for Vector Layers
function popUp(geo){
  map.fitBounds(geo.getBounds());
  geo.eachLayer(function(layer) {
    var l = layer.feature.properties;
    var x = Object.keys(l);
    for (i=0; i<x.length; i++) {
      if(i==0){
        layer.bindPopup(`${x[0]}: ${l[x[0]]}`);
      }else if(i==1){
        layer.bindPopup(`${x[0]}: ${l[x[0]]}<br />${x[1]}: ${l[x[1]]}`);
      }else if(i==2){
        layer.bindPopup(`${x[0]}: ${l[x[0]]}<br />${x[1]}: ${l[x[1]]}<br />${x[2]}: ${l[x[2]]}`);
      }else if(i==3){
        layer.bindPopup(`${x[0]}: ${l[x[0]]}<br />${x[1]}: ${l[x[1]]}<br />${x[2]}: ${l[x[2]]}<br />${x[3]}: ${l[x[3]]}`);
      }else{
        layer.bindPopup(`${x[0]}: ${l[x[0]]}<br />${x[1]}: ${l[x[1]]}<br />${x[2]}: ${l[x[2]]}<br />${x[3]}: ${l[x[3]]}<br />${x[4]}: ${l[x[4]]}`);
      }
    }
  });
}

var geo;
function geoJsonData(file){
  var reader = new FileReader();
  reader.onload = function() {
    geo = omnivore.geojson(reader.result)
      .on('ready',function(){
        popUp(geo);
      })
      .addTo(map);
    };
  reader.readAsDataURL(file);
}

function gpxData(file){
  var reader = new FileReader();
  reader.onload = function() {
    geo = omnivore.gpx(reader.result)
      .on('ready', function() {
        popUp(geo);
       })
      .addTo(map);
    };
  reader.readAsDataURL(file);
}

function csvData(file){
  var reader = new FileReader();
  reader.onload = function() {
    geo = omnivore.csv.parse(reader.result).addTo(map);
    popUp(geo);
  };
  reader.readAsText(file);
}

function kmlData(file){
  var reader = new FileReader();
  reader.onload = function() {
    geo = omnivore.kml.parse(reader.result).addTo(map);
    popUp(geo);
  };
  reader.readAsText(file);
}

function wktData(file){
  var reader = new FileReader();
  reader.onload = function() {
    geo = omnivore.wkt.parse(reader.result).addTo(map);
    popUp(geo);
  };
  reader.readAsText(file);
}

// Add Vector Layers
function vectorData(){
  var inputNode = document.createElement('input');
			inputNode.setAttribute('type','file');
      inputNode.setAttribute('id','leaflet-draw-shapefile-selector');
			inputNode.setAttribute('accept','.geojson,.gpx,.csv,.kml,.wkt');
      
			inputNode.addEventListener("change", function(e){
				var files = inputNode.files;
        var file = files[0];
        var parts = file.name.split('.');
        var ext = parts[parts.length - 1];

        if(ext.toLowerCase() == "geojson"){
          geoJsonData(file);
        } else if(ext.toLowerCase() == "gpx"){
          gpxData(file);
        }else if(ext.toLowerCase() == "csv"){
          csvData(file);
        }else if(ext.toLowerCase() == "kml"){
          kmlData(file);
        }else if(ext.toLowerCase() == "wkt"){
          wktData(file);
        }
      });
			inputNode.click();
}

L.easyButton('fa-globe fa-lg', function(){
  vectorData();
},"Add Vector Layers",'topright').addTo(map);

  var drawnItems = new L.FeatureGroup();
	var drawControl = new L.Control.DrawPlus({
		position: 'topright',		
		draw: {
      polygon: false,
      circle: false,
      rectangle: false,
      polyline: false,
			shapefile: {
				shapeOptions:{
			    	color: 'blue',
			    	weight: 3,
			    	opacity: 1,
			    	fillOpacity: 0.1					
				}
		  }, //Turn on my custom extension
			geojson: true,   //Could have options if needed.
		},
		edit: {
			featureGroup: drawnItems
    }
	});
	
	map.addLayer(drawnItems);
	map.addControl(drawControl);
	
	map.on(L.Draw.Event.CREATED, function(e){
    drawnItems.addLayer(e.layer);
    var type = e.layerType,
			layer = e.layer;
		if (type === 'marker') {
      var cord = layer.getLatLng().toString();
			layer.bindPopup(cord).openPopup();
		}
    map.addLayer(layer);
	});
	
	drawnItems.on('click',function(e){
    return;
  });

  // Remove features
  document.getElementById('delete').onclick = function() {
    drawnItems.clearLayers();
    if(geo){
      geo.clearLayers();
    }
  }

  document.getElementById('export').onclick = function() {
    var data;
    // Extract GeoJson from featureGroup
    if (geo){data = geo.toGeoJSON();}
    else{data = drawnItems.toGeoJSON();}
  
    // Stringify the GeoJson
    var convertedData = 'text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(data));

    // Create export
    document.getElementById('export').setAttribute('href', 'data:' + convertedData);
    document.getElementById('export').setAttribute('download','data.geojson');
  }
  L.easyButton('fa-download fa-lg', function(){
    document.getElementById('export').click();
  },"Export As Geojson",'topright').addTo(map);

  L.easyButton('fa-refresh fa-lg', function(){
    document.getElementById('delete').click();
  },"Clear Map",'topright').addTo(map);
  
  function iframe(){
    var info = document.getElementById('info');
    if(info.style.display=="block"){
      info.style.display = "none";
    }else{
      info.style.display = "block";
    }
  }

  L.easyButton('fa-info fa-lg', function(){
    iframe();
  },"Info","topleft").addTo(map);

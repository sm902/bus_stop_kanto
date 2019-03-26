function setinit(){
  var map = L.map('mapid').setView([35.7, 139.5], 12);
  return map;
};
var map = setinit();
var geojson;
var basemap_id;
L.tileLayer(
  'http://cyberjapandata.gsi.go.jp/xyz/std/{z}/{x}/{y}.png',
  {
    attribution: "<a href='http://www.gsi.go.jp/kikakuchousei/kikakuchousei40182.html' target='_blank'>国土地理院</a>|<a href='http://nlftp.mlit.go.jp/ksj/jpgis/datalist/KsjTmplt-P11.html'>国土交通省　国土数値情報</a>"
   
  }
).addTo(map);
map.eachLayer(function (layer){
  console.log(layer._leaflet_id);
  basemap_id = layer._leaflet_id;
});
  
function getgeojson(file="bus13.geojson"){
  $.getJSON(file, function (data) {
      if (geojson != undefined){
          map.eachLayer(function (layer) {
            //console.log(layer);
            
            if (layer._leaflet_id != basemap_id){
              map.removeLayer(layer);
            }
            
          });
      }
        
      
      var PointAll = L.markerClusterGroup({
        showCoverageOnHover: false,
        spiderfyOnMaxZoom: true,
        removeOutsideVisibleBounds: true,
        disableClusteringAtZoom: 16
       });
      var pointdata = data;
      geojson = L.geoJson(pointdata, {
        onEachFeature: function (feature, layer) {
          var routes = JSON.parse(feature.properties.routes);
          var field = "<b>" + feature.properties.name + '</b><br>';
          field += 'routes:';
          for(let i in routes) {
            field += '<br>' + routes[i];
          }
          layer.bindPopup(field);
        },
        clickable: true
        }
      );
      PointAll.addLayer(geojson);
      map.addLayer(PointAll);
  });
};

getgeojson();


$(function() {
  data = [];
  $.ajax({
    contentType: "application/x-www-form-urlencoded;charset=euc-kr",
    url:'https://script.google.com/macros/s/AKfycbz3L8IsK35IT2FUNMR8V4KfU2tsNpVWJxwGdOt3Nngz1ANhUac/exec?url=' + encodeURIComponent('http://www.weather.go.kr/weather/observation/currentweather.jsp') + '&callback=?',
    type: "GET",
    dataType: 'json',
    cache: false,
    success: function (response) {
      $('#status').css('color', '#15be00');
      $('#status').text('200 Ready.');
      $('.hideBeforeLoad').css('display', 'inline');
      var str = '', html = new DOMParser().parseFromString(response.result, "text/html").getElementsByTagName('table')[0].getElementsByTagName('tr');
      for(var i = 0; i < html.length; i++) {
        data[i] = Object.values(html[i].getElementsByTagName('td'));
      }
      data.splice(0, 2);
      for(var i = 0; i < data.length; i++) {
        data[i] = [data[i][0].innerText, data[i][5].innerText, data[i][13].innerText];
        str += '<option value=' + data[i][0] + '>' + data[i][0] + '</option>';
      }
      $('#spot').html(str);
      updateSpot();
      updateAlt();
    }
  });
  $('#spot').change(function() {
    updateSpot();
    updateAlt();
  });
  $('input').keyup(function() {
    updateAlt();
  });
  get_location();
});
function updateAlt() {
  var gravityAcceleration = 9.8, coEff1 = 0.0065, coEff2 = 0.12, gasConst = 287.05;
  var seaLvPressure = Number($('#seaLvPressure').text()), currentAirPressure = Number($('#currentAirPressure').val()), temp = Number($('#temp').text()), vaporPoint = Number($('#vaporPoint').val());
  $('#altitude').text((Math.log(seaLvPressure / currentAirPressure) * (temp + 273.15 + vaporPoint * coEff2) / (gravityAcceleration / gasConst - coEff1 / 2 * Math.log(seaLvPressure / currentAirPressure))).toFixed(1));
}
function updateSpot() {
  data.forEach(function(val) {
    if($('#spot').val() == val[0]) {
      $('#temp').text(val[1]);
      $('#seaLvPressure').text(val[2]);
    }
  });
}
function get_location() {
  navigator.geolocation.watchPosition(geo_success, geo_error, geo_options);
}
function geo_success(position) {
  var latitude = position.coords.latitude;
  var longitude = position.coords.longitude;
  var altitudeGPS = position.coords.altitude;
  var accuracy = position.coords.accuracy;
  var geoid = 26;
  $('#latitude').text(latitude.toFixed(7) + '°');
  $('#longitude').text(longitude.toFixed(6) + '°');
  $('#altitudeGPS').text((altitudeGPS ? Number(altitudeGPS - geoid).toFixed(1) + ' m' : 'GPS Not Available'));
  $('#accuracy').text(accuracy.toFixed(1) + ' m');
}
function geo_error(error) {
    switch(error.code) {
        case error.PERMISSION_DENIED:
            $('#altitudeGPS').text("User denied the request for Geolocation.");
            break;
        case error.POSITION_UNAVAILABLE:
            $('#altitudeGPS').text("Location information is unavailable.");
            break;
        case error.TIMEOUT:
            $('#altitudeGPS').text("The request to get user location timed out.");
            break;
        case error.UNKNOWN_ERROR:
            $('#altitudeGPS').text("An unknown error occurred.");
            break;
    }
}
var geo_options = {
  enableHighAccuracy: true,
  maximumAge: 30000,
  timeout: 27000
};

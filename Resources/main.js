$(function() {
  data = [];
  $.ajax({
    contentType: "application/x-www-form-urlencoded;charset=euc-kr",
    url:'https://script.google.com/macros/s/AKfycbz3L8IsK35IT2FUNMR8V4KfU2tsNpVWJxwGdOt3Nngz1ANhUac/exec?url=' + encodeURIComponent('http://www.weather.go.kr/weather/observation/currentweather.jsp') + '&callback=?',
    type: "GET",
    dataType: 'json',
    cache: false,
    success: function (response) {
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
  function updateAlt() {
    var seaLvPressure = Number($('#seaLvPressure').val()), currentAirPressure = Number($('#currentAirPressure').val()), temp = Number($('#temp').val()), vaporPoint = Number($('#vaporPoint').val());
    var gravityAcceleration = 9.806, coEff1 = 0.0065, coEff2 = 0.12, gasConst = 287.05;
    $('#altitude').val((Math.log(seaLvPressure / currentAirPressure) * (temp + 273.15 + vaporPoint * coEff2) / (gravityAcceleration / gasConst - coEff1 / 2 * Math.log(seaLvPressure / currentAirPressure))).toFixed(1));
  }
  function updateSpot() {
    data.forEach(function(val) {
      if($('#spot').val() == val[0]) {
        $('#temp').val(val[1]);
        $('#seaLvPressure').val(val[2]);
      }
    });
  }
});

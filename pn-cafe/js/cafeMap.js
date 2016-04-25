 var map;
    function loadResults (data) {
      var items, markers_data = [];
      if (data.venues.length > 0) {
        items = data.venues;

        for (var i = 0; i < items.length; i++) {
          var item = items[i];

          if (item.location.lat != undefined && item.location.lng != undefined) {
            var icon = 'https://foursquare.com/img/categories/food/default.png';

            markers_data.push({
              lat : item.location.lat,
              lng : item.location.lng,
              city : item.location.city,
              title : item.name,
              count : item.stats.usersCount,
              icon : {
                size : new google.maps.Size(32, 32),
                url : icon
              },
              infoWindow: {
                content: '<p>' + item.name + '</p>'
              }
            });
          }
        }
      }

      map.addMarkers(markers_data);
    }

    function printResults(data) {
      $('#foursquare-results').text(JSON.stringify(data));
    }

    $(document).on('click', '.pan-to-marker', function(e) {
      e.preventDefault();

      var position, lat, lng, $index;

      $index = $(this).data('marker-index');

      position = map.markers[$index].getPosition();

      lat = position.lat();
      lng = position.lng();

      map.setCenter(lat, lng);
    });

    $(document).ready(function(){
      map = new GMaps({
        div: '#googlemap',
        lat: -12.043333,
        lng: -77.028333
      });

      map.on('marker_added', function (marker) {
        var index = map.markers.indexOf(marker);
        var anchor ='<a href="#" class="pan-to-marker" data-marker-index="' + index + '">';
        var thumbnail = '<p class="thumb"><img src="../images/ph_dummy02.jpg" alt=""/></p>'; //jsonで返ってくれば動的にもできます。
        var shopTitle ='<dt class="shopName">'+ marker.title +'</dt>';
        var stars ='<dd class="star"><i class="fa fa-star"></i></dd>'; //動的に星の数を変える作りが悩ましいです。
        var placement = '<dd class="placeList"><span>'+ marker.city +'</span></dd>';
        var users = '<dd class="user"><span>'+ marker.count +'</span>名利用中</dd>';

        $('.resultList').append('<li class="shopName">'+ anchor + thumbnail +'<dl>' + shopTitle + stars + placement + users +'</dl></a></li>');
        if (index == map.markers.length - 1) {
          map.fitZoom();
        }
      });

      var xhr = $.getJSON('https://coffeemaker.herokuapp.com/foursquare.json?q[near]=Lima,%20PE&q[query]=Ceviche');

      xhr.done(printResults);
      xhr.done(loadResults);
    });
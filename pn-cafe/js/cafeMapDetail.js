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
              state : item.location.state,
              city : item.location.city,
              postalCode : item.location.postalCode,
              address : item.location.address,
              title : item.name,
              id : item.id,
              count : item.stats.usersCount,
              icon : {
                size : new google.maps.Size(32, 32),
                url : icon
              },
              click: function(e) {
                var position = $("#" + item.id).offset().top;
                $("html,body").animate({
                  scrollTop : position
                }, {
                  queue : false
                });
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
        var anchor ='<a href="detail.html">'; //jsonで動的に。
        var thumbnail = '<p class="thumb"><img src="../images/ph_dummy02.jpg" alt=""/></p>'; //jsonで返ってくれば動的にもできます。
        var shopTitle ='<h2 class="shopName">'+ marker.title +'</h2>';
        var stars ='<dd class="star"><i class="fa fa-star"></i></dd>'; //動的に星の数を変える作りが悩ましいです。
        var placement = '<p class="placeList"><span>'+ marker.city +'</span></p>';
        var users = '<p class="user"><span>'+ marker.count +'</span>名利用中</p>';
        var address = '<p class="address">〒'+ marker.postalCode + ' '+ marker.state + marker.city + marker.address + '</p>';
        var shopLink = '<p class="link"><a href="#" target="_blank">http://cafe-laboheme.co.jp</a></p>'; //jsonで動的に。
        var contact = '<p class="btn"><a href="contact.html">お問い合わせする</a></p>'; //jsonで動的に。

        $('#shopDetail').append(users + shopTitle + stars + placement + address + shopLink +contact);
        if (index == map.markers.length - 1) {
          map.fitZoom();
        }
      });

      var url   = location.href;
      params    = url.split("=");
      var paramArray = [];
      var queryUrl = "https://coffeemaker.herokuapp.com/foursquare.json?q[near]=JP&q[limit]=1&q[query]=" + params[1];

      var xhr = $.getJSON(queryUrl);

      xhr.done(printResults);
      xhr.done(loadResults);
    });
$(document).ready(function() {
    var btnStart = $('#btnStart');
    var btnStop = $('#btnStop');
    var sound = new Howl({urls: ['media/elevator.mp3']});

    Parse.initialize("lzEHCtBTRGJ8jc08zGwJhxGAt5R0ut0s7Tem5N8f",
                     "MxT903yxgWaPt3cS7MN2Wx7cOGuNYJgVqSsHMcQ7");

    var WayPoint = Parse.Object.extend("WayPoint");
    var deviceId = String(new Fingerprint({canvas: true}).get());
    var watchId;

    var configButtons = function(running) {
        btnStop.prop('disabled', !running);
        btnStart.prop('disabled', running);
    };

    btnStart.click(function() {
        var activityId = String(new Date().getTime());
        var onSuccess = function(position) {
            var wp = new WayPoint();
            var fields = ['accuracy',
                          'altitude',
                          'altitudeAccuracy',
                          'heading',
                          'latitude',
                          'longitude',
                          'speed',
                         ];

            sound.play();
            console.log('watchPosition', position);

            for (var ii in fields) {
                var field = fields[ii];
                var elt = document.getElementById(field);
                var data = position.coords[field];

                elt.textContent = data;
            };
            wp.save(
                {
                    deviceId: deviceId,
                    activityId: activityId,
                    timestamp: position.timestamp,
                    coords: position.coords,
                },
                {
                    error: function(model, error) {
                        console.log('Parse save error', model, error);
                    }
                }
            );
        };
        var onError = function(error) {
            var ep = new WayPoint();
            console.log('watchPosition error', error);
            ep.save({error: error});
        }

        watchId = navigator.geolocation.watchPosition(
            onSuccess, onError, {enableHighAccuracy: true}
        );

        console.log('Running...', watchId);
        configButtons(true);
    });
    btnStop.click(function() {
        navigator.geolocation.clearWatch(watchId);
        watchId = null;

        configButtons(false);
        console.log('...Ending');
    });

    // init
    configButtons(false);
});

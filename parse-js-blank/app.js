$(document).ready(function() {
    var btnStart = $('#btnStart');
    var btnStop = $('#btnStop');

    Parse.initialize("lzEHCtBTRGJ8jc08zGwJhxGAt5R0ut0s7Tem5N8f",
                     "MxT903yxgWaPt3cS7MN2Wx7cOGuNYJgVqSsHMcQ7");

    var WayPoint = Parse.Object.extend("WayPoint");
    var deviceId = '74463';
    var watchId;

    /*
     *
    var testObject = new TestObject();
    testObject.save({foo: "bar"}, {
        success: function(object) {
            $(".success").show();
        },
        error: function(model, error) {
            $(".error").show();
        }
    });
     *
     */

    var configButtons = function(running) {
        btnStop.prop('disabled', !running);
        btnStart.prop('disabled', running);
    };

    btnStart.click(function() {
        var now = new Date();
        var activityId = now.getTime();
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

$(document).ready(function() {
    var logger = $('.status');

    var logError = function() {
        var container = document.createElement('li');
        var line;

        for (var idx in arguments) {
            line = document.createElement('div');
            line.textContent = arguments[idx];

            $(container).append($(line));
        }

        $('.errors').prepend($(container))
    };

    var isNativeApp = function( script, textStatus ) {
        logger.text('Native App');
        document.addEventListener('deviceready', runApp, false);
    };

    var isWebApp = function( jqxhr, settings, exception ) {
        logger.text('Web App');
        runApp();
    };

    function runApp() {
        var alertStart = function() {
            var elt = document.createElement('h2');

            elt.textContent = 'App has started!';
            $('body').append($(elt));
        };
        var media = new Media('/android_asset/www/media/elevator.mp3');
        var alertPing = function() {
            media.play();
        };
        var blinkBackground = function() {
            var body = $('body');
            var color = body.css('background-color');

            body.css('background-color', 'yellow');
            setTimeout(
                function() { body.css('background-color', color) },
                50
            );
        };
        var fields = [
            'accuracy',
            'altitude',
            'altitudeAccuracy',
            'heading',
            'latitude',
            'longitude',
            'speed',
        ];
        var geoSuccess = function(position) {
            alertPing();
            for (var ii in fields) {
                var field = fields[ii];
                var elt = document.getElementById(field);
                var data = position.coords[field];

                elt.textContent = data;
            };
        };
        var geoFailure = function(positionError) {
            logError(positionError);
        };

        alertStart();
        navigator.geolocation.watchPosition(
            geoSuccess, geoFailure, {enableHighAccuracy: true}
        );
    }

    /*
     * use presence of cordova.js to determine whether native or web
     */
    $.getScript('cordova.js').done(isNativeApp).fail(isWebApp);
});

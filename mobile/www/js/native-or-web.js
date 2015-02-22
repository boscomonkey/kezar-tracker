$(document).ready(function() {
    var logger = $('.status');
    var errors = $('.errors');

    function err() {
        var container = document.createElement('li');
        var line;

        for (var idx in arguments) {
            line = document.createElement('div');
            line.textContent = arguments[idx];

            $(container).append($(line));
        }

        errors.prepend($(container))
    }

    $.getScript('cordova.js')
        .done(function( script, textStatus ) {
            logger.text(textStatus);
        })
        .fail(function( jqxhr, settings, exception ) {
            logger.text('NOT FOUND');

            err('jqxhr:', JSON.stringify(jqxhr));
            err('settings:', settings);
            err('exception:', exception);
        });
});

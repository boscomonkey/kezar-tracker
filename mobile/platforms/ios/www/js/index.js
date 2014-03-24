/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
        app.startTimer('timestamp');
        app.startGeo();
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    },
    geoId: null,
    // start monitoring geolocation
    startGeo: function() {
        var latitude = document.getElementById('latitude');
        var longitude = document.getElementById('longitude');
        var altitude = document.getElementById('altitude');
        var speed = document.getElementById('speed');
        var onSuccess = function(suc) {
            latitude.innerHTML = String(suc.coords.latitude);
            longitude.innerHTML = String(suc.coords.longitude);
            altitude.innerHTML = String(suc.coords.altitude);
            speed.innerHTML = String(suc.coords.speed);

            //// console.log(suc);
        };
        var onError = function(err) {
            var error = document.getElementById('error');
            error.innerHTML = 'error: ' + JSON.stringify(err);

            //// console.log(err);
        };
        app.geoId = navigator.geolocation.watchPosition(onSuccess, onError);
    },
    timerId: null,
    timerInterval: 50,
    // start a timer to update ID periodically
    startTimer: function(elementId) {
        var element = document.getElementById(elementId);
        var interval = 1000;
        app.timerId = setInterval(
            function() {
                var dt = new Date();
                var hour = app.util.padLeadingZero(dt.getHours());
                var min = app.util.padLeadingZero(dt.getMinutes());
                var sec = app.util.padLeadingZero(dt.getSeconds());
                var ms = app.util.padLeadingZero(app.util.twoDigitsMilliseconds(dt));
                var str = hour + ':' + min + ':' + sec + '.' + ms;

                element.innerHTML = str;
            },
            app.timerInterval
        );
    },
    util: {
        padLeadingZero: function(num) {
            var str = String(num);

            switch (str.length) {
            case 0:
                return '00';
            case 1:
                return '0' + str;
            default:
                return str;
            }
        },
        twoDigitsMilliseconds: function(dt) {
            var ms = dt.getMilliseconds();
            var digits2 = Math.round(ms / 10);

            return 100 == digits2 ? 0 : digits2;
        },
    }
};

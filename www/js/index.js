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
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
        initJavascript();
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};

$(document).ready( function() {
    var activityArray = [
        {
            "id": 1,
            "description": "this is awesome",
            "PlaceName": "'t Paultje",
            "PlaceAdress": "Lepelstraat x"
        },
        {
            "id": 2,
            "description": "this is even more awesome",
            "PlaceName": "Skybar",
            "PlaceAdress": "Onderwijsboulevard 88"
        }
    ]
    $(".activity-content").on("swipeleft", function() {
        curId = parseInt($(".activity-content").attr("id"));
        for (var i = 0; i < activityArray.length; i++) {
            if (activityArray[i].id === curId + 1) {
                $(".activity-content").hide();
                $(".activity-content").attr("id", activityArray[i].id);
                $("#activity-place-name").text(activityArray[i].PlaceName); 
                $("#activity-place-adress").text(activityArray[i].PlaceAdress);
                $("#activity-description").text(activityArray[i].description);
                $('.activity-content').fadeIn(400);
                return;
            }
        }
    });
    $(".activity-content").on("swiperight", function() {
        curId = $(".activity-content").attr("id");
        for (var i = 0; i < activityArray.length; i++) {
            if (activityArray[i].id === curId - 1) {
                $(".activity-content").hide();
                $(".activity-content").attr("id", activityArray[i].id);
                $("#activity-place-name").text(activityArray[i].PlaceName); 
                $("#activity-place-adress").text(activityArray[i].PlaceAdress);
                $("#activity-description").text(activityArray[i].description);
                $('.activity-content').fadeIn(400);
                return;
            }
        }
    });
});

$(document).ready(function(){
    alert('show');
    $.ajax({
        url:'http://127.0.0.1:8080/race',
        type:'GET',
        success: function(result) {
            alert(result);
        },
        error: function(request, status, error) {
            var err = eval("(" + request.responseText + ")");
            alert(err.Message);
        }
    });
    alert('stop');
});

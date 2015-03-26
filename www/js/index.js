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

function handleLogin(user, pwd) {
    var form = $("#loginForm");
    //disable the button so we can't resubmit while we wait
    $("#submitButton",form).attr("disabled","disabled");
    if(user != '' && pwd!= '') {
        $("#login-loader").show();
        $.post("http://restrace-api.herokuapp.com/login?returnType=json", {email:user,password:pwd}, function(res) {
            if(res !== undefined) {
                //store
                window.localStorage.setItem("username", user);
                window.localStorage.setItem("password",  pwd);
                window.localStorage.setItem("userId", res._id);
                $( ":mobile-pagecontainer" ).pagecontainer( "change", "#index");
            } else {
                alert("Your login failed");
            }
            $('#login-loader').hide();
            $("#submitButton").removeAttr("disabled");
        },"json");
    }
    return false;
}

$(document).ready( function() {

    $('#logout').on("click", function(e) {
        window.localStorage.removeItem("username");
        window.localStorage.removeItem("password");
        window.localStorage.removeItem("userId");
        $(":mobile-pagecontainer" ).pagecontainer( "change", "#loginPage");
    })

    $("#loginForm").on("submit",function(e) {
        //disable the button so we can't resubmit while we wait
        e.preventDefault();
        $("#submitButton",this).attr("disabled","disabled");
        var u = $("#username", this).val();
        var p = $("#password", this).val();
        if(u != '' && p!= '') {
            handleLogin(u, p);
        }
    });

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

$(document).on("pagebeforeshow","#all-races", function(){
    $.ajax({
        url:'http://restrace-api.herokuapp.com/race',
        type:'GET',
        success: function(result) {
            $('#list-races > ul').empty();
            $.each(result, function() {
                html = '<li class="ui-li"><a href="#race-detail"> <img src="icon.png" />';
                html += '<h2 id="title">' + this.name + '</h2>';
                html += '<h3 id="description">' + this.description + '</h3></a></li>';
                $('#list-races > ul').append(html);
            });
            $('#list-races > ul').listview('refresh');
        },
        error: function(request, status, error) {
        }
    });
});

$(document).on("pagebeforeshow", "div[data-role='page']:not(div[id='loginPage'])", function() {
    if(window.localStorage.getItem("username") === null) {
        $(":mobile-pagecontainer" ).pagecontainer( "change", "#loginPage");
    }
});
$(document).on("pagebeforeshow", "#loginPage", function() {
    if(window.localStorage.getItem("username") !== null) {
        $( ":mobile-pagecontainer" ).pagecontainer( "change", "#index");
    }
});
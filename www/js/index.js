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

    $("#add-race-form").on("submit",function(e) {
        //disable the button so we can't resubmit while we wait
        e.preventDefault();
        $("#submitButton",this).attr("disabled","disabled");
        $("#addrace-loader").show();
        $.post("http://restrace-api.herokuapp.com/race", {
            name: $('#racename').val(),
            description: $('#racedescription').val(),
            owner: window.localStorage.getItem("userId"),
            startDateTime: $('#racestarttime').val(),
            endDateTime: $('#raceendtime').val()
        }, function(res) {
            if(res.msg.indexOf("succesfully") >= 0) {
                $( ":mobile-pagecontainer" ).pagecontainer( "change", "#index");
            } else {
                alert("Adding this race failed");
            }
            $('#addrace-loader').hide();
            $("#submitButton").removeAttr("disabled");
        },"json");
        return false;
    });

    $("#edit-race-form").on("submit",function(e) {
        //disable the button so we can't resubmit while we wait
        e.preventDefault();
        var id = $('#editraceid').val();
        var url = "http://restrace-api.herokuapp.com/race/";
        var requestUrl = url.concat(id);
        alert(requestUrl);
        $("#editRaceButton",this).attr("disabled","disabled");
        $("#editrace-loader").show();
        $.put(requestUrl, {
            name: $('#editracename').val(),
            description: $('#editracedescription').val(),
            owner: window.localStorage.getItem("userId"),
            startDateTime: $('#editracestarttime').val(),
            endDateTime: $('#editraceendtime').val()
        }, function(res) {
            if(res.msg.indexOf("succesfully") >= 0) {
                $( ":mobile-pagecontainer" ).pagecontainer("change", "#all-races");
            } else if(res.message == "Validation failed") {
                alert("You cannot edit this race");
            } else {
                alert("Editing this race failed");
            }
            $('#editrace-loader').hide();
            $("#editRaceButton").removeAttr("disabled");
        },"json");
        return false;
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
    $('.join-race').click(function() {
        var race_id = $(this).attr("id");
        var url = "http://restrace-api.herokuapp.com/race/" + race_id + "/user/" + window.localStorage.getItem('userId');
        $("joinrace-loader").show();
        $.ajax({
            type:"POST",
            beforeSend: function (request)
            {
                request.setRequestHeader("Content-Type", "application/json");
            },
            url: url,
            success: function(msg) {
                alert("You've joined the race, good luck!");
                $( ":mobile-pagecontainer" ).pagecontainer( "change", "#index");
                $("joinrace-loader").hide();
            },
            error: function(res) {
                alert("something went wrong");
                $("joinrace-loader").hide();
            }
        });
        return false;
    });
    $('.edit-race').click(function() {
        $(":mobile-pagecontainer" ).pagecontainer( "change", "#edit-race");
    });

});

$(document).on("pagebeforeshow","#all-races", function(){
    $.ajax({
        url:'http://restrace-api.herokuapp.com/race',
        type:'GET',
        success: function(result) {
            $('#list-races > ul').empty();
            $.each(result, function() {
                var link = "#race-detail";
                html = '<li class="race-list-item ui-li" id="' + this._id + '"><a href="#race-detail"> <img src="icon.png" />';
                html += '<h2 class="title">' + this.name + '</h2>';
                html += '<h3 class="description">' + this.description + '</h3></a></li>';
                $('#list-races > ul').append(html);
            });
            $('#list-races > ul').listview('refresh');
            $('.race-list-item').click(function() {
                $(".edit-race").hide();
                $(".join-race").hide();
                $(".leave-race").hide();
                var id = $(this).attr("id");
                var selector = "li[id=" + id + "] > a > .title";
                var title = $(selector).text();
                var selector = "li[id=" + id + "] > a > .description";
                var description = $(selector).text();
                $('#race-id').html(id);
                $("#race-title").html(title);
                $("#race-description").html(description);
                $( ":mobile-pagecontainer" ).pagecontainer( "change", "#race-detail");
                return false;
            });
        },
        error: function(request, status, error) {
        }
    });
    return false;
});

$(document).on("pagebeforeshow", "div[data-role='page']:not(div[id='loginPage'])", function() {
    if(window.localStorage.getItem("username") === null) {
        $(":mobile-pagecontainer" ).pagecontainer( "change", "#loginPage");
    } else {
        return false;
    }
});
$(document).on("pagebeforeshow", "#loginPage", function() {
    if(window.localStorage.getItem("username") !== null) {
        $( ":mobile-pagecontainer" ).pagecontainer( "change", "#index");
    } else {
        return false;
    }
});
$(document).on("pagebeforeshow", "#race-detail", function() {
    var id = $('#race-id').text();
    var url = "http://restrace-api.herokuapp.com/race/";
    var requestUrl = url.concat(id);
    console.log("url: " + requestUrl);
    $.get(requestUrl, function(res) {
        if (res.owner == window.localStorage.getItem("userId")) {
            $(".edit-race").show();
            $(".edit-race").attr("id", id);
        } else if($.inArray(window.localStorage.getItem("userId"), res.users) >= 0) {
            $(".leave-race").show();
            $(".leave-race").attr("id", id);
        } else {
            $(".join-race").show();
            $(".join-race").attr("id", id);
        }
        window.localStorage.setItem("currentRace", JSON.stringify(res));
        console.log(window.localStorage.getItem("currentRace"));
    });
    return false;
});
$(document).on("pagebeforeshow", '#edit-race', function() {
    var race = JSON.parse(window.localStorage.getItem("currentRace"));
    console.log(race);
    $("#editraceid").val(race._id);
    $("#editracename").val(race.name);
    $("#editracedescription").val(race.description);
    $("#editracestarttime").val(race.startDateTime);
    $("#editraceendtime").val(race.endDateTime);
});
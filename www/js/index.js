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
// var app = {
//     // Application Constructor
//     initialize: function() {
//         this.bindEvents();
//     },
//     // Bind Event Listeners
//     //
//     // Bind any events that are required on startup. Common events are:
//     // 'load', 'deviceready', 'offline', and 'online'.
//     bindEvents: function() {
//         document.addEventListener('deviceready', this.onDeviceReady, false);
//     },
//     // deviceready Event Handler
//     //
//     // The scope of 'this' is the event. In order to call the 'receivedEvent'
//     // function, we must explicitly call 'app.receivedEvent(...);'
//     onDeviceReady: function() {
//         app.receivedEvent('deviceready');
//     },
//     // Update DOM on a Received Event
//     receivedEvent: function(id) {
//         var parentElement = document.getElementById(id);
//         var listeningElement = parentElement.querySelector('.listening');
//         var receivedElement = parentElement.querySelector('.received');

//         listeningElement.setAttribute('style', 'display:none;');
//         receivedElement.setAttribute('style', 'display:block;');

//         console.log('Received Event: ' + id);
//     }
// };

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
        $("#editRaceButton",this).attr("disabled","disabled");
        $("#editrace-loader").show();
        $.ajax({
            url: requestUrl,
            type:'PUT',
            data: {
                name: $('#editracename').val(),
                description: $('#editracedescription').val(),
                owner: window.localStorage.getItem("userId"),
                startDateTime: $('#editracestarttime').val(),
                endDateTime: $('#editraceendtime').val()
            },
            success: function(res) {
                console.log(res);
                if(res.indexOf("succesfully") >= 0) {
                    $( ":mobile-pagecontainer" ).pagecontainer("change", "#all-races");
                } else if(res.message == "Validation failed") {
                    alert("You cannot edit this race");
                } else {
                    alert("Editing this race failed");
                }
                $('#editrace-loader').hide();
                $("#editRaceButton").removeAttr("disabled");
            },
            error: function(request, status, error) {
            }
        });
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
        return false;
    });
    $('.delete-race').click(function() {
        var id = $('#delete-race-id').html();
        alert(id);
        var url = "http://restrace-api.herokuapp.com/race/";
        var requestUrl = url.concat(id);
        alert(requestUrl);
        $.ajax({
            url: requestUrl,
            type:'DELETE',
            success: function(res) {
                console.log(res);
                if(res.msg.indexOf("succesfully") >= 0) {
                    $( ":mobile-pagecontainer" ).pagecontainer("change", "#all-races");
                } else if(res.message == "Validation failed") {
                    alert("You cannot delete this race");
                } else {
                    alert("Deleting this race failed");
                }
                $("#editRaceButton").removeAttr("disabled");
            },
            error: function(request, status, error) {
            }
        });
    });
    
    $('.add-place-to-race').click(function (event) {
        alert('clicked');
        var activityAdd = postActivityRequest($(this).attr("id"));
        if (activityAdd !== false) {
            var url = "http://restrace-api.herokuapp.com/race/" + JSON.parse(window.localStorage.getItem("currentRace"))._id + '/activity/' + activityAdd;
            console.log("add url: " + url);
            $.post(url, {}, function() {
                $( ":mobile-pagecontainer" ).pagecontainer("change", "#add-activity");
            }, 'json');
        } else {
            alert("Something went wrong");
            $( ":mobile-pagecontainer" ).pagecontainer("change", "#add-activity");
        }
        
        return false;
    });

    $("#show-more-activities").click(function() {
        var url = $(this).attr("id");
        $.ajax({
            url: url,
            type:'GET',
            dataType: 'json',
            success: function(result) {
                $.each(result.results, function() {
                    html = '<li class="activity-list-item ui-li" id="' + this.id + '"><a>';
                    html += '<h2 class="title">' + this.name + '</h2>';
                    html += '<h3 class="description">' + this.vicinity + '</h3></a></li>';
                    $('#near-activities > ul').append(html);
                });
                $('#near-activities > ul').listview('refresh');
                if (result.hasOwnProperty(next_page_token)) {
                    nextUrl = url + "&pagetoken=" + result.next_page_token;
                    $("#show-more-activities").attr("id", nextUrl);
                } else {
                    $("#show-more-activities").hide();
                }
                $(".activity-list-item").click(function(event) {
                    buildDetailPage($(e.target).closest(".activity-list-item"));
                    $(":mobile-pagecontainer" ).pagecontainer( "change", "#place-detail");
                });
            }
        });
        return false;
    });
});

$(document).on("pagebeforeshow","#all-races", function(){
    $.ajax({
        url:'http://restrace-api.herokuapp.com/race',
        type:'GET',
        dataType: 'json',
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
            $(".delete-race").show();
            $("#delete-race-id").html(id);
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
    var userUrl = "http://restrace-api.herokuapp.com/race/" + id + "/users";
    $.get(userUrl, function (res) {
        console.log(res);
        $("#race-users").empty();
        $.each(res, function() {
            var html = '<li class="activity-list-item ui-li">' + this.local.email + '</li>';
            $('#race-users').append(html);
        });
        $("#race-users").listview('refresh');
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
    return false;
});

$(document).on("pagebeforeshow", "#add-activity", function() {
    alert("pagebeforeshow");
    navigator.geolocation.getCurrentPosition(
        function(position) {
            $("#activity-loader").show();
            alert(position.coords.latitude + ',' + position.coords.longitude);
            var reqUrl = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?key=AIzaSyAUxO0NYgx05X4imuydcq4iKr2kGtWjIZI&location=";
            reqUrl += position.coords.latitude + ',' + position.coords.longitude;
            reqUrl += "&radius=7500&type=cafe";
            alert(reqUrl);
            $.ajax({
                url: reqUrl,
                type:'GET',
                dataType: 'json',
                success: function(result) {
                    $('#near-activities > ul').empty();
                    $.each(result.results, function() {
                        var html = '<li class="activity-list-item ui-li" id="' + this.place_id + '"><a>';
                        html += '<h2 class="title">' + this.name + '</h2>';
                        html += '<h3 class="description">' + this.vicinity + '</h3></a></li>';
                        $('#near-activities > ul').append(html);
                    });
                    $('#near-activities > ul').listview('refresh');

                    $(".activity-list-item").click(function(e) {
                        buildDetailPage($(e.target).closest('.activity-list-item'));
                        $(":mobile-pagecontainer" ).pagecontainer( "change", "#place-detail");
                    });
                    if (result.hasOwnProperty("next_page_token")) {
                        var nextUrl = reqUrl + "&pagetoken=" + result.next_page_token;
                        $("#show-more-activities").show();
                        $("#show-more-activities").attr("id", nextUrl);
                    } else {
                        $("#show-more-activities").hide();
                    }
                },
                error: function(request, status, error) {
                }
            });
    
            return false;
        },
        function() {
            alert('Error getting location');
        }
    );
    $('#activity-loader').hide();
    return false;
});
function buildDetailPage(item) {
    var reqUrl = "https://maps.googleapis.com/maps/api/place/details/json?placeid=" + item.attr("id") + "&key=AIzaSyAUxO0NYgx05X4imuydcq4iKr2kGtWjIZI";
    $.ajax({
        url: reqUrl,
        type:'GET',
        dataType: 'json',
        success: function(result) {
            var jsonData = result.result;
            $('#place-name').text(jsonData['name']);
            $('#place-address').text(jsonData.vicinity);
            var number = jsonData.international_phone_number.replace(/ /g, "");
            var phoneHtml = '<a href=tel:"' + number + '"> ' + number + " </a>"
            $('#place-phone').html(phoneHtml);
            $('#place-rating').text(jsonData.rating);
            $('#place-website').html("<a href='" + jsonData.website + "'> Visit website </a>");
            $('.add-place-to-race').attr("id", item.attr("id"));
        },
        error: function(request, status, error) {
            alert(error);
        }
    });
}

$('#place-website').click(function(event) {
    event.preventDefault();
    var url = event.target.closest('#place-website').attr("href");
    window.open(url, '_system');
});

function postActivityRequest(place_id) {
    alert("gonna post");
    var reqData = JSON.stringify({
            google_id: place_id,
            description: $("#add-activity-description").val()
        });
    console.log(reqData);
    $.ajax({
        type:"POST",
        url: "http://restrace-api.herokuapp.com/activity",
        data: reqData,
        contentType: "application/json; charset=utf-8",
        dataType: 'json',
        beforeSend: function (request)
        {
            request.setRequestHeader("Content-Type", "application/json");
        },
        success: function(response) {
            if(response.message !== undefined && response.message === 'Validation failed') {
                alert('in error');
                var reqUrl = "https://maps.googleapis.com/maps/api/place/details/json?placeid=" + place_id + "&key=AIzaSyAUxO0NYgx05X4imuydcq4iKr2kGtWjIZI";
                var place;
                $.get(reqUrl, function(placeResponse) {
                    alert('found place');
                    place = {
                        google_id: place_id,
                        name: placeResponse.result.name,
                        address: placeResponse.result.vicinity,
                        location : {
                            lat: placeResponse.result.geometry.location.lat,
                            lng: placeResponse.result.geometry.location.lng
                        }
                    }
                    $.ajax({
                        type:"POST",
                        url: "http://restrace-api.herokuapp.com/place",
                        data: JSON.stringify(place),
                        contentType: "application/json; charset=utf-8",
                        dataType: 'json',                        
                        beforeSend: function (request)
                        {
                            request.setRequestHeader("Content-Type", "application/json");
                        },
                        
                        success: function(response) {
                            alert("created place, retrying");
                            postActivityRequest(place_id);
                        },
                        error: function(res) {
                            alert("something went wrong");
                        }
                    });
                });
            } else {
                alert("place gevonden");
                //Vind het ID in de string die in de response.msg staat.
                var responseString = response.msg;
                var splitString = responseString.split("id");
                var activity_id = splitString[1].slice(0, splitString[1].indexOf(" "));
                var url = "http://restrace-api.herokuapp.com/race/" + JSON.parse(window.localStorage.getItem("currentRace"))._id + '/activity/' + activity_id;
                console.log("add url: " + url);
                $.post(url, {}, function() {
                    $( ":mobile-pagecontainer" ).pagecontainer("change", "#add-activity");
                }, 'json');
            }
        },
        error: function(request, status, error) {
            alert("something went wrong");
            console.log(error);
            return false;
        },
        complete: function (jqXHR, textStatus) {
            alert('executed request');
        }
    });
}

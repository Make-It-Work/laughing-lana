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

    document.addEventListener("backbutton", onBackKeyDown, false);

    function onBackKeyDown() {
        var activePage = $(':mobile-pagecontainer').pagecontainer( 'getActivePage' ).attr( 'id' );
        if(activePage == "index") {
            navigator.app.exitApp();
        }
    }

    $('.logout').on("click", function(e) {
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
            data: JSON.stringify({
                name: $('#editracename').val(),
                description: $('#editracedescription').val(),
                owner: window.localStorage.getItem("userId"),
                startDateTime: $('#editracestarttime').val(),
                endDateTime: $('#editraceendtime').val()
            }),
            dataType: 'json',
            contentType: 'application/json',
            success: function(res) {
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

    $(".activity-content").on("swipeleft", function() {
        curId = parseInt($(".activity-content").attr("id"));
        // for (var i = 0; i < activityArray.length; i++) {
            var activityArray = JSON.parse(window.localStorage.getItem("currentRaceActivities"));
            console.log(activityArray);
            if (activityArray[curId+1] !== undefined) {
                $(".activity-content").hide();
                $(".activity-content").attr("id", curId +1);
                $("#activity-place-name").text(activityArray[curId +1].PlaceName); 
                $("#activity-place-adress").text(activityArray[curId+1].PlaceAdress);
                $("#activity-description").text(activityArray[curId +1].description);
                $(".tag").attr("id", activityArray[curId + 1].activity_id);
                $('.activity-content').fadeIn(400);
                return;
            }
        // }
    });
    $(".activity-content").on("swiperight", function() {
        curId = parseInt($(".activity-content").attr("id"));
        // for (var i = 0; i < activityArray.length; i++) {
            var activityArray = JSON.parse(window.localStorage.getItem("currentRaceActivities"));
            if (activityArray[curId-1]!== undefined) {
                $(".activity-content").hide();
                $(".activity-content").attr("id", curId -1);
                $("#activity-place-name").text(activityArray[curId -1].PlaceName); 
                $("#activity-place-adress").text(activityArray[curId-1].PlaceAdress);
                $("#activity-description").text(activityArray[curId -1].description);
                $(".tag").attr("id", activityArray[curId - 1].activity_id);
                $('.activity-content').fadeIn(400);
                return;
            }
        // }
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
    $('.leave-race').click(function() {
        var race_id = $(this).attr("id");
        var user_id = window.localStorage.getItem("userId");
        $.ajax({
            url: "http://restrace-api.herokuapp.com/race/" + race_id + "/user/" + user_id,
            type: "DELETE",
            dataType: "json",
            success: function() {
                alert("You left the race");
            }
        });
        $(":mobile-pagecontainer" ).pagecontainer( "change", "#all-races");
    });
    $('.delete-race').click(function() {
        var id = $('#delete-race-id').html();
        var url = "http://restrace-api.herokuapp.com/race/";
        var requestUrl = url.concat(id);
        $.ajax({
            url: requestUrl,
            type:'DELETE',
            success: function(res) {
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
    
    $('.tag').click(function(event) {
        var activityId = $(event.target).closest('.tag').attr("id");
        var reqUrl = "http://restrace-api.herokuapp.com/activity/" + activityId + "/tag";
        $.ajax({
            type:"POST",
            url: reqUrl,
            data: JSON.stringify({user_id: window.localStorage.getItem("userId")}),
            contentType: "application/json; charset=utf-8",
            dataType: 'json',                        
            beforeSend: function (request)
            {
                request.setRequestHeader("Content-Type", "application/json");
            },
            complete: function(jqXHR, textStatus) {
                if(jqXHR.status === 200) {
                    alert("Your tag was saved");
                }
                $(":mobile-pagecontainer" ).pagecontainer( "change", "#all-races");
            }
        });
    })

    $('.add-place-to-race').click(function (event) {
        var activityAdd = postActivityRequest($(this).attr("id"));
        if (activityAdd !== false) {
            var url = "http://restrace-api.herokuapp.com/race/" + JSON.parse(window.localStorage.getItem("currentRace"))._id + '/activity/' + activityAdd;
            $.post(url, {}, function() {
                fillLocalRaceStorage(JSON.parse(window.localStorage.getItem("currentRace"))._id);
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
                    fillDetailPageLocalStorage($(e.target).closest(".activity-list-item").attr("id"));
                    $(":mobile-pagecontainer" ).pagecontainer( "change", "#place-detail");
                });
            }
        });
        return false;
    });
});

$(document).on("pagebeforeshow","#all-races", function(){
    window.localStorage.removeItem("currentRace");
    window.localStorage.removeItem("currentRaceUsers");
    window.localStorage.removeItem("currentRaceActivities");
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
            $('.race-list-item').click(function(event) {
                fillLocalRaceStorage($(event.target).closest('.race-list-item').attr("id"));
                
                return false;
            });
        },
        error: function(request, status, error) {
        }
    });
    return false;
});

function fillLocalRaceStorage(race_id) {
    var url = "http://restrace-api.herokuapp.com/race/";
    var requestUrl = url.concat(race_id);
    $.get(requestUrl, function(res) {
        window.localStorage.setItem("currentRace", JSON.stringify(res));
        $(window).trigger("recievedRace");
    });
    $(window).on("recievedRace", function() {
        var userUrl = "http://restrace-api.herokuapp.com/race/" + race_id + "/users";
        $.get(userUrl, function (res) {
            window.localStorage.setItem("currentRaceUsers", JSON.stringify(res));
            $(window).trigger("recievedRaceUsers");
        });
    });
    $(window).on("recievedRaceUsers" , function() {
        var activityUrl = "http://restrace-api.herokuapp.com/race/" + race_id + "/activities";
        $.ajax({
            url: activityUrl,
            type: "GET",
            dataType: "json",
            success: function (res) {
                var activities = [];
                $.each(res, function() {
                    var currentActivity = this;
                    var newUrl = "http://restrace-api.herokuapp.com/activity/" + currentActivity._id;
                    $.ajax({ 
                        url: newUrl,
                        type: "GET",
                        dataType: "json", 
                        success: function (response) {
                            currentActivity.activity_id = response[0]._id;
                            currentActivity.PlaceName = response[1].result.name;
                            currentActivity.PlaceAdress = response[1].result.vicinity;
                            activities.push(currentActivity);
                        },
                        async: false
                    });
                });
                window.localStorage.setItem("currentRaceActivities", JSON.stringify(activities));
                $(window).trigger("raceDetailInitialized");
            }
        });
    });
    
    $( ":mobile-pagecontainer" ).pagecontainer( "change", "#race-detail");
}

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
    $(window).on("raceDetailInitialized",function(){
        $(".edit-race").hide();
        $(".join-race").hide();
        $(".leave-race").hide();
        $('.delete-race').hide();
        var currentRace = JSON.parse(window.localStorage.getItem("currentRace"));
        var race_id = currentRace._id;
        var users = JSON.parse(window.localStorage.getItem("currentRaceUsers"));
        var joinedRace = false;
        $.each(users, function() {
            if(this._id == window.localStorage.getItem("userId")) {
                joinedRace = true;
                return false;
            }
        });
        console.log("users: " + users);
        if (currentRace.owner == window.localStorage.getItem("userId")) {
            $(".edit-race").show();
            $(".edit-race").attr("id", race_id);
            $(".delete-race").show();
            $("#delete-race-id").html(race_id);
        } else if(joinedRace) {
            $(".leave-race").show();
            $(".leave-race").attr("id", race_id);
            raceStart = new Date(currentRace.startDateTime);
            raceEnd = new Date(currentRace.endDateTime);
            curDate = new Date();
            if (curDate >= raceStart && curDate < raceEnd) {
                $('.tag').show();
                $('.tag').attr('id', race_id);
            }
        } else {
            $(".join-race").show();
            $(".join-race").attr("id", race_id);
        }
        
        $('#race-id').html(race_id);
        $("#race-title").html(currentRace.name);
        $("#race-description").html(currentRace.description);
        //User part of view
        $("#race-users").empty();
        $.each(users, function() {
            var html = '<li class=" ui-li">' + this.local.email + '</li>';
            $('#race-users').append(html);
        });
        $("#race-users").listview('refresh');

        $(".activity-content").attr("id", 0);
    
        var activityArray = JSON.parse(window.localStorage.getItem("currentRaceActivities"));
        if (activityArray.length > 0) {
            $("#activity-place-name").text(activityArray[0].PlaceName); 
            $("#activity-place-adress").text(activityArray[0].PlaceAdress);
            $("#activity-description").text(activityArray[0].description);
            $(".tag").attr('id', activityArray[0].activity_id);
        }
    });
});
$(document).on("pagebeforeshow", '#edit-race', function() {
    var race = JSON.parse(window.localStorage.getItem("currentRace"));
    $("#editraceid").val(race._id);
    $("#editracename").val(race.name);
    $("#editracedescription").val(race.description);
    $("#editracestarttime").val(race.startDateTime);
    $("#editraceendtime").val(race.endDateTime);
    return false;
});

$(document).on("pagebeforeshow", "#add-activity", function() {
    alert('finding location');
    navigator.geolocation.getCurrentPosition(
        function(position) {
            alert("got position");
            $("#activity-loader").show();
            var reqUrl = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?key=AIzaSyAB3wNP3s9QgUApH-OTx4BZw01xLgeqmcE&location=";
            reqUrl += position.coords.latitude + ',' + position.coords.longitude;
            reqUrl += "&radius=7500&type=cafe";
            $.ajax({
                url: reqUrl,
                type:'GET',
                dataType: 'json',
                success: function(result) {
                    alert
                    $('#near-activities > ul').empty();
                    $.each(result.results, function() {
                        var html = '<li class="activity-list-item ui-li" id="' + this.place_id + '"><a>';
                        html += '<h2 class="title">' + this.name + '</h2>';
                        html += '<h3 class="description">' + this.vicinity + '</h3></a></li>';
                        $('#near-activities > ul').append(html);
                    });
                    $('#near-activities > ul').listview('refresh');

                    $(".activity-list-item").click(function(e) {
                        fillDetailPageLocalStorage($(e.target).closest(".activity-list-item").attr("id"));
                    });
                },
                error: function(request, status, error) {
                    console.log(status + " " + error);
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
function buildDetailPage() {
    var place = JSON.parse(window.localStorage.getItem("currentPlace"));
    $('#place-name').text(place.name);
    $('#place-address').text(place.vicinity);
    var number = place.international_phone_number.replace(/ /g, "");
    var phoneHtml = '<a href=tel:"' + number + '"> ' + number + " </a>"
    $('#place-phone').html(phoneHtml);
    $('#place-rating').text(place.rating);
    $('#place-website').html("<a href='" + place.website + "'> Visit website </a>");
    $('.add-place-to-race').attr("id", place.place_id);  
    $(":mobile-pagecontainer" ).pagecontainer( "change", "#place-detail"); 
}

function fillDetailPageLocalStorage(place_id) {
    var reqUrl = "https://maps.googleapis.com/maps/api/place/details/json?placeid=" + place_id + "&key=AIzaSyAB3wNP3s9QgUApH-OTx4BZw01xLgeqmcE";
    $.ajax({
        url: reqUrl,
        type:'GET',
        dataType: 'json',
        success: function(result) {
            var jsonData = result.result;
            window.localStorage.setItem("currentPlace", JSON.stringify(jsonData));
            buildDetailPage();
        },
        error: function(request, status, error) {
            alert(error);
        }
    });
}

$(document).on("pagebeforeshow", "#place-detail", function() {
    buildDetailPage();
});

$('#place-website').click(function(event) {
    event.preventDefault();
    var url = event.target.closest('#place-website').attr("href");
    window.open(url, '_system');
});

function postActivityRequest(place_id) {
    var reqData = JSON.stringify({
        "google_id": place_id,
        "description": $("#add-activity-description").val()
    });
    console.log(reqData);
    $.ajax({
        type:"POST",
        url: "http://restrace-api.herokuapp.com/activity",
        data: reqData,
        contentType: "application/json",
        dataType: 'json',
        success: function(response) {
                //Vind het ID in de string die in de response.msg staat.
            var responseString = response.msg;
            var splitString = responseString.split("id");
            var activity_id = splitString[1].slice(0, splitString[1].indexOf(" "));
            var url = "http://restrace-api.herokuapp.com/race/" + JSON.parse(window.localStorage.getItem("currentRace"))._id + '/activity/' + activity_id;
            alert(url);
            $.post(url, {}, function(res) {
                if (res.message === "Validation failed") {
                    alert("Kan geen activity toevoegen als de race al begonnen is.");
                } else {
                    var activities = JSON.parse(window.localStorage.getItem("currentRaceActivities"));
                    console.log(activities);
                }

            }, 'json');
        },
        error: function(request, status, error) {
            if(request.responseText === 'There is something wrong with the paramsValidationError: Invalid place id') {
                var reqUrl = "https://maps.googleapis.com/maps/api/place/details/json?placeid=" + place_id + "&key=AIzaSyAB3wNP3s9QgUApH-OTx4BZw01xLgeqmcE";
                var place;
                $.get(reqUrl, function(placeResponse) {
                    place = {
                        google_id: place_id,
                        name: placeResponse.result.name,
                        address: placeResponse.result.vicinity,
                        location : {
                            lat: placeResponse.result.geometry.location.lat,
                            lng: placeResponse.result.geometry.location.lng
                        }
                    };
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
                            postActivityRequest(place_id);
                        },
                        error: function(res) {
                            alert("something went wrong");
                        }
                    });
                });
            } 
            return false;
        }
    });
}

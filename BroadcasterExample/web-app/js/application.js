$(function () {
    "use strict";


    var header = $('#header');
    var content = $('#content');
    var piecontent = $('#piecontent');
    var input = $('#input');
    var status = $('#status');
    var myName = false;
    var author = null;
    var logged = false;
    var socket = $.atmosphere;
    var subSocket;
    var pieSocket;
    var transport = 'websocket';
    var chatUrl = 'http://'+document.location.hostname+':'+document.location.port+'/BroadcasterExample/atmosphere/chat';

    // We are now ready to cut the request
    var request = { url: chatUrl + "/all",
        contentType : "application/json",
        logLevel : 'debug',
        shared : 'true',
        transport : transport ,
        fallbackTransport: 'long-polling'};

    var pierequest = { url : chatUrl +"/pie",
        contentType : "application/json",
        logLevel : "debug",
        shared : "true",
        transport : transport,
        fallbackTransport: "long-polling"
    };

    socket.info(pierequest)


    request.onOpen = function(response) {
        content.html($('<p>', { text: 'Atmosphere connected using ' + response.transport }));
        input.removeAttr('disabled').focus();
        status.text('Choose name:');
        transport = response.transport;

        if (response.transport == "local") {
            subSocket.pushLocal("Name?");
        }
    };

    pierequest.onOpen = function(response){
        socket.info("PieRequest Opened");
        socket.info(response);
    }

    <!-- You can share messages between window/tabs.   -->
    request.onLocalMessage = function(message) {
        if (transport != 'local') {
            header.append($('<h4>', { text: 'A new tab/window has been opened'}).css('color', 'green'));
            if (myName) {
                subSocket.pushLocal(myName);
            }
        } else {
            if (!myName) {
                myName = message;
                logged = true;
                status.text(message + ': ').css('color', 'blue');
                input.removeAttr('disabled').focus();
            }
        }
    };

    pierequest.onLocalMessage = function(message){
        socket.info("PieRequest onLocalMessage")
        socket.info(message)
    }

    <!-- For demonstration of how you can customize the fallbackTransport using the onTransportFailure function -->
    request.onTransportFailure = function(errorMsg, request) {
        jQuery.atmosphere.info(errorMsg);
        if (window.EventSource) {
            request.fallbackTransport = "sse";
            transport = "see";
        }
        header.html($('<h3>', { text: 'Atmosphere Chat. Default transport is WebSocket, fallback is ' + request.fallbackTransport }));
    };

    pierequest.onTransportFailure = function(errorMsg, request){
        socket.info("PieRequest Transport Failure")
    }

    request.onReconnect = function (request, response) {
        socket.info("Reconnecting")
    };

    request.onMessage = function (response) {

        // We need to be logged first.
        if (!myName) return;

        var message = response.responseBody;
        //socket.info('response is ')
        //socket.info(response)
        //socket.info('message is ' + message)
        try {
            var json = jQuery.parseJSON(message);
        } catch (e) {
            //socket.info('This doesn\'t look like a valid JSON: ', message);
            return;
        }

        if (!logged) {
            logged = true;
            status.text(myName + ': ').css('color', 'blue');
            input.removeAttr('disabled').focus();
            subSocket.pushLocal(myName);
        } else {
            input.removeAttr('disabled');

            var me = json.author == author;
            var date = typeof(json.time) == 'string' ? parseInt(json.time) : json.time;
            addMessage(content, json.author, json.text, me ? 'blue' : 'black', new Date(date));
        }
    };

    pierequest.onMessage = function( response ){
        socket.info( "Pie Request Message: ");
        socket.info( response );
        var json = jQuery.parseJSON(response.responseBody);
        var date = typeof(json.time) == 'string' ? parseInt(json.time) : json.time;
        addMessage(piecontent, json.author, json.text, 'red', new Date(date));
    }

    request.onClose = function(response) {
        logged = false;
    }

    request.onError = function(response) {
        content.html($('<p>', { text: 'Sorry, but there\'s some problem with your '
            + 'socket or the server is down' }));
    };

    subSocket = socket.subscribe(request);
    pieSocket = socket.subscribe(pierequest)

    input.keydown(function(e) {
        if (e.keyCode === 13) {
            var msg = $(this).val();

            // First message is always the author's name
            if (author == null) {
                author = msg;
            }
            var json = jQuery.stringifyJSON({ author: author, message: msg });
            subSocket.push(json);

            $(this).val('');

            //input.attr('disabled', 'disabled');
            if (myName === false) {
                myName = msg;
            }
        }
    });

    function addMessage(target, author, message, color, datetime) {
        target.append('<p><span style="color:' + color + '">' + author + '</span> @ ' +
            + (datetime.getHours() < 10 ? '0' + datetime.getHours() : datetime.getHours()) + ':'
            + (datetime.getMinutes() < 10 ? '0' + datetime.getMinutes() : datetime.getMinutes())
            + ': ' + message + '</p>');
    }
});



<%@ page contentType="text/html;charset=UTF-8" %>
<html>
<head>
  <meta name="layout" content="main">
  <title>Filter Example</title>

    <style type="text/css">
        #header, #content{ padding: 10px 0px 10px 0px;}
        #pieholder{ padding-top: 20px;}
    </style>
</head>
<body>
<g:javascript src="jquery.atmosphere.js"/>

<div id="header"><h3>Atmosphere Chat. Default transport is WebSocket, fallback is long-polling</h3></div>
<div id="content"></div>
<div>
    <span id="status">Connecting...</span>
    <input type="text" id="input"/>
</div>

<div id="pieholder">
    <p id="piestarter">If any messages are received with the string "pie", they'll show up below. Go ahead, type 'I love pie' above and send the message</p>

    <div id="piecontent"></div>
</div>

</body>
</html>
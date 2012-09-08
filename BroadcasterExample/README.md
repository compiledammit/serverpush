This example is based on the [Chat sample](../master/GrailsChat),
which is itself based the [Atmosphere](https://github.com/Atmosphere/atmosphere/) [chat sample](https://github.com/Atmosphere/atmosphere/wiki/Getting-Started-with-the-samples),
but within a Grails application.

Read the Chat Sample README for information, configuration, instructions, and so forth.

To learn more about Broadcasters, [read the docs](https://github.com/Atmosphere/atmosphere/wiki/Understanding-Broadcaster).

# What's in here?

This example extends the chat and adds a second websocket that listens for messages with the string "pie".
The point is to demonstrate how to target messages on the server by

* Registering a different broadcaster with an AtmosphereResource
* Publishing messages to different broadcasters.

In this case, I'm publishing to a "/pie" broadcaster if the incoming message contains the string "pie". However,
you could certainly choose a broadcaster based on anything available in the AtmosphereResource, the incoming message, etc. 


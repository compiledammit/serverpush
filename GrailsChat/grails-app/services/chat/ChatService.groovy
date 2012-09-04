package chat

import org.atmosphere.cpr.*
import org.atmosphere.cpr.AtmosphereResource.TRANSPORT
import grails.converters.JSON

class ChatService {

    static transactional = false
    static atmosphere = [mapping: '/atmosphere/chatty']

    def onRequest = { event ->
        println "Inside onRequest!"
        try {
            AtmosphereRequest req = event.request
            if (req.method.equalsIgnoreCase("GET")) {
                println 'Suspending'
                event.suspend()
            } else if (req.method.equalsIgnoreCase("POST")) {
                event.broadcaster.broadcast(req.reader.readLine().trim())
            }
        } catch (Exception e) {
            println "ERROR!!!!!"
        }

    }

    def onStateChange = { event ->
        println "Inside onStateChange!"
        //println "Event is $event"
        AtmosphereResource r = event.resource
        AtmosphereResponse res = r.response

        try {
            if (event.isSuspended()) {
                def msg = JSON.parse(event.message)
                res.writer.write( createMessage(msg.author, msg.message) )

                switch (r.transport()) {
                    case TRANSPORT.JSONP:
                    case TRANSPORT.LONG_POLLING:
                        event.resource.resume()
                        break
                    default:
                        res.writer.flush()
                }
            } else if (!event.isResuming()) {
                event.broadcaster().broadcast( createMessage('someone', 'buh bye') )
            }
        } catch (Exception e) {
            println "ERROR in onStateChange: $e"
        }
    }

    private String createMessage(String author, String text) {
        return new JSON( [text : text, author : author, time : new Date().time] )
    }
}

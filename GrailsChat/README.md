This demonstrates the [Atmosphere](https://github.com/Atmosphere/atmosphere/) [chat sample](https://github.com/Atmosphere/atmosphere/wiki/Getting-Started-with-the-samples), but within a Grails application.

The JavaScript is virtually identical; the Grails service uses a slightly modified version of Atmosphere plugin and is essentially a copy/paste/grails-ize job.

# Modifications

1. In BuildConfig.groovy, I added a compile dependency to update to the latest Atmosphere and override the dependency in the Atmosphere plugin
> compile('org.atmosphere:atmosphere-runtime:1.0.0.beta5') {
              excludes 'slf4j-api', 'atmosphere-ping'
          }

2. In *your* Atmosphere plugin, replace the `jquery.atmosphere.js` file with the latest one in [Stephane's repo](https://github.com/smaldini/grails-atmosphere/tree/master/web-app/js/jquery)

# Tomcat Configuration

Using the latest Tomcat plugin, run-app should just work.

Using Tomcat 7.0.29, the chat application worked fine for me using the HTTP/1.1 connector. You may wish to experiment with the NIO connector. To do so:

1. In `server.xml`, change the HTTP/1.1 connector protocol to `protocol="org.apache.coyote.http11.Http11NioProtocol"`.
2. Eventually, you'll want to [read more about configuring this connector](http://tomcat.apache.org/tomcat-7.0-doc/config/http.html#NIO_specific_configuration)

# Notable Config Settings

* In `AtmosphereConfig.groovy`, I've set these initParams: `initParams = ['org.atmosphere.cpr.cometSupport': 'org.atmosphere.container.Tomcat7CometSupport']`

In addition, these settings have previously been required:

* In `Config.groovy`, note I've set `tomcat.nio=true`. You'll want to do the same in your applications that use websockets for use with the Tomcat plugin (i.e. run-app)
> Without tomcat.nio=true, Tomcat will block and the shell will lose the `grails>` prompt
* In `BuildConfig.groovy`, I've seen `grails.tomcat.nio=true`
> I do not know what effect, if any, this setting has. I am not using it.


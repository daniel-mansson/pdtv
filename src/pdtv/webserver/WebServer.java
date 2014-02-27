package pdtv.webserver;

import java.io.File;
import java.util.Properties;

import org.eclipse.jetty.server.Handler;
import org.eclipse.jetty.server.Server;
import org.eclipse.jetty.server.handler.DefaultHandler;
import org.eclipse.jetty.server.handler.HandlerList;
import org.eclipse.jetty.servlet.ServletHolder;
import org.eclipse.jetty.webapp.WebAppContext;

import pdtv.main.Service;
import pdtv.main.Status;
import pdtv.webserver.Test.HelloServlet;

public class WebServer extends Service {
	
	Server server;
	int port;

	public WebServer(Properties properties) {
		
		port = Integer.parseInt(properties.getProperty("webserver_port",	"8080").trim());	
		server = new Server(port);

		WebAppContext webappcontext = new WebAppContext();
		webappcontext.setContextPath("/");

		String webappDir = properties.getProperty("webapp_dir",	"webapp").trim();
		File warPath = new File(webappDir);
		webappcontext.setWar(warPath.getAbsolutePath());
		HandlerList handlers = new HandlerList();

		webappcontext.addServlet(new ServletHolder(new HelloServlet()), "/hello");
		webappcontext.addServlet(new ServletHolder(new DatabaseResponse(null)), "/test");

		handlers.setHandlers(new Handler[] { webappcontext, new DefaultHandler() });
		server.setHandler(handlers);

	}
	
	@Override
	public boolean start() {

		setStatus(Status.Starting);		
		
		try {
			server.start();
		} catch (Exception e) {
			setError(e.getMessage());
			setMessage("Failed to create web server.");
			setStatus(Status.Stopped);
			return false;
		}

		setMessage("Webserver, port: " + port);
		setStatus(Status.Running);
		return false;
	}
	
	@Override
	public void stop() {
		if(server != null) {
			try {
				server.stop();
			} catch (Exception e) {
				
			}
			server = null;
		}
	}
}

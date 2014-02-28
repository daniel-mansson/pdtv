package pdtv.webserver;

import java.io.File;
import java.io.IOException;
import java.util.Properties;

import org.eclipse.jetty.server.Handler;
import org.eclipse.jetty.server.Server;
import org.eclipse.jetty.server.handler.DefaultHandler;
import org.eclipse.jetty.server.handler.HandlerList;
import org.eclipse.jetty.servlet.ServletHolder;
import org.eclipse.jetty.webapp.WebAppContext;

import pdtv.database.Database;
import pdtv.main.Service;
import pdtv.main.Status;
import pdtv.webserver.Test.HelloServlet;

public class WebServer extends Service {
	
	Server server;
	int port;
	String queryFile;
	String webappDir;
	Database database;

	public WebServer(Properties properties, Database database) {
		this.database = database;
		
		port = Integer.parseInt(properties.getProperty("webserver_port", "8080").trim());
		queryFile = properties.getProperty("query_file", "config/query.sql").trim();
				
		server = new Server(port);
		webappDir = properties.getProperty("webapp_dir", "webapp").trim();		
	}
	
	@Override
	public boolean start() {
		setStatus(Status.Starting);		

		WebAppContext webappcontext = new WebAppContext();
		webappcontext.setContextPath("/");

		File warPath = new File(webappDir);
		webappcontext.setWar(warPath.getAbsolutePath());
		HandlerList handlers = new HandlerList();

		webappcontext.addServlet(new ServletHolder(new HelloServlet()), "/hello");
		try {
			webappcontext.addServlet(new ServletHolder(new DatabaseResponse(queryFile, database)), "/test");
		} catch (IOException e1) {
			setError(e1.getMessage());
			setMessage("Failed to add database servlet.");
			setStatus(Status.Stopped);
			return false;
		}

		handlers.setHandlers(new Handler[] { webappcontext, new DefaultHandler() });
		server.setHandler(handlers);
		
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

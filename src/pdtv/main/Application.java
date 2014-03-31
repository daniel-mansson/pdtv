package pdtv.main;

import java.util.Properties;

import pdtv.database.Database;
import pdtv.sniffer.Sniffer;
import pdtv.ui.Window;
import pdtv.ui.WindowListener;
import pdtv.webserver.RealtimeSocket;
import pdtv.webserver.WebServer;

public class Application implements WindowListener{
	
	Window window;
	
	Database database;
	Sniffer sniffer;
	WebServer webServer;
 
	public Application(Properties properties) {	
		database = new Database(properties);
		webServer = new WebServer(properties, database);
		sniffer = new Sniffer(properties, database, webServer);
		
		RealtimeSocket.sniffer = sniffer;//Ugly as shit :)
		
		database.createWorkers(webServer);

		window = new Window(database, sniffer, webServer);
		window.addListener(this);
	}
	
	public void start() {
		database.start();
		//sniffer.start();
		webServer.start();
	}

	@Override
	public void requestClose() {	
		window.close();

		sniffer.stop();
		webServer.stop();
		database.stop();
	}

	@Override
	public void buttonPressed(int id) {
		
	}
}

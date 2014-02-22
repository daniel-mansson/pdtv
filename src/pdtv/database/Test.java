package pdtv.database;

import java.sql.SQLException;

import org.h2.tools.Server;

public class Test {

	public static void main(String[] args) throws SQLException {
		
		// start the TCP Server
		Server server = Server.createTcpServer(args).start();
		
		// stop the TCP Server
		server.stop();
	}

}

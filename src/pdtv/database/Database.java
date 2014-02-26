package pdtv.database;

import java.sql.Connection;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Properties;
import java.util.concurrent.ArrayBlockingQueue;

import org.h2.tools.Server;

import com.jolbox.bonecp.BoneCP;
import com.jolbox.bonecp.BoneCPConfig;

import pdtv.main.Service;
import pdtv.main.Status;
import pdtv.sniffer.Packet;

public class Database extends Service{
	Server server;
	ArrayBlockingQueue<Packet> queue;
	ArrayList<Worker> workers;
	BoneCP connectionPool;

	public Database(Properties properties) {
		server = null;

		int queue_length = Integer.parseInt(properties.getProperty("queue_length", "10000").trim());
		int num_workers = Integer.parseInt(properties.getProperty("num_workers", "2").trim());
		
		queue = new ArrayBlockingQueue<Packet>(queue_length);
		
		workers = new ArrayList<Worker>();
		for(int i = 0; i < num_workers; ++i) {
			Worker w = new Worker(queue);
			new Thread(w).start();
			workers.add(w);
		}
		
		setMessage("Database information text.");
	}

	@Override
	public boolean start() {
		setStatus(Status.Starting);
		try {
			server = Server.createWebServer();
			server.start();
			
		} catch (SQLException e) {
			server = null;
			setError(e.getMessage());
			setStatus(Status.Stopped);
			setMessage("Failed to start database server.");
			return false;
		}

		try {
			BoneCPConfig config = new BoneCPConfig();
			config.setJdbcUrl("jdbc:h2:data/test"); 
													
			config.setUsername("sa");
			config.setPassword("");
			config.setMinConnectionsPerPartition(2);
			config.setMaxConnectionsPerPartition(5);
			config.setPartitionCount(2);
			connectionPool = new BoneCP(config);
		} catch (Exception e) {
			server.stop();
			server = null;
			setError(e.getMessage());
			setStatus(Status.Stopped);
			setMessage("Failed to open connection to database.");
			return false;
		}
		
		setMessage("Database, port: " + server.getPort());
		setStatus(Status.Running);
		return true;
	}

	@Override
	public void stop() {
		if(connectionPool != null) {
			connectionPool = null;
		}
		
		for(Worker w : workers) {
			w.shutdown();
		}
		
		if(server != null) {
			server.stop();
			server = null;
		}
		
		setStatus(Status.Stopped);
	}
	
	public void insert(Packet packet) {
		queue.add(packet);
	}
	
	
}

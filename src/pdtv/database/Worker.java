package pdtv.database;

import java.sql.Time;
import java.util.concurrent.ArrayBlockingQueue;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

import pdtv.sniffer.Packet;

public class Worker implements Runnable{
	
	private static int test_id = 0;
	private int id;
	
	private ArrayBlockingQueue<Packet> queue;
	private volatile boolean isAlive;
	private Database database;
	
	public Worker(ArrayBlockingQueue<Packet> queue, Database datab) {
		this.queue = queue;
		isAlive = true;
		id = test_id++;
		database = datab;
	}

	@Override
	public void run() {
		while(isAlive) {
			if(queue.isEmpty()) {
			try {
				Thread.sleep(50);
			} catch (InterruptedException e) {
			}
			}
			else {
				Packet packet = queue.poll();
				if(packet != null) {
					//TODO: Do work and add to database
					//kolla up land, kordinater, lite mer saker
					byte[] dest = packet.destination;
					byte[] sor = packet.source;
					Time time = packet.time;
					String type = packet.type;
					String protocol = packet.protocol;
					int hits = packet.hits;
					long timePeriod = packet.timePeriod;
					System.out.println("Processing packet! (Worker id: " + id + ")");
					
					
					//insert i databas				
					/*try {
						Connection connection = database.getConnectionPool().getConnection();
						//Statement s = connection.createStatement();
						//insert into packets
						//ResultSet rs = s.executeQuery("SELECT MAX(PACKETID) AS MAX FROM PACKETS;");
						//int id = rs.getInt("MAX") +1;
						//System.out.println(id);
						
						
						//s.executeQuery("INSERT INTO PACKETS (CONNECTIONID, TIME, TIMEPERIOD, HITCOUNT, PROTOCOLID, TYPEID) VALUES (5, '2014-01-30 20:26:05', '00:00:05', 18, 1, 1);");
						//s.executeQuery("INSERT INTO PACKETS (CONNECTIONID, TIME, TIMEPERIOD, HITCOUNT, PROTOCOLID, TYPEID) VALUES (id, time, period, hitcount, protocolid, typeid);");				

					} catch (SQLException e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					}*/
				}
			}
		}
	}

	public void shutdown() {
		isAlive = false;
	}
}

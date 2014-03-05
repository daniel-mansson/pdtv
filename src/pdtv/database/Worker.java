package pdtv.database;

import java.sql.Time;
import java.util.concurrent.ArrayBlockingQueue;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.text.SimpleDateFormat;

import pdtv.sniffer.Packet;

public class Worker implements Runnable{
	
	private static int test_id = 0;
	private int id;
	private boolean working = false;
	
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
					
					Time packettime = packet.time;
					String time = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(packettime);
					String type = packet.type;
					String protocol = packet.protocol;
					int hits = packet.hits;
					
			//ej rätt format på timeP
					long timePeriod = packet.timePeriod / 10000;
					String timeP = new SimpleDateFormat("HH:mm:ss").format(timePeriod);
					System.out.println("Processing packet! (Worker id: " + id + ")");
			//hämta HITCOUNT
					
					
					//insert i databas				
					try {
						Connection connection = database.getConnectionPool().getConnection();			
						Statement s = connection.createStatement();
						
						//to be done: real latitudes and longitudes
						String fromlat = "59.3333";
						String fromlong = "18.05";
						String tolat = "32.78014";
						String tolong = "-96.800451";
						if(working){
						//Find corresponding connectid
						int conectid = 0;
						ResultSet resultconnectid = s.executeQuery("SELECT CONNECTIONID FROM Connections INNER JOIN Addresses AS FromAddr ON Connections.FromAddr = FromAddr.AddrId INNER JOIN Locations AS FromLoc ON FromLoc.LocationId = FromAddr.LocationId INNER JOIN Addresses AS ToAddr ON Connections.ToAddr = ToAddr.AddrId INNER JOIN Locations AS ToLoc ON ToLoc.LocationId = ToAddr.LocationId WHERE FromLoc.LATITUDE = '"+ fromlat +"' AND FromLoc.LONGITUDE = '" + fromlong +"' AND ToLoc.LATITUDE = '" + tolat + "' AND ToLoc.LONGITUDE = '" + tolong +"';"); 
				        if(resultconnectid.next()){
							conectid  = resultconnectid.getInt("CONNECTIONID");
				        }
				        
				        //Create New connections values if connectid is not find
				        else{
				        	//find fromaddr id
				        	int fromaddrmax = 0;
				        	resultconnectid = s.executeQuery("SELECT ADDRID FROM Addresses AS FromAddr INNER JOIN Locations AS FromLoc ON FromLoc.LocationId = FromAddr.LocationId WHERE FromLoc.LATITUDE = '"+ fromlat +"' AND FromLoc.LONGITUDE = '" + fromlong +"';");
				        	if(resultconnectid.next()){
				        		fromaddrmax = resultconnectid.getInt("ADDRID");
				        	}
							
				        	//find toaddr id
				        	int toaddrmax = 0;
				        	resultconnectid = s.executeQuery("SELECT ADDRID FROM Addresses AS ToAddr INNER JOIN Locations AS ToLoc ON ToLoc.LocationId = ToAddr.LocationId WHERE ToLoc.LATITUDE = '"+ tolat +"' AND ToLoc.LONGITUDE = '" + tolong +"';");
				        	if(resultconnectid.next()){
				        		toaddrmax = resultconnectid.getInt("ADDRID");
				        	}
							
				        	resultconnectid = s.executeQuery("SELECT MAX(CONNECTIONID) AS MAX FROM Connections;");
							resultconnectid.next();
							conectid = resultconnectid.getInt("MAX")+1;
							s.execute("INSERT INTO CONNECTIONS (FROMADDR, TOADDR, ROUTEID) VALUES ("+fromaddrmax+", "+toaddrmax+", 0);");							
				        }
						
						//Find corresponding protocolid
						int protocolid = 0;
						ResultSet resultprotocoltid = s.executeQuery("SELECT PROTOCOLID FROM PROTOCOLS WHERE NAME = '"+ protocol + "';");
						if(resultprotocoltid.next()){
							protocolid  = resultprotocoltid.getInt("PROTOCOLID");
						}
						//Create New protocol values if type is not find
						else{
							resultprotocoltid = s.executeQuery("SELECT MAX(PROTOCOLID) AS MAX FROM PROTOCOLS;");
							resultprotocoltid.next();
							int promax = resultprotocoltid.getInt("MAX")+1;
							
							s.execute("INSERT INTO PROTOCOLS (PROTOCOLID,NAME) VALUES (" + promax + ", '"+ protocol +"');");
							resultprotocoltid = s.executeQuery("SELECT PROTOCOLID FROM PROTOCOLS WHERE NAME = '"+ protocol + "';");
							resultprotocoltid.next();
							protocolid  = resultprotocoltid.getInt("PROTOCOLID");
						}
						
						
						//Find corresponding typeid
						int typeid = 0;
						ResultSet resulttypetid = s.executeQuery("SELECT TYPEID FROM TYPES WHERE NAME = '"+ type + "';");
						if(resulttypetid.next()){;
							typeid  = resulttypetid.getInt("TYPEID");
						}
						//Create New type values if type is not find
						else{
							resulttypetid = s.executeQuery("SELECT MAX(TYPEID) AS MAX FROM TYPES;");
							resulttypetid.next();
							int tymax = resultprotocoltid.getInt("MAX")+1;
							
							s.execute("INSERT INTO TYPES (TYPEID,NAME) VALUES (" + tymax +", '"+ type +"');");
							resulttypetid = s.executeQuery("SELECT TYPEID FROM TYPES WHERE NAME = '"+ type + "';");
							resulttypetid.next();
							typeid  = resulttypetid.getInt("TYPEID");
						}
						
						s.execute("INSERT INTO PACKETS (CONNECTIONID, TIME, TIMEPERIOD, HITCOUNT, PROTOCOLID, TYPEID) VALUES (" + conectid + ", '"+ time +"' , '"+ timeP+ "', 17," + protocolid + ","+ typeid+");");			
						}
						connection.close();
						
					} catch (SQLException e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					}
					
				}
			}
		}
	}

	public void shutdown() {
		isAlive = false;
	}
}

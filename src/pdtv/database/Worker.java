package pdtv.database;

import java.sql.Time;
import java.util.Random;
import java.util.concurrent.ArrayBlockingQueue;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.text.SimpleDateFormat;

import org.jnetpcap.packet.format.FormatUtils;

import com.google.gson.JsonObject;

import pdtv.sniffer.Packet;
import pdtv.webserver.WebServer;

public class Worker implements Runnable{
	
	private static int test_id = 0;
	private int id;
	private boolean working = true;
	
	private ArrayBlockingQueue<Packet> queue;
	private volatile boolean isAlive;
	private Database database;
	private WebServer webServer;
	
	private String time;
	private String type;
	private String protocol;
	private int hits;
	private String timeP;
	//to be done: real latitudes and longitudes
	private String fromAddr;
	private String toAddr;
	private String fromlat;
	private String fromlong;
	private String tolat;
	private String tolong;
	private String fromCity;
	private String toCity;
	private String fromCountry;
	private String toCountry;
	
	public Worker(ArrayBlockingQueue<Packet> queue, Database datab, WebServer webServer) {
		this.queue = queue;
		isAlive = true;
		id = test_id++;
		database = datab;
		this.webServer = webServer;
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
					//TODO: Do work
					//TODO: kolla up land, kordinater, lite mer saker					
					byte[] dest = packet.destination;
					byte[] sor = packet.source;
					
					Time packettime = packet.time;
					time = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(packettime);
					type = packet.type;
					protocol = packet.protocol;
					hits = packet.hits;
					
			//TODO: ej r�tt format p� timeP, blir timmar
					long timePeriod = packet.timePeriod / 10000;
					timeP = new SimpleDateFormat("HH:mm:ss").format(timePeriod);
					//System.out.println("Processing packet! (Worker id: " + id + ")");
					
			//TODO: get HITCOUNT, addr
					
			//TODO: real latitudes and longitudes
				/*	fromlat = "59.3333";
					fromlong = "18.05";
					tolat = "32.78014";
					tolong = "-96.800451";*/

					GeoData destGeo = database.getGeoLocator().getData(dest);
					GeoData srcGeo = database.getGeoLocator().getData(sor);
					//System.out.println("Dest: "+destGeo.getCountry()+" Src: "+srcGeo.getCountry());
					if(destGeo.getCountry().equals("__") && srcGeo.getCountry().equals("__"))
						continue;
					/*if(!srcGeo.getCountry().equals("__"))
						continue;
					*/
					
					if(sor.length == 4)
						fromAddr = FormatUtils.ip(sor);
					else
						fromAddr = FormatUtils.asString(sor);
					
					if(dest.length == 4)
						toAddr = FormatUtils.ip(dest);
					else
						toAddr = FormatUtils.asString(dest);
					
					fromlat = Double.toString(srcGeo.getLatitude());
					fromlong = Double.toString(srcGeo.getLongitude());
					tolat = Double.toString(destGeo.getLatitude());
					tolong = Double.toString(destGeo.getLongitude());
					fromCity = srcGeo.getCity();
					toCity = destGeo.getCity();
					fromCountry = srcGeo.getCountry();
					toCountry = destGeo.getCountry();

					sendRealtimePacket();
					// random values	
					/*Random r = new Random();
					//double rlong = ((double) r.nextInt(36001) - 18000)/100;
					//double rlat = ((double) r.nextInt(17001) - 8500)/100 ;
					fromlat = Double.toString(((double) r.nextInt(17001) - 8500)/100);
					fromlong = Double.toString(((double) r.nextInt(36001) - 18000)/100);
					tolat = Double.toString(((double) r.nextInt(17001) - 8500)/100);
					tolong = Double.toString(((double) r.nextInt(36001) - 18000)/100);*/
					
					
					//insert into database				
					try {
						Connection connection = database.getConnectionPool().getConnection();			
						Statement s = connection.createStatement();
						insertData(s);
						connection.close();
						
					} catch (SQLException e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					}
					
				}
			}
		}
	}
	
	//insert into database method
	public synchronized void insertData(Statement s){
		try {	
		//Find corresponding connectid
		int conectid = getConnectionId(s);
		
		//Find corresponding protocolid
		int protocolid = getProtocolId(s);	
		
		//Find corresponding typeid
		int typeid = getTypeId(s);
		
		//Find next packetid 
		//int packid = getMaxPackId(s)+1;
		
		//Insert to database
		s.execute("INSERT INTO PACKETS (CONNECTIONID, TIME, TIMEPERIOD, HITCOUNT, PROTOCOLID, TYPEID) VALUES (" + conectid + ", '"+ time +"' , '"+ timeP+ "'," + hits +"," + protocolid + ","+ typeid+");");			
		
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
	
	//Find corresponding connectid	
	private synchronized int getConnectionId(Statement s){
		int conectid = 0;
		try {	
			ResultSet resultconnectid = s.executeQuery("SELECT CONNECTIONID FROM Connections INNER JOIN Addresses AS FromAddr ON Connections.FromAddr = FromAddr.AddrId INNER JOIN Locations AS FromLoc ON FromLoc.LocationId = FromAddr.LocationId INNER JOIN Addresses AS ToAddr ON Connections.ToAddr = ToAddr.AddrId INNER JOIN Locations AS ToLoc ON ToLoc.LocationId = ToAddr.LocationId WHERE FromLoc.LATITUDE = '"+ fromlat +"' AND FromLoc.LONGITUDE = '" + fromlong +"' AND ToLoc.LATITUDE = '" + tolat + "' AND ToLoc.LONGITUDE = '" + tolong +"';"); 
			if(resultconnectid.next()){
				conectid  = resultconnectid.getInt("CONNECTIONID");
			}
        
			//Create New connections values if connectid is not find
			else{
				//find fromaddr id
				int fromaddrmax = getAddId(s, fromAddr, fromlat, fromlong, fromCountry, fromCity);
			
				//find toaddr id
				int toaddrmax = getAddId(s, toAddr, tolat, tolong, toCountry, toCity);
			
				/*resultconnectid = s.executeQuery("SELECT MAX(CONNECTIONID) AS MAX FROM Connections;");
				resultconnectid.next();
				conectid = resultconnectid.getInt("MAX")+1;*/
				s.execute("INSERT INTO CONNECTIONS (FROMADDR, TOADDR, ROUTEID) VALUES ("+fromaddrmax+", "+toaddrmax+", 0);");	
				resultconnectid = s.executeQuery("SELECT CONNECTIONID FROM Connections INNER JOIN Addresses AS FromAddr ON Connections.FromAddr = FromAddr.AddrId INNER JOIN Locations AS FromLoc ON FromLoc.LocationId = FromAddr.LocationId INNER JOIN Addresses AS ToAddr ON Connections.ToAddr = ToAddr.AddrId INNER JOIN Locations AS ToLoc ON ToLoc.LocationId = ToAddr.LocationId WHERE FromLoc.LATITUDE = '"+ fromlat +"' AND FromLoc.LONGITUDE = '" + fromlong +"' AND ToLoc.LATITUDE = '" + tolat + "' AND ToLoc.LONGITUDE = '" + tolong +"';"); 
				resultconnectid.next();
				conectid  = resultconnectid.getInt("CONNECTIONID");		
			}
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return conectid;
	}
	
	
	//Find corresponding addrid
	private synchronized int getAddId(Statement s, String addr, String lat, String longitude, String country, String city){
		int addrmax = 0;
		try {	
			ResultSet resultaddtid = s.executeQuery("SELECT ADDRID FROM Addresses AS Addr INNER JOIN Locations AS Loc ON Loc.LocationId = Addr.LocationId WHERE Loc.LATITUDE = '"+ lat +"' AND Loc.LONGITUDE = '" + longitude +"';");
			if(resultaddtid.next()){
				addrmax = resultaddtid.getInt("ADDRID");
			}
			else {
				int locid = createLoc(s, lat, longitude,country, city);
				/*resultaddtid = s.executeQuery("SELECT MAX(ADDRID) AS MAX FROM Addresses;");
				resultaddtid.next();
				addrmax = resultaddtid.getInt("MAX")+1;*/

				//create address
//TODO: get addr!!!
				s.execute("INSERT INTO ADDRESSES (ADDR, LOCATIONID) VALUES ('"+ addr +"', " + locid +")");
				resultaddtid = s.executeQuery("SELECT ADDRID FROM Addresses AS Addr INNER JOIN Locations AS Loc ON Loc.LocationId = Addr.LocationId WHERE Loc.LATITUDE = '"+ lat +"' AND Loc.LONGITUDE = '" + longitude +"';");
				resultaddtid.next();
				addrmax = resultaddtid.getInt("ADDRID");
			}
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return addrmax;
	}
	
	//Create location
	private synchronized int createLoc(Statement s, String lat, String longitude,String country, String city){
		int locmax = 0;
		try {	
			/*ResultSet resultloctid = s.executeQuery("SELECT MAX(LOCATIONID) AS MAX FROM Locations;");
			resultloctid.next();
			locmax = resultloctid.getInt("MAX")+1;*/

			//create location
			s.execute("INSERT INTO LOCATIONS (COUNTRY, CITY, LATITUDE, LONGITUDE) VALUES ('"+country+"', '"+city+"','"+ lat +"', '" + longitude +"');");
			ResultSet resultloctid = s.executeQuery("SELECT LOCATIONID FROM Locations WHERE LATITUDE = '"+ lat +"' AND LONGITUDE = '" + longitude +"';");
			resultloctid.next();
			locmax = resultloctid.getInt("LOCATIONID");	
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return locmax;
	}
	
	
	//Find corresponding protocolid
	private synchronized int getProtocolId(Statement s){
		int protocolid = 0;
		try {	
			ResultSet resultprotocoltid = s.executeQuery("SELECT PROTOCOLID FROM PROTOCOLS WHERE NAME = '"+ protocol + "';");
			if(resultprotocoltid.next()){
				protocolid  = resultprotocoltid.getInt("PROTOCOLID");
			}
			//Create New protocol values if type is not find
			else{
				/*resultprotocoltid = s.executeQuery("SELECT MAX(PROTOCOLID) AS MAX FROM PROTOCOLS;");
				resultprotocoltid.next();
				int promax = resultprotocoltid.getInt("MAX")+1;*/
				
				s.execute("INSERT INTO PROTOCOLS (NAME) VALUES ('"+ protocol +"');");
				resultprotocoltid = s.executeQuery("SELECT PROTOCOLID FROM PROTOCOLS WHERE NAME = '"+ protocol + "';");
				resultprotocoltid.next();
				protocolid  = resultprotocoltid.getInt("PROTOCOLID");
			
			}
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return protocolid;
	}
	
	
	//Find corresponding typeid
	private synchronized int getTypeId(Statement s){
		int typeid = 0;
		try {	
			ResultSet resulttypetid = s.executeQuery("SELECT TYPEID FROM TYPES WHERE NAME = '"+ type + "';");
			if(resulttypetid.next()){;
				typeid  = resulttypetid.getInt("TYPEID");
			}
			//Create New type values if type is not find
			else{
				/*resulttypetid = s.executeQuery("SELECT MAX(TYPEID) AS MAX FROM TYPES;");
				resulttypetid.next();
				int tymax = resulttypetid.getInt("MAX")+1;*/
				
				s.execute("INSERT INTO TYPES (NAME) VALUES ('"+ type +"');");
				resulttypetid = s.executeQuery("SELECT TYPEID FROM TYPES WHERE NAME = '"+ type + "';");
				resulttypetid.next();
				typeid  = resulttypetid.getInt("TYPEID");
			
			}
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return typeid;
	}
	
	private void sendRealtimePacket() {
		JsonObject entry = new JsonObject();
		
		entry.addProperty("Time", time.toString());
		entry.addProperty("TimePeriod", timeP.toString());
		entry.addProperty("HitCount", hits);
		entry.addProperty("Protocol", protocol);
		entry.addProperty("Type", type);

		JsonObject from = new JsonObject();
		from.addProperty("Addr", fromAddr);
		from.addProperty("Country", fromCountry);
		from.addProperty("City", fromCity);
		from.addProperty("Latitude", fromlat);
		from.addProperty("Longitude", fromlong);
		entry.add("from", from);

		JsonObject to = new JsonObject();
		to.addProperty("Addr", toAddr);
		to.addProperty("Country", toCountry);
		to.addProperty("City", toCity);
		to.addProperty("Latitude", tolat);
		to.addProperty("Longitude", tolong);
		entry.add("to", to);
		
		webServer.sendRealtimePacket(entry);
	}
	
	//Get current max packetid
	/*private synchronized int getMaxPackId(Statement s){
		int packid = 0;
		try {	
		ResultSet resultpacktid = s.executeQuery("SELECT MAX(PACKETID) AS MAX FROM PACKETS;");
		resultpacktid.next();
		packid = resultpacktid.getInt("MAX");
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return packid;
	}*/


	public void shutdown() {
		isAlive = false;
	}
}

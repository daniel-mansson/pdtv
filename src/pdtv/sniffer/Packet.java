package pdtv.sniffer;

import java.sql.Time;
import java.util.ArrayList;

public class Packet {
	public byte[] source;
	public byte[] destination;
	public Time time;
	public String country;
	public String city;
	public String type;
	public String protocol;
	public double longitude;
	public double latitude;
	public ArrayList<byte[]> route;
	public int hits;
	public int timePeriod;
}

package pdtv.sniffer;

import java.sql.Time;

public class Packet{
	public byte[] source;
	public byte[] destination;
	public Time time;
	public String type;
	public String protocol;
	public int hits;
	public long timePeriod;//milliseconds

}

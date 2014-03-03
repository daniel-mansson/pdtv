package pdtv.sniffer;

public class PacketKey implements Comparable<PacketKey>{
	private byte[] source;
	private byte[] destination;
	
	public PacketKey(byte[] src, byte[] dest) {
		source = src;
		destination = dest;
	}
	
	@Override
	public int compareTo(PacketKey o) {
		if(source.length != o.source.length)
			return source.length - o.source.length;
		if(destination.length != o.destination.length)
			return destination.length - o.destination.length;

		for(int i = 0; i < source.length; ++i) {
			if(source[i] != o.source[i])
				return source[i] - o.source[i];
		}
		for(int i = 0; i < destination.length; ++i) {
			if(destination[i] != o.destination[i])
				return destination[i] - o.destination[i];
		}
		return 0;
	}
}

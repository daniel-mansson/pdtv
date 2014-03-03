package pdtv.database;

import com.jolbox.bonecp.BoneCP;

public class Geolocator {
	
	public Geolocator(BoneCP connectionPool) {
		
	}
	
	public GeoData getData(byte[] addr) {
		
		
		return new GeoData("Unknown", "__", 0, 0);
	}
	
}

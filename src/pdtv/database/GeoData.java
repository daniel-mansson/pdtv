package pdtv.database;

public class GeoData {

	private String country;
	private String city;
	private double latitude;
	private double longitude;
	
	public GeoData(String country, String city, double lat, double lon) {
		this.country = country;
		this.city = city;
		this.latitude = lat;
		this.longitude = lon;
	}
	
	public String getCity() {
		return city;
	}
	
	public String getCountry() {
		return country;
	}
	
	public double getLatitude() {
		return latitude;
	}
	
	public double getLongitude() {
		return longitude;
	}
}

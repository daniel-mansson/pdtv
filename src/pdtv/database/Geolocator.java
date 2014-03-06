package pdtv.database;

import java.io.IOException;
import java.nio.ByteBuffer;
import java.nio.charset.Charset;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

import com.jolbox.bonecp.BoneCP;

public class Geolocator {

	BoneCP pool;
	// final static String ipQuery =
	// "SELECT (NETWORK_START_IP, NETWORK_MASK_LENGTH, GEONAME_ID, LONGITUDE, LATITUDE) FROM GEOLOC_IP WHERE (NETWORK_START_IP < ?) LIMIT 1";
	final static String ipQuery = "SELECT (country_iso_code, city_name, LONGITUDE, LATITUDE) FROM GEOLOC_IP INNER JOIN GEOLOC_LOC ON GEOLOC_LOC.GEONAME_ID = GEOLOC_IP.GEONAME_ID WHERE NETWORK_START_IP = ? LIMIT 1";
	final static String locationQuery = "SELECT (COUNTRY_ISO_CODE, CITY_NAME) FROM GEOLOC_LOC WHERE (GEONAME_ID = ?) LIMIT 1";

	public Geolocator(BoneCP connectionPool, String createFile)
			throws IOException, SQLException {
		this.pool = connectionPool;

		byte[] encoded = Files.readAllBytes(Paths.get(createFile));
		String createStr = Charset.defaultCharset()
				.decode(ByteBuffer.wrap(encoded)).toString();

		Connection c = connectionPool.getConnection();
		c.createStatement().execute(createStr);
		c.close();
	}

	public GeoData getData(byte[] addr) {

		try {
			Connection c = pool.getConnection();
			PreparedStatement ip = c.prepareStatement(ipQuery);

			int offset = 0;
			long ipValue = 0L;
			if (addr.length == 4) {
				ipValue = 0xffff00000000L;
				for (int i = 0; i < 4; ++i) {
					ipValue |= (((long) addr[3 - i]) & 0xff) << (i * 8);
				}
			} else {
				offset = 32;
				for (int i = 0; i < 4; ++i) {
					ipValue |= (((long) addr[3 - i]) & 0xff) << (i * 8 + 32);
				}
			}

			for (int i = -1; i < 8; ++i) {
				if (i >= 0)
					ipValue &= ~(1 << (i + offset));
				ip.setLong(1, ipValue);
				ResultSet ipRes = ip.executeQuery();

				if (ipRes.next()) {
					Object[] data = (Object[])ipRes.getArray(1).getArray();
					String country = "Unknown";
					String city = "Unknown";
					double lat = 45.1418106;
					double lon = -34.4594981;

					if(data[0] != null)
						country = (String)data[0];
					if(data[1] != null)
						city = (String)data[1];
					if(data[2] != null)
						lon = (double)data[2];
					if(data[3] != null)
						lat = (double)data[3];
					
					//System.out.println(country + "  " + city + "  " + lat + "  " + lon);
					c.close();
					return new GeoData(country, city, lat, lon);
				}
			}

			c.close();
		} catch (SQLException e) {
			System.out.println(e.getMessage());
		} finally {
		}

		return null;
	}

}

package pdtv.webserver;

import java.io.IOException;
import java.io.PrintWriter;
import java.nio.ByteBuffer;
import java.nio.charset.Charset;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.sql.Time;
import java.sql.Timestamp;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;

import pdtv.database.Database;

public class DatabaseResponse extends HttpServlet {

	private static final long serialVersionUID = 1L;
	private Database database;
	private String queryStr;

	public DatabaseResponse(String queryFile, Database database) throws IOException {
		this.database = database;
		
		byte[] encoded = Files.readAllBytes(Paths.get(queryFile));
		queryStr = Charset.defaultCharset().decode(ByteBuffer.wrap(encoded)).toString();
	}
	
	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {

		PrintWriter out = resp.getWriter();
		
		Gson gson = new Gson();
		JsonObject root = new JsonObject();
		
		try {
			Connection connection = database.getConnectionPool().getConnection();
			Statement s = connection.createStatement();
			
			ResultSet rs = s.executeQuery(queryStr);

			JsonArray array = new JsonArray();
			
			while (rs.next()) {
				Timestamp time = rs.getTimestamp("Time");
				Time timePeriod = rs.getTime("TimePeriod");
				int hitCount = rs.getInt("Hitcount");
				String protocol = rs.getString("Protocol");
				String type = rs.getString("TypeName");

				String fromAddr = rs.getString("FromAddr");
				String fromCountry = rs.getString("FromCountry");
				String fromCity = rs.getString("FromCity");
				String fromLatitude = rs.getString("FromLatitude");
				String fromLongitude = rs.getString("FromLongitude");

				String toAddr = rs.getString("ToAddr");
				String toCountry = rs.getString("ToCountry");
				String toCity = rs.getString("ToCity");
				String toLatitude = rs.getString("ToLatitude");
				String toLongitude = rs.getString("ToLongitude");

				JsonObject entry = new JsonObject();
				
				entry.addProperty("Time", time.toString());
				entry.addProperty("TimePeriod", timePeriod.toString());
				entry.addProperty("HitCount", hitCount);
				entry.addProperty("Protocol", protocol);
				entry.addProperty("Type", type);

				JsonObject from = new JsonObject();
				from.addProperty("Addr", fromAddr);
				from.addProperty("Country", fromCountry);
				from.addProperty("City", fromCity);
				from.addProperty("Latitude", fromLatitude);
				from.addProperty("Longitude", fromLongitude);
				entry.add("from", from);

				JsonObject to = new JsonObject();
				to.addProperty("Addr", toAddr);
				to.addProperty("Country", toCountry);
				to.addProperty("City", toCity);
				to.addProperty("Latitude", toLatitude);
				to.addProperty("Longitude", toLongitude);
				entry.add("to", to);
				
				array.add(entry);
			}

			root.addProperty("info", "det kommer mer vettig info här");
			root.addProperty("successful_query", true);
			root.add("data", array);
			
			out.print(gson.toJson(root));
		} catch (SQLException e) {
			root.addProperty("error", e.getMessage());
			root.addProperty("successful_query", false);
		}

		String jsonOut = gson.toJson(root); 
		out.print(jsonOut);
		out.flush();	
	}
}
package pdtv.webserver;

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.gson.Gson;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;

import pdtv.database.Database;
import pdtv.sniffer.Packet;

public class DatabaseResponse extends HttpServlet {

	private static final long serialVersionUID = 1L;
	private Database database;

	public DatabaseResponse(Database database) {
		this.database = database;
	}
	
	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {

		PrintWriter out = resp.getWriter();
		
		Gson gson = new Gson();

		JsonObject o = new JsonObject();
		o.addProperty("Test1", "blaha");
		o.addProperty("Test2", "asdf");
		o.addProperty("Test3", "kohykoy");
		o.addProperty("Test4", "fyra");
		o.addProperty("Test5", "femfemfem");

		out.print(gson.toJson(o));
		out.flush();	
	}
}
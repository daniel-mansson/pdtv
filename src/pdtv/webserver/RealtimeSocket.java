package pdtv.webserver;

import org.eclipse.jetty.websocket.api.Session;
import org.eclipse.jetty.websocket.api.WebSocketAdapter;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;

import pdtv.sniffer.Sniffer;

public class RealtimeSocket extends WebSocketAdapter implements
		Comparable<RealtimeSocket> {
	public static RealtimePacketQueue queue;
	public static Sniffer sniffer = null;
	private static int nextUniqueId = 0;

	private final int id;

	public RealtimeSocket() {
		id = nextUniqueId++;
		System.out.println("New Socket " + id);
	}

	@Override
	public void onWebSocketBinary(byte[] payload, int offset, int len) {
		System.out.println("WS binary: " + len);
	}

	@Override
	public void onWebSocketClose(int statusCode, String reason) {
		super.onWebSocketClose(statusCode, reason);
		System.out.println("WS close: " + statusCode + " : " + reason);

		queue.removeListener(this);
	}

	@Override
	public void onWebSocketConnect(Session session) {
		super.onWebSocketConnect(session);

		queue.addListener(this);
		System.out.println("WS connect: " + session.toString());
		
		if(sniffer != null) {
			if (isConnected()) {
				JsonObject welcome = new JsonObject();
				welcome.addProperty("localIP", sniffer.getLocalIP());
			
				Gson gson = new Gson();
				String message = gson.toJson(welcome);
				getRemote().sendStringByFuture(message);
			}
		}
	}

	@Override
	public void onWebSocketError(Throwable cause) {
		System.out.println("WS error: " + cause.getMessage());
	}

	@Override
	public void onWebSocketText(String message) {
		System.out.println("WS message: " + message);
	}

	@Override
	public int compareTo(RealtimeSocket o) {
		return id - o.id;
	}

	public void send(String message) {
		if (isConnected()) {
			getRemote().sendStringByFuture(message);
		}
	}
}

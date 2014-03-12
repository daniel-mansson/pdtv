package pdtv.webserver;

import java.util.ArrayList;
import java.util.TreeSet;
import java.util.concurrent.ArrayBlockingQueue;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;

public class RealtimePacketQueue {

	ArrayBlockingQueue<JsonObject> packetQueue;
	TreeSet<RealtimeSocket> listeners;
	Gson gson;
	volatile boolean shutdown;

	public RealtimePacketQueue() {
		gson = new Gson();
		listeners = new TreeSet<>();
		packetQueue = new ArrayBlockingQueue<>(2048);
		shutdown = false;

		new Thread(new Runnable() {
			@Override
			public void run() {
				while (!shutdown) {
					try {
						Thread.sleep(100);
					} catch (InterruptedException e) {
					}
					sendPackets();
				}
			}
		}).start();
	}

	public void shutdown() {
		shutdown = true;
	}

	public void addListener(RealtimeSocket socket) {
		listeners.add(socket);
	}

	public void removeListener(RealtimeSocket socket) {
		listeners.remove(socket);
	}

	public void addPacket(JsonObject packet) {
		packetQueue.add(packet);
	}

	public void sendPackets() {
		ArrayList<JsonObject> temp = new ArrayList<>();
		packetQueue.drainTo(temp);

		if (temp.size() > 0) {

			JsonArray packets = new JsonArray();
			for (JsonObject p : temp) {
				packets.add(p);
			}

			JsonObject root = new JsonObject();
			root.add("data", packets);
			
			String message = gson.toJson(root);
			for (RealtimeSocket socket : listeners) {
				socket.send(message);
			}

			packets = new JsonArray();
		}
	}
}

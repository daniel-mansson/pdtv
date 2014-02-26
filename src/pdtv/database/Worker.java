package pdtv.database;

import java.util.concurrent.ArrayBlockingQueue;

import pdtv.sniffer.Packet;

public class Worker implements Runnable{
	
	private static int test_id = 0;
	private int id;
	
	private ArrayBlockingQueue<Packet> queue;
	private volatile boolean isAlive; 
	
	public Worker(ArrayBlockingQueue<Packet> queue) {
		this.queue = queue;
		isAlive = true;
		id = test_id++;
	}

	@Override
	public void run() {
		while(isAlive) {
			if(queue.isEmpty()) {
			try {
				Thread.sleep(50);
			} catch (InterruptedException e) {
			}
			}
			else {
				Packet packet = queue.poll();
				if(packet != null) {
					//TODO: Do work and add to database
					System.out.println("Processing packet! (Worker id: " + id + ")");
				}
			}
		}
	}

	public void shutdown() {
		isAlive = false;
	}
}

package pdtv.sniffer;

import java.sql.Time;
import java.util.ArrayList;
import java.util.List;
import java.util.Properties;

import org.jnetpcap.JBufferHandler;
import org.jnetpcap.Pcap;
import org.jnetpcap.PcapHeader;
import org.jnetpcap.PcapIf;
import org.jnetpcap.nio.JBuffer;
import org.jnetpcap.nio.JMemory;
import org.jnetpcap.packet.Payload;
import org.jnetpcap.packet.PcapPacket;
import org.jnetpcap.protocol.lan.Ethernet;
import org.jnetpcap.protocol.network.Ip4;

import pdtv.database.Database;
import pdtv.main.Service;
import pdtv.main.Status;

public class Sniffer extends Service{

	Pcap pcap;
	int deviceId;
	volatile boolean done;
	Database database;
	
	public Sniffer(Properties properties, Database database) {
		pcap = null;
		deviceId = Integer.parseInt(properties.getProperty("sniffer_device", "0").trim());
		done = true;
		this.database = database;
	}
	
	@Override
	public boolean start() {
		setStatus(Status.Starting);
		setMessage("Sniffer");
		done = true;
		
		List<PcapIf> alldevs = new ArrayList<PcapIf>();
		StringBuilder errbuf = new StringBuilder(); 

		//Find devices
		int r = Pcap.findAllDevs(alldevs, errbuf);
		if (r == Pcap.NOT_OK || alldevs.isEmpty()) {
			setError(errbuf.toString());
			setMessage("Failed to list devices.");
			setStatus(Status.Stopped);	
			return false;
		}

		/*System.out.println("Network devices found:");
		int i = 0;
		for (PcapIf device : alldevs) {
			String description = (device.getDescription() != null) ? device
					.getDescription() : "No description available";
			System.out.printf("#%d: %s [%s]\n", i++, device.getName(),
					description);
		}*/

		PcapIf device = alldevs.get(deviceId); 

		int snaplen = 64 * 1024; // Capture all packets, no trucation
		int flags = Pcap.MODE_PROMISCUOUS; // capture all packets
		int timeout = 10 * 1000; // 10 seconds in millis
		
		pcap = Pcap.openLive(device.getName(), snaplen, flags, timeout, errbuf);

		if (pcap == null) {
			setError(errbuf.toString());
			setMessage("Failed to open device for capture.");
			setStatus(Status.Stopped);	
			return false;
		}

		final JBufferHandler<String> handler = new JBufferHandler<String>() {
			final PcapPacket packet = new PcapPacket(JMemory.POINTER);
			final Ip4 ipv4 = new Ip4();
			final Payload payload = new Payload();
			int count = 0;

			@Override
			public void nextPacket(PcapHeader header, JBuffer buffer, String user) {
				packet.peerAndScan(Ethernet.ID, header, buffer);
				if (packet.hasHeader(ipv4)) {
					Packet packet = new Packet();
					packet.source = ipv4.source().clone();
					packet.destination = ipv4.destination().clone();
					packet.hits = 1;
					packet.timePeriod = 100;
					packet.type = "Unknown";
					packet.protocol = "Unknown";
					packet.time = new Time(System.currentTimeMillis());
					
					database.insert(packet);
					++count;

					if(count%50 == 0){
						//TODO: fixa räknare
					}
				}
				if(packet.hasHeader(payload)) {
					
				}
			}
		};

		done = false;
		new Thread(new Runnable() {
			@Override
			public void run() {
				pcap.loop(-1, handler, "sniffer");
			}
		}).start();

		setStatus(Status.Running);
		return true;
	}
	
	@Override
	public void stop() {
		pcap.breakloop();
		pcap = null;
	}
}

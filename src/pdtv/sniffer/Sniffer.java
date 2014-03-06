package pdtv.sniffer;

import java.sql.Time;
import java.util.ArrayList;
import java.util.List;
import java.util.Map.Entry;
import java.util.Properties;
import java.util.TreeMap;
import java.util.TreeSet;

import org.jnetpcap.JBufferHandler;
import org.jnetpcap.Pcap;
import org.jnetpcap.PcapHeader;
import org.jnetpcap.PcapIf;
import org.jnetpcap.nio.JBuffer;
import org.jnetpcap.nio.JMemory;
import org.jnetpcap.packet.Payload;
import org.jnetpcap.packet.PcapPacket;
import org.jnetpcap.packet.format.FormatUtils;
import org.jnetpcap.protocol.lan.Ethernet;
import org.jnetpcap.protocol.network.Ip4;
import org.jnetpcap.protocol.network.Ip6;

import pdtv.database.Database;
import pdtv.main.Service;
import pdtv.main.Status;

public class Sniffer extends Service{

	Pcap pcap;
	int deviceId;
	volatile boolean done;
	Database database;
	TreeMap<PacketKey, Packet> packets;
	long timePeriod;
	
	public Sniffer(Properties properties, Database database) {
		pcap = null;
		deviceId = Integer.parseInt(properties.getProperty("sniffer_device", "0").trim());
		timePeriod = Long.parseLong(properties.getProperty("sniffer_timeperiod", "1000").trim());
		done = true;
		this.database = database;
		packets = new TreeMap<>();
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

		System.out.println("Network devices found:");
		int i = 0;
		for (PcapIf device : alldevs) {
			String description = (device.getDescription() != null) ? device
					.getDescription() : "No description available";
			System.out.printf("#%d: %s [%s]\n", i++, device.getName(),
					description);
		}

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
			final Ip6 ipv6 = new Ip6();
			final Payload payload = new Payload();
			int count = 0;
			int rawCount = 0;
			long timer = 0;
			
			@Override
			public void nextPacket(PcapHeader header, JBuffer buffer, String user) {
				++rawCount;
				
				packet.peerAndScan(Ethernet.ID, header, buffer);
				if (packet.hasHeader(ipv4)) {
					handlePacket(ipv4.source(), ipv4.destination());
				}
				if (packet.hasHeader(ipv6)) {
					if(isGlobalUnicast(ipv6.destination()) && isGlobalUnicast(ipv6.source()))
						handlePacket(ipv6.source(), ipv6.destination());
				}

				long cur = System.currentTimeMillis();
				if(cur - timer > timePeriod) {
					ArrayList<PacketKey> removeKeys = new ArrayList<>();
					
					for(Entry<PacketKey, Packet> e : packets.entrySet()) {
						Packet p = e.getValue();
						if(cur - p.time.getTime() > p.timePeriod) {
							database.insert(p);

							removeKeys.add(e.getKey());
						}
					}
					
					for(PacketKey k : removeKeys) {
						packets.remove(k);
					}
					
					timer = System.currentTimeMillis() + timePeriod;
				}
			}
			
			private boolean isGlobalUnicast(byte[] addr) {
				return (addr[0] & 0xe0) == 0x20;
			}
			
			private void handlePacket(byte[] src, byte[] dst) {
				PacketKey key = new PacketKey(src, dst);
				
				Packet packet = packets.get(key);
				if(packet != null) {
					packet.hits += 1;
					long cur = System.currentTimeMillis();
					if(cur - packet.time.getTime() > packet.timePeriod) {
						database.insert(packet);
						packets.remove(key);
					}
				}
				else {
					packet = new Packet();
					packet.source = src.clone();
					packet.destination = dst.clone();
					packet.hits = 1;
					packet.timePeriod = 100;
					packet.type = "Unknown";
					packet.protocol = "Unknown";
					packet.time = new Time(System.currentTimeMillis());
					packets.put(key, packet);
				}
				
				++count;
				if(count%10 == 0){
					setMessage("Sniffer: " + count + " (" + rawCount + ")");
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

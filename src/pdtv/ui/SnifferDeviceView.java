package pdtv.ui;

import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.util.Observer;

import javax.swing.JComboBox;
import javax.swing.JLabel;
import javax.swing.JPanel;

import pdtv.main.Status;
import pdtv.sniffer.Sniffer;

public class SnifferDeviceView extends JPanel implements Observer{
	private static final long serialVersionUID = 6720775723405659566L;

	private Sniffer sniffer;
	private JComboBox<String> devices;
	
	public SnifferDeviceView(final Sniffer sniffer) {
		this.sniffer = sniffer;
		
		JLabel label = new JLabel("Sniffer device:");
		this.add(label);
		
		String[] deviceStrings = sniffer.getDevices();
		
		devices = new JComboBox<>(deviceStrings);
		this.add(devices);
		
		update(null, null);
		
		sniffer.addObserver(this);
		
		devices.setSelectedIndex(sniffer.getDeviceId());
		devices.addActionListener(new ActionListener() {
			
			@Override
			public void actionPerformed(ActionEvent e) {
				sniffer.setDeviceId(devices.getSelectedIndex());
			}
		});
	}
	
	public void update(java.util.Observable o, Object arg) {
		devices.setEnabled(sniffer.getStatus() == Status.Stopped);
	}
}

package pdtv.ui;

import java.awt.Dimension;
import java.awt.Insets;
import java.awt.event.KeyAdapter;
import java.awt.event.KeyEvent;
import java.net.Inet4Address;
import java.net.InetAddress;
import java.net.NetworkInterface;
import java.net.SocketException;
import java.util.Enumeration;
import java.util.Observable;
import java.util.Observer;

import javax.swing.JLabel;
import javax.swing.JPanel;
import javax.swing.JTextField;

import pdtv.sniffer.Sniffer;

public class LocalIPView  extends JPanel implements Observer{
	private static final long serialVersionUID = 5622129692767839956L;
	
	JTextField inputIP;
	JLabel valid;
	
	public LocalIPView(final Sniffer sniffer) {
		JLabel label = new JLabel("Local IP:");
		this.add(label);
			
		inputIP = new JTextField("0.0.0.0");
		inputIP.setMargin(new Insets(1, 1, 1, 1));
		inputIP.setPreferredSize(new Dimension(100, 20));
		this.add(inputIP);
		setDefaultIp();
		
		valid = new JLabel("OK");
		this.add(valid);

		sniffer.trySetLocalAddr(inputIP.getText());
		
		inputIP.addKeyListener(new KeyAdapter() {
			@Override
			public void keyTyped(KeyEvent e) {
				boolean r = sniffer.trySetLocalAddr(inputIP.getText() + (e.getKeyChar() > 31 ? e.getKeyChar() : ""));
				valid.setText(r ? "OK" : "Invalid");
			}
		});
	}
	
	@Override
	public void update(Observable o, Object arg) {
	
	}
	
	private void setDefaultIp() {
		try {
			Enumeration<NetworkInterface> n = NetworkInterface.getNetworkInterfaces();
	
		    for (; n.hasMoreElements();)
		    {
		        NetworkInterface e = n.nextElement();

		        Enumeration<InetAddress> a = e.getInetAddresses();
		        for (; a.hasMoreElements();)
		        {
		            InetAddress addr = a.nextElement();
		            if(addr instanceof Inet4Address) {
		            	if(!addr.getHostAddress().equals("127.0.0.1")) {
		            		inputIP.setText(addr.getHostAddress());
		            		return;
		            	}
		            }
		        }
		    }
		} catch (SocketException e1) {
		}
		
		inputIP.setText("255.255.255.255");
	}
}

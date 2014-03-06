package pdtv.ui;

import java.awt.BorderLayout;
import java.awt.Button;
import java.awt.Dimension;
import java.awt.Insets;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.event.WindowAdapter;
import java.awt.event.WindowEvent;
import java.util.ArrayList;

import javax.swing.JButton;
import javax.swing.JFrame;
import javax.swing.JLabel;
import javax.swing.JPanel;

import pdtv.database.Database;
import pdtv.sniffer.Sniffer;
import pdtv.webserver.WebServer;

public class Window {

	JFrame frame;
	
	ArrayList<WindowListener> listeners;
	
	Database database;
	Sniffer sniffer;
	WebServer webServer;
	Boolean snifferstoped = true;
	JButton snifferButton;
	
	public Window(Database database, Sniffer sniffer, WebServer webServer) {

		this.database = database;
		this.sniffer = sniffer;
		this.webServer = webServer;
		
		listeners = new ArrayList<WindowListener>();

		frame = new JFrame("pdtv");
		frame.setDefaultCloseOperation(JFrame.DO_NOTHING_ON_CLOSE);
		
		createLayout();

		frame.addWindowListener(new WindowAdapter() {
			@Override
			public void windowClosing(WindowEvent e) {
				for(WindowListener wl : listeners) {
					wl.requestClose();
				}
			}
		});
	}
	
	private void createLayout() {
		frame.setLayout(new BorderLayout());
		
		JPanel left = new JPanel();
		
		
		ServiceView snifferView = new ServiceView(sniffer); 
		snifferButton = (JButton) snifferView.getComponent(0);	
		snifferButton.setMargin(new Insets(0, 0, 0, 0));
		snifferButton.setText("Start");
		JLabel snifferL = (JLabel) snifferView.getComponent(1);	
		snifferL.setText("Start Sniffer by clicking Start");
		snifferButton.addActionListener(new ActionListener() {
			@Override
			public void actionPerformed(ActionEvent arg0) {
				// TODO Auto-generated method stub
				if(snifferstoped){
					System.out.println("Sniffer Start");
					sniffer.start();
					snifferButton.setText("Stop");
					snifferstoped = false;
				}
				else{
					System.out.println("Sniffer Stop");
					snifferButton.setText("Start");
					sniffer.stop();
					snifferstoped = true;
				}
				
			}
        });  
		left.add(snifferView);

		ServiceView dbView = new ServiceView(database); 	
		left.add(dbView);

		ServiceView webView = new ServiceView(webServer); 	
		left.add(webView);
		
		left.setPreferredSize(new Dimension(250, 250));

		frame.add(left, BorderLayout.WEST);
		
		
		JPanel right = new JPanel();
		
		right.setLayout(new BorderLayout());
		
		right.add(new HistoryGraphView(), BorderLayout.CENTER);
		
		JPanel buttonPanel = new JPanel();
		JButton button = new JButton();
		button.setPreferredSize(new Dimension(100, 100));
		buttonPanel.add(button);
		right.add(buttonPanel, BorderLayout.SOUTH);
		
		right.setPreferredSize(new Dimension(250, 250));

		frame.add(right, BorderLayout.CENTER);

		frame.pack();
		frame.setVisible(true);
	}
	
	public void close() {
		frame.dispose();
	}

	public void addListener(WindowListener listener) {
		listeners.add(listener);
	}
}

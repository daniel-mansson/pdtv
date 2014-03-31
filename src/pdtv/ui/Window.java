package pdtv.ui;

import java.awt.BorderLayout;
import java.awt.Desktop;
import java.awt.Dimension;
import java.awt.GridBagConstraints;
import java.awt.GridBagLayout;
import java.awt.Insets;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.event.WindowAdapter;
import java.awt.event.WindowEvent;
import java.util.ArrayList;

import javax.swing.JButton;
import javax.swing.JFrame;
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
	Boolean snifferStopped = true;
	JButton snifferButton;
	
	public Window(Database database, Sniffer sniffer, WebServer webServer) {

		this.database = database;
		this.sniffer = sniffer;
		this.webServer = webServer;
		
		listeners = new ArrayList<WindowListener>();

		frame = new JFrame("packatrack backend");
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
		frame.setResizable(false);
		frame.setLayout(new GridBagLayout());
		GridBagConstraints constraints = new GridBagConstraints();

		JPanel bottom = new JPanel();
		bottom.setLayout(new BorderLayout());
		
		ServiceView snifferView = new ServiceView(sniffer); 
		snifferButton = snifferView.getButton();	
		snifferButton.setMargin(new Insets(0, 0, 0, 0));
		snifferButton.setText("Start");

		bottom.add(snifferView);

		SnifferDeviceView deviceView = new SnifferDeviceView(sniffer);
		constraints.gridy = 0;
		frame.add(deviceView, constraints);

		LocalIPView ipView = new LocalIPView(sniffer);
		constraints.gridy = 1;
		frame.add(ipView, constraints);
		
		StatusLabelView databaseStatusView = new StatusLabelView(database);
		constraints.gridy = 2;
		frame.add(databaseStatusView, constraints);

		StatusLabelView webStatusView = new StatusLabelView(webServer);
		constraints.gridy = 3;
		frame.add(webStatusView, constraints);
		
		JPanel buttonPanel = new JPanel();
		JButton button = new JButton();
		button.setPreferredSize(new Dimension(100, 50));
		button.setText("<html><body style='text-align:center'>Launch<br />packatrack</body></html>");
		button.addActionListener(new ActionListener() {		
			@Override
			public void actionPerformed(ActionEvent arg0) {
				Desktop desktop = Desktop.isDesktopSupported() ? Desktop.getDesktop() : null;
				if (desktop != null && desktop.isSupported(Desktop.Action.BROWSE)) {
			        try {
			            desktop.browse(webServer.getUri());
			        } catch (Exception e) {
			        }
			    }
			}
		});
		buttonPanel.add(button);
		bottom.add(buttonPanel, BorderLayout.EAST);

		constraints.gridy = 4;
		frame.add(bottom, constraints);

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

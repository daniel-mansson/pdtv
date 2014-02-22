package pdtv.ui;

import java.awt.event.WindowAdapter;
import java.awt.event.WindowEvent;
import java.util.ArrayList;

import javax.swing.JFrame;
import javax.swing.JLabel;

public class Window {

	JFrame frame;
	
	ArrayList<WindowListener> listeners;
	
	public Window() {
		
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

		JLabel label = new JLabel("This will contain some awesome stuff");
		frame.getContentPane().add(label);

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

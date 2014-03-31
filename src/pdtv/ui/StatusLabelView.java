package pdtv.ui;

import java.util.Observable;
import java.util.Observer;

import javax.swing.JLabel;
import javax.swing.JPanel;

import pdtv.main.Service;

public class StatusLabelView extends JPanel implements Observer {
	private static final long serialVersionUID = -3478044329499303375L;
	
	JLabel label;
	Service service;
	
	public StatusLabelView(Service service) {
		label = new JLabel();
		this.service = service;
		
		service.addObserver(this);		
		update(null, null);
		
		this.add(label);
	}
	
	@Override
	public void update(Observable arg0, Object arg1) {
		label.setText(service.getName() + ": " + service.getStatus());
	}
}

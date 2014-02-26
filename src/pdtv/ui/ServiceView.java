package pdtv.ui;

import java.awt.Dimension;
import java.util.Observable;
import java.util.Observer;

import javax.swing.JButton;
import javax.swing.JLabel;
import javax.swing.JPanel;

import pdtv.main.Service;

public class ServiceView extends JPanel implements Observer{
	private static final long serialVersionUID = 1L;
	JLabel messageLabel;
	Service service;

	public ServiceView(Service service) {
		this.service = service;
		
		JButton button = new JButton();
		button.setPreferredSize(new Dimension(50, 50));
		this.add(button);
		
		messageLabel = new JLabel("<html>" + service.getMessage() + "</html>");
		messageLabel.setPreferredSize(new Dimension(180, 50));
		this.add(messageLabel);
		
		service.addObserver(this);
		
		//update(null, null);
	}

	@Override
	public void update(Observable source, Object arg) {
		messageLabel.setText("<html>" + service.getStatus().toString() + "<br>" + service.getMessage() + "</html>");
	}
}

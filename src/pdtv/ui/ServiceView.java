package pdtv.ui;

import java.awt.Dimension;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.util.Observable;
import java.util.Observer;

import javax.swing.JButton;
import javax.swing.JLabel;
import javax.swing.JPanel;

import pdtv.main.Service;
import pdtv.main.Status;

public class ServiceView extends JPanel implements Observer{
	private static final long serialVersionUID = 1L;
	JLabel messageLabel;
	Service service;
	JButton button;

	public ServiceView(final Service service) {
		this.service = service;
		
		button = new JButton();
		button.setPreferredSize(new Dimension(50, 50));
		this.add(button);
		
		messageLabel = new JLabel("<html>" + service.getMessage() + "</html>");
		messageLabel.setPreferredSize(new Dimension(180, 50));
		this.add(messageLabel);
		
		service.addObserver(this);
		
		button.addActionListener(new ActionListener() {
			@Override
			public void actionPerformed(ActionEvent arg0) {
				if(service.getStatus() == Status.Stopped){
					service.start();
					button.setText("Stop");
				}
				else if(service.getStatus() == Status.Running){
					service.stop();
					button.setText("Start");
				}				
			}
        });  
		
		update(null, null);
	}

	@Override
	public void update(Observable source, Object arg) {
		messageLabel.setText("<html>" + service.getName() + ": " + service.getStatus().toString() + "<br>" + service.getMessage() + "</html>");
	}
	
	public JButton getButton() {
		return button;
	}
}

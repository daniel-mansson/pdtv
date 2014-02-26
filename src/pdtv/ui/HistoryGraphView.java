package pdtv.ui;

import java.awt.BorderLayout;
import java.awt.Color;

import javax.swing.BorderFactory;
import javax.swing.JPanel;

public class HistoryGraphView extends JPanel{
	private static final long serialVersionUID = 1L;

	public HistoryGraphView() {
		this.setBorder(BorderFactory.createEmptyBorder(25,25,25,25));
		this.setLayout(new BorderLayout());
		
		JPanel temp = new JPanel();
		temp.setBorder(BorderFactory.createLineBorder(new Color(0, 0, 0), 1));
		this.add(temp, BorderLayout.CENTER);
	}
}

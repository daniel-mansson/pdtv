package pdtv.main;

import java.util.Properties;

import pdtv.ui.Window;
import pdtv.ui.WindowListener;

public class Application implements WindowListener{
	
	Window window;
 
	public Application(Properties properties) {
		window = new Window();
		window.addListener(this);
	}
	
	public void start() {
		
		
	}

	@Override
	public void requestClose() {
		window.close();
	}
}

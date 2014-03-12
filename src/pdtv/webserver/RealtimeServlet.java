package pdtv.webserver;

import org.eclipse.jetty.websocket.servlet.WebSocketServlet;
import org.eclipse.jetty.websocket.servlet.WebSocketServletFactory;

public class RealtimeServlet extends WebSocketServlet {

	private static final long serialVersionUID = -2013598818880958386L;

	@Override
	public void configure(WebSocketServletFactory factory) {
		factory.register(RealtimeSocket.class);
	}
}

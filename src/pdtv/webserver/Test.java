package pdtv.webserver;

import java.io.File;
import java.io.IOException;

import org.eclipse.jetty.server.Handler;
import org.eclipse.jetty.server.Server;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.eclipse.jetty.server.handler.DefaultHandler;
import org.eclipse.jetty.server.handler.HandlerList;
import org.eclipse.jetty.servlet.ServletHolder;
import org.eclipse.jetty.webapp.WebAppContext;

public class Test {

	public static void main(String[] args) throws Exception {

		System.setProperty("DEBUG", "true");
		Server server = new Server(8080);
		
		WebAppContext webappcontext = new WebAppContext();
		webappcontext.setContextPath("/");

		File warPath = new File("/home/new/Documents/KTH/workspace/pdtv", "webapp");
		webappcontext.setWar(warPath.getAbsolutePath());
		HandlerList handlers = new HandlerList();
		webappcontext.addServlet(new ServletHolder(new HelloServlet()), "/hello");

		handlers.setHandlers(new Handler[] { webappcontext, new DefaultHandler() });
		server.setHandler(handlers);
		server.start();
	}

	public static class HelloServlet extends HttpServlet {
		private static final long serialVersionUID = 1L;

		public HelloServlet() {
		}

		protected void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {

			// logic

			try {
				request.getRequestDispatcher("/result.jsp").forward(request, response);
			}
			catch (Throwable e1) {
				e1.printStackTrace();
			}

		}
	}

}

package pdtv.main;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.util.Properties;

public class Main {

	public static void main(String[] args) {

		Properties prop = loadProperties("config/settings.properties");

		if (prop != null) {
			Application app = new Application(prop);
			app.start();
		}
	}

	private static Properties loadProperties(String pathname) {
		Properties prop = new Properties();

		try {
			prop.load(new FileInputStream(new File(pathname)));
		} catch (IOException e) {
			System.err.println("Error loading config file: " + e.getMessage());
			return null;
		}

		return prop;
	}

}

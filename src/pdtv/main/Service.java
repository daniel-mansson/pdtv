package pdtv.main;

import java.util.Observable;

public abstract class Service extends Observable{
	private Status status;
	private String message;
	private String error;
	
	public Service() {
		status = Status.Stopped;
		message = "";
		error = "";
	}
	
	public Status getStatus() {
		return status;
	}
	
	public void setStatus(Status status) {
		this.status = status;
		setChanged();
		notifyObservers();
	}
	
	public String getMessage() {
		return message;
	}
	
	public void setMessage(String message) {
		this.message = message;
		setChanged();
		notifyObservers();
	}
	
	public String getError() {
		return error;
	}
	
	public void setError(String error) {
		this.error = error;
	}
	
	public abstract boolean start();
	public abstract void stop();
	
}

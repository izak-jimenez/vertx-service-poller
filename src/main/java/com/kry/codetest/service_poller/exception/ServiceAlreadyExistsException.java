package com.kry.codetest.service_poller.exception;

public class ServiceAlreadyExistsException extends RuntimeException{
  public ServiceAlreadyExistsException(String serviceName) {
    super("Service: " + serviceName + " already exists. ");
  }
}

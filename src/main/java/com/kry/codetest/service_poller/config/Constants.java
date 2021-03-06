package com.kry.codetest.service_poller.config;

public final class Constants {
  public static final String SERVICE_DOCUMENT = "services";
  public static final Integer HTTP_PORT = 8080;
  public static final String BASE_URI = "localhost";
  public static final String EXTERNAL_SERVICES_ENDPOINT = "/external-services/api";
  public static final String SERVICE_POLLER_ENDPOINT = "/service-poller/api/services";
  public static final String POLLED_SERVICES_ENDPOINT = "/service-poller/api/polled-services";
  public static final Integer SERVICE_POLLER_INTERVAL = 1000;
  public static final String MONGODB_URI = System.getenv("MONGODB_URI");
  public static final String MONGODB_DATABASE = System.getenv("MONGODB_DATABASE");
}

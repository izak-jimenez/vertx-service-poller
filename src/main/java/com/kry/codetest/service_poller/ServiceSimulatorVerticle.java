package com.kry.codetest.service_poller;

import io.vertx.core.AbstractVerticle;
import io.vertx.core.Promise;
import io.vertx.core.impl.logging.Logger;
import io.vertx.core.impl.logging.LoggerFactory;

public class ServiceSimulatorVerticle extends AbstractVerticle {
  private static final Logger logger = LoggerFactory.getLogger(ServiceSimulatorVerticle.class);
  private static final int httpPort = Integer.parseInt(System.getenv().getOrDefault("HTTP_PORT", "8080"));

  @Override
  public void start(Promise<Void> startPromise) {

  }
}

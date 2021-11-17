package com.kry.codetest.service_poller;

import io.vertx.core.DeploymentOptions;
import io.vertx.core.Vertx;

public class Main {
  public static void main(String[] args) {
    Vertx vertx = Vertx.vertx();
    DeploymentOptions options = new DeploymentOptions();
    options.setInstances(1);

    vertx.deployVerticle("ServiceVerticle", options);
  }
}

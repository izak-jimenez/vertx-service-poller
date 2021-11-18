package com.kry.codetest.service_poller.service;

import com.kry.codetest.service_poller.ServiceVerticle;
import io.vertx.core.Promise;
import io.vertx.core.impl.logging.Logger;
import io.vertx.core.impl.logging.LoggerFactory;
import io.vertx.core.json.JsonArray;
import io.vertx.core.json.JsonObject;

import com.kry.codetest.service_poller.config.Constants;
import com.kry.codetest.service_poller.model.Service;
import com.kry.codetest.service_poller.repository.ServicesRepository;
import io.vertx.ext.web.RoutingContext;

public class ServicesService {
  private final ServicesRepository servicesRepository;

  private static final Logger logger = LoggerFactory.getLogger(ServiceVerticle.class);

  public ServicesService(ServicesRepository servicesRepository) {
    this.servicesRepository = servicesRepository;
  }

  public void createService(RoutingContext routingContext) {
    servicesRepository.getMongoClient().save(Constants.SERVICE_DOCUMENT, routingContext.getBodyAsJson(), result -> {
      if(result.succeeded()) {
        routingContext.response()
          .setStatusCode(200)
          .end(result.result());
      }
    });
  }

  public void findServiceByUuid(String uuid, RoutingContext routingContext) {
    JsonObject query = new JsonObject()
      .put("uuid", uuid);
    servicesRepository.getMongoClient().find(Constants.SERVICE_DOCUMENT, query, result -> {
      if (result.succeeded()) {
        JsonArray response = new JsonArray(result.result());
        routingContext.response()
          .putHeader("Content-Type", "application/json")
          .setStatusCode(200)
          .end(response.encodePrettily());
      } else {
        result.cause().printStackTrace();
      }
    });
  }

  public void getServices(RoutingContext routingContext) {
    servicesRepository.getMongoClient().find(Constants.SERVICE_DOCUMENT, new JsonObject(), result -> {
      if (result.succeeded()) {
        JsonArray response = new JsonArray(result.result());
        routingContext.response()
          .putHeader("Content-Type", "application/json")
          .setStatusCode(200)
          .end(response.encodePrettily());
      } else {
        result.cause().printStackTrace();
      }
    });
  }
}

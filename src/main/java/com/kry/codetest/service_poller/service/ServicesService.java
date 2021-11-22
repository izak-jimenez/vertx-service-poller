package com.kry.codetest.service_poller.service;

import com.kry.codetest.service_poller.ServiceVerticle;
import com.kry.codetest.service_poller.exception.ServiceAlreadyExistsException;
import io.vertx.core.Future;
import io.vertx.core.Promise;
import io.vertx.core.impl.logging.Logger;
import io.vertx.core.impl.logging.LoggerFactory;
import io.vertx.core.json.JsonArray;
import io.vertx.core.json.JsonObject;

import com.kry.codetest.service_poller.config.Constants;
import com.kry.codetest.service_poller.repository.ServicesRepository;
import io.vertx.ext.web.RoutingContext;

import java.time.LocalDateTime;
import java.util.UUID;

public class ServicesService {
  private final ServicesRepository servicesRepository;

  private static final Logger logger = LoggerFactory.getLogger(ServiceVerticle.class);

  public ServicesService(ServicesRepository servicesRepository) {
    this.servicesRepository = servicesRepository;
  }

  public Future<Void> createService(RoutingContext routingContext) {
    Promise<Void> promise = Promise.promise();
    JsonObject servicePayload = new JsonObject()
      .put("uuid", UUID.randomUUID().toString())
      .put("name", routingContext.getBodyAsJson().getValue("name"))
      .put("url", routingContext.getBodyAsJson().getValue("url"))
      .put("status", routingContext.getBodyAsJson().getValue("status"))
      .put("createdOn", LocalDateTime.now().toString())
      .put("modifiedOn", LocalDateTime.now().toString());

    JsonObject query = new JsonObject()
      .put("name", routingContext.getBodyAsJson().getValue("name"));
    servicesRepository.getMongoClient().find(Constants.SERVICE_DOCUMENT, query, result -> {
      if (result.succeeded()) {
        throw new ServiceAlreadyExistsException(routingContext.getBodyAsJson().getValue("name").toString());
      } else {
        result.cause().printStackTrace();
        servicesRepository.getMongoClient().save(Constants.SERVICE_DOCUMENT, servicePayload, createServiceResult -> {
          if (!createServiceResult.succeeded()) {
            logger.info("ERROR WHILE REGISTERING SERVICE: " + createServiceResult.cause().getMessage());
          }
          routingContext.response()
            .setStatusCode(200)
            .end(createServiceResult.result());
          promise.complete();
        });
      }
    });

    /*servicesRepository.getMongoClient().save(Constants.SERVICE_DOCUMENT, servicePayload, result -> {
      if(result.succeeded()) {
        routingContext.response()
          .setStatusCode(200)
          .end(result.result());
        promise.complete();
      } else {
        logger.info("ERROR WHILE REGISTERING SERVICE: " + result.cause().getMessage());
        routingContext.response()
          .setStatusCode(200)
          .end(result.result());
        promise.complete();
      }
    });*/
    return promise.future();
  }

  public Future<Void> updateService(RoutingContext routingContext) {
    Promise<Void> promise = Promise.promise();
    JsonObject query = new JsonObject()
      .put("uuid", routingContext.getBodyAsJson().getValue("uuid"));
    JsonObject update = new JsonObject().put("$set", new JsonObject()
      .put("name", routingContext.getBodyAsJson().getValue("name"))
      .put("url", routingContext.getBodyAsJson().getValue("url"))
      .put("modifiedOn", LocalDateTime.now().toString()));
    servicesRepository.getMongoClient().updateCollection(Constants.SERVICE_DOCUMENT, query, update, result -> {
      if(result.succeeded()) {
        routingContext.response()
          .setStatusCode(200)
          .end("Service successfully updated!");
        promise.complete();
      } else {
        logger.info("ERROR WHILE UPDATING SERVICE: " + result.cause().getMessage());
      }
    });
    return promise.future();
  }

  public Future<Void> deleteService(RoutingContext routingContext) {
    logger.info("UUID TO DELETE: " + routingContext.request().getParam("uuid"));
    Promise<Void> promise = Promise.promise();
    JsonObject query = new JsonObject()
      .put("uuid", routingContext.request().getParam("uuid"));
    servicesRepository.getMongoClient().removeDocuments(Constants.SERVICE_DOCUMENT, query, result -> {
      if(result.succeeded()) {
        routingContext.response()
          .setStatusCode(200)
          .end("Service successfully deleted!");
        promise.complete();
      } else {
        logger.info("ERROR WHILE DELETING SERVICE: " + result.cause().getMessage());
      }
    });
    return promise.future();
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

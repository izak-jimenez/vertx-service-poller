package com.kry.codetest.service_poller.repository;

import io.vertx.core.Vertx;
import io.vertx.core.json.JsonObject;
import io.vertx.ext.mongo.MongoClient;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ServicesRepository {
  private MongoClient mongoClient;

  public ServicesRepository(Vertx vertx, JsonObject config) {
    this.mongoClient = MongoClient.createShared(vertx, config);
  }
}

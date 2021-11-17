package com.kry.codetest.service_poller;

import com.kry.codetest.service_poller.config.Constants;
import com.kry.codetest.service_poller.model.Service;
import com.kry.codetest.service_poller.model.ServiceMap;
import com.kry.codetest.service_poller.repository.ServicesRepository;
import com.kry.codetest.service_poller.service.ServicesService;
import io.vertx.config.ConfigRetriever;
import io.vertx.config.ConfigStoreOptions;
import io.vertx.core.AbstractVerticle;
import io.vertx.core.Context;
import io.vertx.core.Promise;
import io.vertx.core.Vertx;
import io.vertx.core.impl.logging.Logger;
import io.vertx.core.impl.logging.LoggerFactory;
import io.vertx.core.json.JsonObject;
import io.vertx.ext.web.Router;
import io.vertx.ext.web.RoutingContext;
import io.vertx.ext.web.handler.BodyHandler;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

public class ServiceVerticle extends AbstractVerticle {
  private static final Logger logger = LoggerFactory.getLogger(ServiceVerticle.class);
  private static final int httpPort = Integer.parseInt(System.getenv().getOrDefault("HTTP_PORT", "8080"));

  private ServiceMap serviceMap;

  @Override
  public void start(Promise<Void> startPromise) {
    /*ConfigStoreOptions fileStore = new ConfigStoreOptions()
      .setType("file")
      .setOptional(true)
      .setConfig(new JsonObject().put("path", "config/config.json"));
    ConfigRetriever retriever = ConfigRetriever.create(vertx);*/

    JsonObject config = Vertx.currentContext().config();

    config.put("mongo_uri", "mongodb+srv://kry:JBE7E3hBtgkRrSoL@kry-cluster.ovhky.mongodb.net/krydb?retryWrites=true&w=majority");
    config.put("mongo_db", "krydb");

    JsonObject mongoConfig = new JsonObject()
      .put("connection_string", config.getString("mongo_uri"))
      .put("db_name", config.getString("mongo_db"));

    ServicesService servicesService = new ServicesService(new ServicesRepository(vertx, mongoConfig));

    serviceMap = new ServiceMap();

    fetchExternalServices(vertx, config, serviceMap);

    Router router = Router.router(vertx);
    router.route().handler(BodyHandler.create());

    router.get(Constants.SERVICE_POLLER_ENDPOINT + "/services").handler(servicesService::getServices);
    router.post(Constants.SERVICE_POLLER_ENDPOINT + "/services").handler(servicesService::createService);

    vertx.createHttpServer()
      .requestHandler(router)
      .listen(httpPort)
      .onSuccess(ok -> {
        logger.info("HTTP server running on http://localhost: " + httpPort);
        startPromise.complete();
      })
      .onFailure(startPromise::fail);
  }

  private void fetchExternalServices(Vertx vertx, JsonObject config, ServiceMap activeServices) {
    List<Service> services = new ArrayList<>();
    ServicesRepository servicesRepository = new ServicesRepository(vertx, config);
    servicesRepository.getMongoClient().find(Constants.SERVICE_DOCUMENT, new JsonObject(), result -> {
      if(result.succeeded()) {
        for(JsonObject serviceJson : result.result()) {
          services.add(serviceJson.mapTo(Service.class));
        }
        activeServices.registerActiveServices(services);
      }
    });
  }
}

package com.kry.codetest.service_poller;

import com.kry.codetest.service_poller.config.Constants;
import com.kry.codetest.service_poller.exception.ServiceAlreadyExistsException;
import com.kry.codetest.service_poller.model.Service;
import com.kry.codetest.service_poller.model.ServiceMap;
import com.kry.codetest.service_poller.repository.ServicesRepository;
import com.kry.codetest.service_poller.service.ServicesService;
import com.kry.codetest.service_poller.util.ServicePoller;
import io.vertx.core.AbstractVerticle;
import io.vertx.core.Future;
import io.vertx.core.Promise;
import io.vertx.core.Vertx;
import io.vertx.core.impl.logging.Logger;
import io.vertx.core.impl.logging.LoggerFactory;
import io.vertx.core.json.JsonArray;
import io.vertx.core.json.JsonObject;
import io.vertx.ext.web.Router;
import io.vertx.ext.web.client.WebClient;
import io.vertx.ext.web.handler.BodyHandler;

import java.util.ArrayList;
import java.util.List;

public class ServiceVerticle extends AbstractVerticle {
  private static final Logger logger = LoggerFactory.getLogger(ServiceVerticle.class);
  private static final int httpPort = Constants.HTTP_PORT;
  private static final String mongodbUri = Constants.MONGODB_URI;
  private static final String mongoDbDatabase = Constants.MONGODB_DATABASE;

  private ServiceMap serviceMap;

  private ServicePoller servicePoller;

  private List<Service> polledServices;

  @Override
  public void start(Promise<Void> startPromise) {
    JsonObject config = Vertx.currentContext().config();

    logger.info("MONGO URI: " + mongodbUri);
    logger.info("MONGO DB: " + mongoDbDatabase);

    config.put("mongo_uri", mongodbUri);
    config.put("mongo_db", mongoDbDatabase);

    JsonObject mongoConfig = new JsonObject()
      .put("connection_string", config.getString("mongo_uri"))
      .put("db_name", config.getString("mongo_db"));

    ServicesService servicesService = new ServicesService(new ServicesRepository(vertx, mongoConfig));

    Router router = Router.router(vertx);

    WebClient webclient = WebClient.create(vertx);

    initRouter(router, config, servicesService, webclient);

    vertx.setPeriodic(Constants.SERVICE_POLLER_INTERVAL, id -> {
      initRouter(router, config, servicesService, webclient);
    });

    vertx.createHttpServer()
      .requestHandler(router)
      .listen(httpPort)
      .onSuccess(ok -> {
        logger.info("HTTP server running on http://localhost: " + httpPort);
        startPromise.complete();
      })
      .onFailure(startPromise::fail);
  }

  private Future<Void> fetchExternalServices(Vertx vertx, JsonObject config, ServiceMap activeServices) {
    List<Service> services = new ArrayList<>();
    ServicesRepository servicesRepository = new ServicesRepository(vertx, config);
    Promise<Void> promise = Promise.promise();
    servicesRepository.getMongoClient().find(Constants.SERVICE_DOCUMENT, new JsonObject(), result -> {
      if(result.succeeded()) {
        logger.info("Found the following registered services: " + result.result());
        for(JsonObject serviceJson : result.result()) {
          services.add(serviceJson.mapTo(Service.class));
        }
        activeServices.registerActiveServices(services);
        promise.complete();
      }
    });
    return promise.future();
  }

  private void initRouter(Router router, JsonObject config, ServicesService servicesService, WebClient webclient) {
    this.serviceMap = new ServiceMap();
    this.servicePoller = new ServicePoller(serviceMap);
    router.clear();
    router.route().handler(BodyHandler.create());
    setServicePollerEndpoints(router, servicesService);
    fetchExternalServices(vertx, config, this.serviceMap)
      .onSuccess(result -> {
        generateExternalServicesRoutes(router, serviceMap);
        this.servicePoller.pollServicesTask(webclient).onSuccess(results -> {
          this.polledServices = results;
        });
      })
      .onFailure(error -> {
        logger.info("Error fetching external services.\nError message: " + error);
      });
  }

  private void generateExternalServicesRoutes(Router router, ServiceMap activeServices) {
    activeServices.getServicesStatusList().forEach((s, service) -> {
      router.get(Constants.EXTERNAL_SERVICES_ENDPOINT + service.getUrl()).handler(request -> {
        JsonObject dynamicResponse = JsonObject.mapFrom(service);
        request.response()
          .putHeader("Content-Type", "application/json")
          .setStatusCode(200)
          .end(dynamicResponse.encodePrettily());
      });
    });
  }

  private void setServicePollerEndpoints(Router router, ServicesService servicesService) {
    router.get(Constants.SERVICE_POLLER_ENDPOINT).handler(servicesService::getServices);
    router.get(Constants.POLLED_SERVICES_ENDPOINT).handler(request -> {
      JsonArray polledServicesResponse = new JsonArray(polledServices);
      request.response()
        .putHeader("Content-Type", "application/json")
        .setStatusCode(200)
        .end(polledServicesResponse.encodePrettily());
    });
    router.post(Constants.SERVICE_POLLER_ENDPOINT).handler(servicesService::createService);
    router.put(Constants.SERVICE_POLLER_ENDPOINT).handler(servicesService::updateService);
    router.delete(Constants.SERVICE_POLLER_ENDPOINT).handler(servicesService::deleteService);
    router.errorHandler(500, routingContext -> {
      if(routingContext.failure() instanceof ServiceAlreadyExistsException){
        JsonObject serviceAlreadyExistsError = new JsonObject()
          .put("timestamp", System.nanoTime())
          .put("error", routingContext.failure().getMessage());
        routingContext.response()
          .setStatusCode(409)
          .end(serviceAlreadyExistsError.encodePrettily());
      } else {
        routingContext.response().setStatusCode(400).end(new JsonObject().put("error", "An unknown error ocurred").encodePrettily());
      }
    });
  }
}

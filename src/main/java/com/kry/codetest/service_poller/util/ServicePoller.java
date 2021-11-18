package com.kry.codetest.service_poller.util;

import com.kry.codetest.service_poller.ServiceVerticle;
import com.kry.codetest.service_poller.config.Constants;
import com.kry.codetest.service_poller.model.Service;
import com.kry.codetest.service_poller.model.ServiceMap;
import io.vertx.core.Future;
import io.vertx.core.Promise;
import io.vertx.core.impl.logging.Logger;
import io.vertx.core.impl.logging.LoggerFactory;
import io.vertx.ext.web.client.WebClient;

import java.util.ArrayList;
import java.util.List;

public class ServicePoller {
  private static final Logger logger = LoggerFactory.getLogger(ServiceVerticle.class);
  private final ServiceMap runningServices;

  public ServicePoller(ServiceMap services) {
    this.runningServices = services;
  }

  public Future<List<Service>> pollServicesTask(WebClient webClient) {
    List<Service> services = new ArrayList<>();
    Promise<List<Service>> polledServices = Promise.promise();
    if(runningServices.getServicesStatusList().size() > 0) {
      runningServices.getServicesStatusList().forEach((s, service) -> {
        webClient.get(Constants.HTTP_PORT, Constants.BASE_URI, service.getUrl())
          .send()
          .onSuccess(response -> {
            logger.info("Successfully polled the " + service.getName() + " service with a " + service.getStatus() + " status.");
            services.add(service);
          }).onFailure(error -> {
            logger.info("Error communicating with the " + service.getName() + " service. \nError message: " + error);
          });
      });
    } else {
      logger.info("No running services found.");
    }
    polledServices.complete(services);
    return polledServices.future();
  }
}

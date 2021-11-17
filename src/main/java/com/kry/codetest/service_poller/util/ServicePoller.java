package com.kry.codetest.service_poller.util;

import com.kry.codetest.service_poller.model.ServiceMap;
import io.vertx.core.Promise;
import io.vertx.ext.web.Router;
import io.vertx.ext.web.RoutingContext;

import java.util.List;

public class ServicePoller {
  private ServiceMap services;

  public ServicePoller(ServiceMap services) {
    this.services = services;
  }

  public Promise<List<String>> pollServicesTask(Router router, RoutingContext routingContext) {
    if(services.getServicesStatusList().size() > 0) {
      router.get()
    }
  }
}

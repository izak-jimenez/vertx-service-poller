package com.kry.codetest.service_poller.service;

import io.vertx.core.json.JsonObject;

import com.kry.codetest.service_poller.config.Constants;
import com.kry.codetest.service_poller.model.Service;
import com.kry.codetest.service_poller.repository.ServicesRepository;

public class ServicesService {
  private final ServicesRepository servicesRepository;

  public ServicesService(ServicesRepository servicesRepository) {
    this.servicesRepository = servicesRepository;
  }

  public void createService(Service service) {
    servicesRepository.save(Constants.SERVICE_DOCUMENT, JsonObject.mapFrom(service));
  }
}

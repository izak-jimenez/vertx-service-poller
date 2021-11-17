package com.kry.codetest.service_poller.model;

import lombok.Getter;
import lombok.Setter;
import lombok.experimental.Accessors;

import java.util.HashMap;
import java.util.List;

@Getter
@Setter
@Accessors(chain = true)
public class ServiceMap {
  private HashMap<String, Service> servicesStatusList;

  public ServiceMap() {
    this.servicesStatusList = new HashMap<>();
  }

  public void registerActiveServices(List<Service> activeServices) {
    for(Service service : activeServices) {
      servicesStatusList.put(service.getName(), service);
    }
  }
}

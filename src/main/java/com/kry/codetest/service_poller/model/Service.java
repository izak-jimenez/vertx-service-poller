package com.kry.codetest.service_poller.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.Accessors;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@Accessors(chain = true)
@JsonIgnoreProperties(ignoreUnknown = true)
public class Service {
  private String uuid;
  private String name;
  private String url;
  private ServiceStatus status;
  private String createdOn;
  private String modifiedOn;
}

enum ServiceStatus {
  OK,
  FAIL
}

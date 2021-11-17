package com.kry.codetest.service_poller.model;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.Accessors;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@Accessors(chain = true)
public class Service {
  private Integer uuid;
  private String name;
  private String url;
  private ServiceStatus status;
  private LocalDateTime createdOn;
  private LocalDateTime modifiedOn;
}

enum ServiceStatus {
  OK,
  FAIL
}

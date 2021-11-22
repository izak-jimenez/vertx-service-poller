export const localApiPort = 3000
export const apiPort = 8080
export const apiBaseUri = 'http://localhost'

export const serviceStatus = {
  ok: 'OK',
  fail: 'FAIL'
}

export const servicesRefreshRate = 1000

export const regex = {
  serviceNameRegex: '^[a-zA-Z0-9]',
  endpointNameRegex: '^\/[a-zA-Z]{4,16}((-?[a-zA-Z]{4,16})?)*$'
}
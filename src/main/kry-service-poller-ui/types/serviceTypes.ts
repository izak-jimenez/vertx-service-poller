export interface IServiceCard {
  serviceUUID: string
  serviceName: string
  serviceUrl: string
  serviceStatus: string
  serviceCreationDate: Date
}

export interface IService {
  uuid: string
  name: string
  url: string
  status: string
  createdOn: Date
  modifiedOn: Date
}

export interface IServiceCard {
  serviceUUID: string
  serviceName: string
  serviceUrl: string
  serviceStatus: string
  serviceCreationDate: Date
}

export interface IService {
  uuid?: string | undefined
  name: string
  url: string
  status: string
  createdOn?: Date | undefined
  modifiedOn?: Date | undefined
}

export interface ICreateNewServiceModal {
  isOpen: boolean
  onOpen: () => void
  onClose: () => void
  newServiceDataHandler: Function
}

export interface IUpdateServiceModal {
  isOpen: boolean
  onOpen: () => void
  onClose: () => void
  updateServiceDataHandler: Function
  service: IService | undefined
  updateServicesHandler: Function
}

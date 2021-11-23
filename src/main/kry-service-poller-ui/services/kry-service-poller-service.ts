import { endpoints } from "../config"
import { IService } from "../types"
import { servicesHttpClient } from "./httpService"

export const getPolledServices = async () => {
  try {
    const response = await servicesHttpClient.get(endpoints.listServicesEndpoint)
    if (response.status === 200) {
      const services: IService[] = response.data
      return response
    }
  } catch (error) {
    console.log('An unexpected error ocurred:', error)
  }
}

export const addService = async (service: IService) => {
  try {
    const response = await servicesHttpClient.post(endpoints.createServiceEndpoint, service)
    if (response.status === 200) {
      const createdService = response.data
      return createdService
    }
  } catch(error: any){
    console.log('An unexpected error ocurred: ', error.status)
  }
}

export const updateService = async (service: IService) => {
  try {
    const response = await servicesHttpClient.put(endpoints.updateServiceEndpoint, service)
    if (response.status === 200) {
      const updatedService: string = response.data
      return updatedService
    }
  } catch(error){
    console.log('An unexpected error ocurred: ', error)
  }
}

export const deleteService = async (serviceUuid: string) => {
  try {
    const response = await servicesHttpClient.delete(`${endpoints.deleteServiceEndpoint}?uuid=${serviceUuid}`)
    if (response.status === 200) {
      const deletedService: string = response.data
      return deletedService
    }
  } catch(error){
    console.log('An unexpected error ocurred: ', error)
  }
}

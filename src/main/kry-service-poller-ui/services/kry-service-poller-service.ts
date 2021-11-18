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
      const createdService: number = response.data
      return response
    }
  } catch(error){
    console.log('An unexpected error ocurred: ', error)
  }
}

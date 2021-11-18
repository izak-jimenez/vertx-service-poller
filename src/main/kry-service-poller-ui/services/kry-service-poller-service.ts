import { endpoints } from "../config"
import { IService } from "../types"
import { servicesHttpClient } from "./httpService"

export const getPolledServices = async () => {
  try {
    const response = await servicesHttpClient.get(endpoints.kryServicePollerListEndpoint)
    if (response.status === 200) {
      const services: IService[] = response.data
      return response
    }
  } catch (error) {
    console.log('An unexpected error happened:', error)
  }
}

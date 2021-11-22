import axios from 'axios'
import { apiBaseUri, apiPort, localApiPort } from '../config'

export const externalServicesHttpClient = axios.create({baseURL: `${apiBaseUri}:${apiPort}`})

export const servicesHttpClient = axios.create({baseURL: `${apiBaseUri}:${localApiPort}`})
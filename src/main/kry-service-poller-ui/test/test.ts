import chai, { expect } from 'chai'
import chaiHttp from 'chai-http'
import nock from 'nock'
import { apiBaseUri, endpoints, localApiPort } from '../config'
import {
  addService,
  deleteService,
  getPolledServices,
  updateService
} from '../services/kry-service-poller-service'
import { IService } from '../types'

chai.use(chaiHttp)

console.log('Running integration tests suite...')

const tmpServiceName = `Chai Test Service`
const tmpServiceUrl = `/chai-test-service`

describe('KRY SERVICE POLLER API - /api/kry-service-poller/list resource', async () => {
  it('Should make a GET request to the /list resource and receive a response with the current registered services', async () => {
    const mockedServicesResponse = [
      {
        uuid: '01c7fd3b-7b32-4f74-8deb-4cbae5308830',
        name: 'Payments Service',
        url: '/payments',
        status: 'OK'
      },
      {
        uuid: 'ca327544-ebbe-4e96-a251-c11aa8aedbbc',
        name: 'Orders Service',
        url: '/orders',
        status: 'FAIL'
      },
      {
        uuid: '5009937e-40ea-4f80-9cd7-7fb11b32dfdf',
        name: 'Logging Service',
        url: '/logging',
        status: 'OK'
      }
    ]

    nock(`${apiBaseUri}:${localApiPort}`)
      .get(`${endpoints.listServicesEndpoint}`)
      .reply(200, mockedServicesResponse)

    const activeServicesResponse = await getPolledServices()

    const services = activeServicesResponse?.data
    const status = activeServicesResponse?.status
    expect(status).to.equals(200)
    expect(services).to.be.an('array').of.length.greaterThanOrEqual(0)
    services?.forEach((service: IService) => {
      expect(service).to.haveOwnProperty('uuid')
      expect(service).to.haveOwnProperty('name')
      expect(service).to.haveOwnProperty('url')
      expect(service).to.haveOwnProperty('status')
    })
  })
})

describe('KRY SERVICE POLLER API - /api/kry-service-poller/create resource', async () => {
  it('Should make a POST request to the /create resource and receive a response with the newly created service ID', async () => {
    const mockCreatedServiceId = '619b1d255064682c70ad02b8'

    const newService: IService = {
      name: tmpServiceName,
      url: tmpServiceUrl,
      status: 'OK'
    }

    nock(`${apiBaseUri}:${localApiPort}`)
      .post(`${endpoints.createServiceEndpoint}`)
      .reply(200, mockCreatedServiceId)

    const createdServiceResponse = await addService(newService)

    expect(createdServiceResponse).to.be.string
    expect(createdServiceResponse)
      .to.be.a('string')
      .of.length(mockCreatedServiceId.length)
  })
})

describe('KRY SERVICE POLLER API - /api/kry-service-poller/update resource', async () => {
  it('Should make a PUT request to the /update resource and receive a successful response', async () => {
    const mockUpdatedServiceResponse = 'Service successfully updated!'

    const serviceToUpdate: IService = {
      uuid: '5009937e-40ea-4f80-9cd7-7fb11b32dfdf',
      name: 'Logging Service Updated',
      url: '/logging',
      status: 'OK'
    }

    nock(`${apiBaseUri}:${localApiPort}`)
      .put(`${endpoints.updateServiceEndpoint}`)
      .reply(200, mockUpdatedServiceResponse)

    const updatedServiceResponse = await updateService(serviceToUpdate)

    expect(updatedServiceResponse).to.be.string
    expect(updatedServiceResponse)
      .to.be.a('string')
      .eq(mockUpdatedServiceResponse)
  })
})

describe('KRY SERVICE POLLER API - /api/kry-service-poller/delete resource', async () => {
  it('Should make a DELETE request to the /delete resource and receive a successful response', async () => {
    const mockDeletedServiceResponse = 'Service successfully deleted!'

    const mockedServicesResponse = [
      {
        uuid: '01c7fd3b-7b32-4f74-8deb-4cbae5308830',
        name: 'Payments Service',
        url: '/payments',
        status: 'OK'
      },
      {
        uuid: 'ca327544-ebbe-4e96-a251-c11aa8aedbbc',
        name: 'Orders Service',
        url: '/orders',
        status: 'FAIL'
      }
    ]

    nock(`${apiBaseUri}:${localApiPort}`)
      .delete(
        `${endpoints.deleteServiceEndpoint}?uuid=5009937e-40ea-4f80-9cd7-7fb11b32dfdf`
      )
      .reply(200, mockDeletedServiceResponse)

    const deletedServiceResponse = await deleteService(
      '5009937e-40ea-4f80-9cd7-7fb11b32dfdf'
    )

    expect(deletedServiceResponse)
      .to.be.a('string')
      .eq(mockDeletedServiceResponse)

    nock(`${apiBaseUri}:${localApiPort}`)
      .get(`${endpoints.listServicesEndpoint}`)
      .reply(200, mockedServicesResponse)

    const updatedServicesList = await getPolledServices()

    expect(updatedServicesList?.status).to.be.eq(200)
    expect(updatedServicesList?.data).to.be.an('array')
    const registeredServiceUuids: string[] = []
    updatedServicesList?.data.array?.forEach((service: IService) => {
      service?.uuid ? registeredServiceUuids.push(service?.uuid) : null
    })
    expect(registeredServiceUuids).to.not.include(
      '5009937e-40ea-4f80-9cd7-7fb11b32dfdf'
    )
  })
})

export {}

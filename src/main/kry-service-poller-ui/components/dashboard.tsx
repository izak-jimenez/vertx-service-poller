import {
  Container,
  Box,
  Heading,
  Text,
  SimpleGrid,
  Center
} from '@chakra-ui/layout'
import { Spinner } from '@chakra-ui/spinner'
import { useDisclosure } from '@chakra-ui/hooks'
import { useState } from 'react'
import { useQuery, QueryClient, QueryClientProvider } from 'react-query'
import { Divider, ServiceCard, AppBar } from '.'
import { servicesRefreshRate, serviceStatus } from '../config'
import {
  getPolledServices,
  updateService
} from '../services/kry-service-poller-service'
import { IService } from '../types'
import { UpdateServiceModal } from './form'

const queryClient = new QueryClient()

const AutoRefreshDashboard = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Dashboard />
    </QueryClientProvider>
  )
}

const Dashboard = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [intervalMs, setIntervalMs] = useState(servicesRefreshRate)
  const [services, setServices] = useState<IService[] | undefined>(undefined)
  const [loading, setLoading] = useState<Boolean>(true)
  const [selectedService, setSelectedService] = useState<IService | undefined>(
    undefined
  )
  const [noRegisteredServices, setNoRegisteredServices] =
    useState<Boolean>(false)

  const fetchPolledServices = async () => {
    const polledServices = await getPolledServices()
    console.log('POLLED SERVICES: ', polledServices?.data)
    const polledServicesList: IService[] = polledServices?.data
    if (polledServicesList.length === 0) {
      setNoRegisteredServices(true)
      setLoading(false)
    }
    if (polledServicesList.length > 0) {
      setServices(polledServicesList)
      setNoRegisteredServices(false)
      setLoading(false)
    }
  }

  const { status, data, error, isFetching } = useQuery(
    'polledServices',
    async () => {
      await fetchPolledServices()
      return
    },
    {
      refetchInterval: intervalMs
    }
  )

  const handleServiceClick = (service: IService) => {
    console.log('SELECTED SERVICE: ', service)
    onOpen()
    setSelectedService(service)
  }

  const updateServiceHandler = async (
    serviceUuid: string,
    serviceName: string,
    serviceUrl: string
  ) => {
    const updatedService: IService = {
      uuid: serviceUuid,
      name: serviceName,
      url: serviceUrl,
      status: serviceStatus.ok
    }
    const updatedServiceResponse = await updateService(updatedService)
    console.log('UPDATED SERVICE ID: ', updatedServiceResponse?.data)
  }

  return (
    <Container maxW="3xl" paddingTop={[4, 6, 12, 24]}>
      <Box>
        <Center>
          <Heading fontSize="3xl">Kry Service Monitor</Heading>
        </Center>
        <Divider height={40} />
        <AppBar />
        <Divider height={40} />
        <Box>
          {loading ? (
            <Center>
              <Spinner color="white" />
            </Center>
          ) : !noRegisteredServices ? (
            <SimpleGrid columns={[1, 1, 3]} spacing={4}>
              {services &&
                services.map((service) => (
                  <Box
                    key={service.uuid}
                    onClick={() => handleServiceClick(service)}
                  >
                    <ServiceCard
                      key={service.uuid}
                      serviceUUID={service.uuid ?? ''}
                      serviceName={service.name}
                      serviceUrl={service.url}
                      serviceStatus={service.status}
                      serviceCreationDate={service.createdOn ?? new Date()}
                    />
                  </Box>
                ))}
            </SimpleGrid>
          ) : (
            <Center>
              <Text>No Registered Services Found</Text>
            </Center>
          )}
        </Box>
      </Box>
      <UpdateServiceModal
        isOpen={isOpen}
        onOpen={onOpen}
        onClose={onClose}
        service={selectedService}
        updateServiceDataHandler={updateServiceHandler}
      />
    </Container>
  )
}

export default AutoRefreshDashboard

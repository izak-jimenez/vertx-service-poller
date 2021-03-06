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
import { useSnackbar } from 'notistack'
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
  const { enqueueSnackbar, closeSnackbar } = useSnackbar()

  const fetchPolledServices = async () => {
    const polledServices = await getPolledServices()
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
    if (updatedServiceResponse) {
      enqueueSnackbar('Service updated successfully', { variant: 'success' })
    }
    await fetchPolledServices()
  }

  return (
    <Container maxW="4xl" paddingTop={[4, 6, 12, 24]}>
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
        updateServicesHandler={fetchPolledServices}
      />
    </Container>
  )
}

export default AutoRefreshDashboard

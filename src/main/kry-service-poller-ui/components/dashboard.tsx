import {
  Container,
  Box,
  Heading,
  Text,
  SimpleGrid,
  Center
} from '@chakra-ui/layout'
import { useEffect, useState } from 'react'
import { Divider, ServiceCard } from '.'
import { getPolledServices } from '../services/kry-service-poller-service'
import { IService } from '../types'

const Dashboard = () => {
  const [services, setServices] = useState<IService[] | undefined>(undefined)

  const fetchPolledServices = async () => {
    const polledServices = await getPolledServices()
    console.log('POLLED SERVICES: ', polledServices?.data)
    const polledServicesList: IService[] = polledServices?.data
    setServices(polledServicesList)
  }

  useEffect(() => {
    fetchPolledServices()
  }, [])

  return (
    <Container paddingTop={[4, 6, 12, 24]}>
      <Box>
        <Center>
          <Heading fontSize="3xl">Kry Service Monitor</Heading>
        </Center>
        <Divider height={40} />
        <Box>
          <SimpleGrid columns={[1, 1, 2]} spacing={4}>
            {services &&
              services.map((service) => (
                <ServiceCard
                  key={service.uuid}
                  serviceUUID={service.uuid}
                  serviceName={service.name}
                  serviceUrl={service.url}
                  serviceStatus={service.status}
                  serviceCreationDate={service.createdOn}
                />
              ))}
          </SimpleGrid>
        </Box>
      </Box>
    </Container>
  )
}

export default Dashboard

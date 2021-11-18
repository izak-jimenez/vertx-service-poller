import { Box, Heading, Text, SimpleGrid, Center } from '@chakra-ui/layout'
import { ReactElement } from 'react'
import { FaCircle } from 'react-icons/fa'
import { IServiceCard } from '../types'

const ServiceCard = ({
  serviceUUID,
  serviceName,
  serviceUrl,
  serviceStatus,
  serviceCreationDate
}: IServiceCard): ReactElement => {
  return (
    <Box
      key={serviceUUID}
      width="100%"
      bg="#74B1EA"
      p="5"
      textAlign="center"
      borderRadius={8}
      boxShadow="lg"
      _hover={{
        transition: 'all .3s ease-in-out',
        transform: 'scale(1.025)',
        cursor: 'pointer'
      }}
    >
      <Center>
        <SimpleGrid columns={1}>
          <Text fontSize="xl" fontWeight={600}>
            {serviceName}
          </Text>
          <Text fontSize="md" fontWeight={400}>
            {`URL: ${serviceUrl}`}
          </Text>
          <Center>
            <SimpleGrid columns={2} spacing={2}>
              <Text fontSize="md" fontWeight={400}>
                {`Status: ${serviceStatus}`}
              </Text>
              {serviceStatus === 'OK' ? (
                <FaCircle style={{ color: 'green' }} />
              ) : (
                <FaCircle style={{ color: 'red' }} />
              )}
            </SimpleGrid>
          </Center>
          <Text fontSize="md" fontWeight={400}>
            {`Created on: ${serviceCreationDate}`}
          </Text>
        </SimpleGrid>
      </Center>
    </Box>
  )
}

export default ServiceCard

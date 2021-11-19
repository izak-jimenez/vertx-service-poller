import {
  Box,
  Heading,
  Text,
  SimpleGrid,
  Center,
  Container,
  Stack
} from '@chakra-ui/layout'
import { ScaleFade } from '@chakra-ui/react'
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
    <ScaleFade initialScale={0.9} in={true}>
      <Box
        key={serviceUUID}
        width="100%"
        bg="#74B1EA"
        p="5"
        borderRadius={8}
        boxShadow="lg"
        _hover={{
          transition: 'all .3s ease-in-out',
          transform: 'scale(1.025)',
          cursor: 'pointer'
        }}
      >
        <SimpleGrid columns={1}>
          <Text fontSize="xl" fontWeight={600}>
            {serviceName}
          </Text>
          <Box>
            <Stack direction="row" spacing={2}>
              <Text fontSize="md" fontWeight={400}>
                {`Status: ${serviceStatus}`}
              </Text>
              {serviceStatus === 'OK' ? (
                <FaCircle style={{ color: 'green', marginTop: 3 }} />
              ) : (
                <FaCircle style={{ color: 'red', marginTop: 3 }} />
              )}
            </Stack>
          </Box>
          <Text fontSize="md" fontWeight={400}>
            {`URL: ${serviceUrl}`}
          </Text>
          <Text fontSize="md" fontWeight={400}>
            {`Created on: ${serviceCreationDate}`}
          </Text>
        </SimpleGrid>
      </Box>
    </ScaleFade>
  )
}

export default ServiceCard

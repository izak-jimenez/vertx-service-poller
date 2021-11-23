import { Box, Center, Stack, Button } from '@chakra-ui/react'
import { useDisclosure } from '@chakra-ui/hooks'
import { useSnackbar } from 'notistack'
import { addService } from '../services/kry-service-poller-service'
import { CreateNewServiceModal } from './form'
import { IService } from '../types'
import { serviceStatus } from '../config'

const AppBar = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { enqueueSnackbar, closeSnackbar } = useSnackbar()
  const createNewServiceHandler = async (
    serviceName: string,
    serviceUrl: string
  ) => {
    const newService: IService = {
      name: serviceName,
      url: serviceUrl,
      status: serviceStatus.ok
    }
    const createdService = await addService(newService)
    if (createdService) {
      enqueueSnackbar('Service created successfully!', { variant: 'success' })
    }
  }

  return (
    <>
      <Box>
        <Center>
          <Stack direction="row" spacing={4}>
            <Box>
              <Button onClick={onOpen}>Add New Service</Button>
            </Box>
          </Stack>
        </Center>
      </Box>
      <CreateNewServiceModal
        isOpen={isOpen}
        onOpen={onOpen}
        onClose={onClose}
        newServiceDataHandler={createNewServiceHandler}
      />
    </>
  )
}

export default AppBar

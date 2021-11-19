import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  Stack,
  Box,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter
} from '@chakra-ui/react'
import { useState, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { Divider } from '..'
import { deleteService } from '../../services/kry-service-poller-service'
import { IUpdateServiceModal } from '../../types'

const UpdateServiceModal = ({
  isOpen,
  onClose,
  updateServiceDataHandler,
  service,
  updateServicesHandler
}: IUpdateServiceModal) => {
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors, isSubmitting }
  } = useForm()

  const [open, setOpen] = useState(false)
  const close = () => setOpen(false)
  const cancelRef = useRef<any>()

  const onSubmit = (values: { serviceName: string; serviceUrl: string }) => {
    const { serviceName, serviceUrl } = values
    updateServiceDataHandler(service?.uuid, serviceName, serviceUrl)
    reset()
    onClose()
  }

  const onCloseHandler = () => {
    reset()
    onClose()
  }

  const handleConfirmDeleteService = async () => {
    const deletedService = await deleteService(service?.uuid ?? '')
    await updateServicesHandler()
    close()
    onClose()
  }

  return (
    <>
      <Modal isOpen={isOpen} size="md" onClose={onCloseHandler} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Update Service</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={handleSubmit(onSubmit)}>
              <FormControl isInvalid={errors.serviceName}>
                <FormLabel htmlFor="serviceName">Service name</FormLabel>
                <Input
                  id="serviceName"
                  placeholder="Service name..."
                  defaultValue={service?.name}
                  {...register('serviceName', {
                    required: 'The service name is required',
                    minLength: {
                      value: 4,
                      message: 'Service name minimum length should be 4'
                    }
                  })}
                />
                <FormErrorMessage>
                  {errors.serviceName && errors.serviceName.message}
                </FormErrorMessage>
              </FormControl>
              <Divider height={20} />
              <FormControl isInvalid={errors.serviceUrl}>
                <FormLabel htmlFor="serviceUrl">Service URL</FormLabel>
                <Input
                  id="serviceUrl"
                  placeholder="Service URL..."
                  defaultValue={service?.url}
                  {...register('serviceUrl', {
                    required: 'The service URL is required',
                    minLength: {
                      value: 4,
                      message: 'Service URL minimum length should be 4'
                    }
                  })}
                />
                <FormErrorMessage>
                  {errors.serviceUrl && errors.serviceUrl.message}
                </FormErrorMessage>
              </FormControl>
              <Stack direction="row" spacing={3}>
                <Button
                  mt={4}
                  colorScheme="blue"
                  isLoading={isSubmitting}
                  type="submit"
                >
                  Update Service
                </Button>
                <Button
                  style={{ marginTop: 15 }}
                  colorScheme="red"
                  onClick={() => setOpen(true)}
                >
                  Delete Service
                </Button>
              </Stack>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
      <AlertDialog
        isOpen={open}
        leastDestructiveRef={cancelRef}
        onClose={close}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Service
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure? You can't undo this action afterwards.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={close}>
                Cancel
              </Button>
              <Button
                colorScheme="red"
                onClick={handleConfirmDeleteService}
                ml={3}
              >
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  )
}

export default UpdateServiceModal

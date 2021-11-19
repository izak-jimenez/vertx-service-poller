import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input
} from '@chakra-ui/react'
import { useForm } from 'react-hook-form'
import { Divider } from '..'
import { ICreateNewServiceModal } from '../../types'

const CreateNewServiceModal = ({
  isOpen,
  onClose,
  newServiceDataHandler
}: ICreateNewServiceModal) => {
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors, isSubmitting }
  } = useForm()

  const onSubmit = (values: { serviceName: string; serviceUrl: string }) => {
    const { serviceName, serviceUrl } = values
    newServiceDataHandler(serviceName, serviceUrl)
    reset()
    onClose()
  }

  return (
    <Modal isOpen={isOpen} size="md" onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Register New Service</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FormControl isInvalid={errors.serviceName}>
              <FormLabel htmlFor="serviceName">Service name</FormLabel>
              <Input
                id="serviceName"
                placeholder="Service name..."
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
            <Button
              mt={4}
              colorScheme="blue"
              isLoading={isSubmitting}
              type="submit"
            >
              Register Service
            </Button>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export default CreateNewServiceModal

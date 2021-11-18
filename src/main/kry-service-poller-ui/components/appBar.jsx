import { Button } from '@chakra-ui/button'
import { Box, Center, Stack } from '@chakra-ui/layout'

const AppBar = () => {
  return (
    <Box>
      <Center>
        <Stack direction="row" spacing={4}>
          <Box>
            <Button>Add New Service</Button>
          </Box>
        </Stack>
      </Center>
    </Box>
  )
}

export default AppBar

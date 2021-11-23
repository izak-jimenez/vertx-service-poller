import '../styles/globals.css'
import '@fontsource/nunito-sans/400.css'
import '@fontsource/nunito-sans/600.css'
import '@fontsource/nunito-sans/700.css'
import type { AppProps } from 'next/app'
import { ChakraProvider } from '@chakra-ui/react'
import { SnackbarProvider } from 'notistack'
import theme from '../config/theme'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SnackbarProvider>
      <ChakraProvider theme={theme}>
        <Component {...pageProps} />
      </ChakraProvider>
    </SnackbarProvider>
  )
}

export default MyApp

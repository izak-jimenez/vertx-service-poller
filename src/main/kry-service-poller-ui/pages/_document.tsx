import { ColorModeScript } from '@chakra-ui/react'
import React from 'react'
import NextDocument, { Html, Head, Main, NextScript } from 'next/document'
import theme from '../config/theme'

export default class Document extends NextDocument {
  render() {
    return (
      <Html lang="en">
        <Head />
        <body>
          <ColorModeScript initialColorMode={theme.config.initialColorMode} />
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

/* Document.getInitialProps = async (ctx) => {
  const originalRenderPage = ctx.renderPage

  ctx.renderPage = () => originalRenderPage({})

  const initialProps = await Document.getInitialProps(ctx)

  return {
    ...initialProps,
    styles: [...React.Children.toArray(initialProps.styles)]
  }
} */

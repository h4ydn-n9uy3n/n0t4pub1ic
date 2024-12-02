import type { AppProps } from 'next/app'
import { Toaster } from 'sonner'
import { SessionProvider } from 'next-auth/react'
import '../styles/globals.css'

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
      <Toaster position="top-center" />
    </SessionProvider>
  )
}

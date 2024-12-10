import type { AppProps } from 'next/app'
import { Toaster } from 'sonner'
import { ErrorBoundary } from 'react-error-boundary'
import Head from 'next/head';
import '../styles/globals.css'

function ErrorFallback({ error }: { error: Error }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Something went wrong
        </h1>
        <p className="text-gray-600 mb-8">
          {error.message}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
        >
          Refresh Page
        </button>
      </div>
    </div>
  );
}

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Head>
        <title>localhost</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main>
        <Component {...pageProps} />
      </main>
      <Toaster position="top-center" />
    </ErrorBoundary>
  )
}

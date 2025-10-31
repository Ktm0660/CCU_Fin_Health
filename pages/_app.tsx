import '../styles/globals.css';
import type { AppProps } from 'next/app';
import Layout from '@/components/Layout';
import ErrorBoundary from '@/components/ErrorBoundary';

// Preserve existing providers if you have them; keep Layout outermost so header is everywhere.
export default function App({ Component, pageProps }: AppProps) {
  return (
    <Layout>
      <ErrorBoundary>
        <Component {...pageProps} />
      </ErrorBoundary>
    </Layout>
  );
}

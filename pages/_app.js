import Layout from '../components/Layout'
import {Provider} from 'next-auth/client'
import '../styles/globals.scss'

function MyApp({ Component, pageProps }) {
  return (
    <Provider session={pageProps.session}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </Provider>
  ) 
}

export default MyApp

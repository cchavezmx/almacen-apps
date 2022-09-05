import '../styles/globals.css'
import Layout from '../mui/Layout.jsx'
import { SWRConfig } from 'swr'

const fetcher = (...args) => fetch(...args).then(res => res.json())

function MyApp({ Component, pageProps }) {
  return (
    <>
      <SWRConfig value={{ fetcher }}>
        <Layout headerName="Almacén" >
          <Component {...pageProps} />
        </Layout>
      </SWRConfig>
    </>
    )
}

export default MyApp

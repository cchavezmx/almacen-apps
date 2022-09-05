import '../styles/globals.css'
import Layout from '../mui/Layout.jsx'
import { SWRConfig } from 'swr'
import { UserProvider } from '@auth0/nextjs-auth0';

const fetcher = (...args) => fetch(...args).then(res => res.json())

function MyApp({ Component, pageProps }) {

  const { user } = pageProps

  return (
    <>

      <SWRConfig value={{ fetcher }}>
        <UserProvider user={user}>
          <Layout headerName="Almacén" >
            <Component {...pageProps} />
          </Layout>
        </UserProvider>
      </SWRConfig>
    </>
    )
}


MyApp.getInitialProps = async (appContext) => {
  let pageProps = {}
  const env = process.env.VERCEL_ENV
  if (env === 'preview') {
    pageProps = {
      user: {
        name: 'Carlos Chavez',
        email: 'cchavezmx@outlook.com'
      },
      env
    }
  }

  return { pageProps }
}

export default MyApp

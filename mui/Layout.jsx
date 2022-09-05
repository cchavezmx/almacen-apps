import Head from 'next/head'
import Header from './Header.jsx'
import { withPageAuthRequired } from '@auth0/nextjs-auth0'

const Layout = ({ children, headerName }) => {
  return (
    <div className="flex flex-col justify-between">
      <Head>
        <title>Control Fletes</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="w-screen">
        <Header headerName={headerName} />
      </div>
      <main className="w-screen container mx-auto">
        {children}
      </main>
    <footer className="footer">
      {/* <div className="w-screen h-[4rem] bg-[#1a3c57]">
      </div> */}
    </footer>
    </div>
  )
}

export default withPageAuthRequired(Layout)
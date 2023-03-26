import '@/styles/globals.css'
import type { Session } from "next-auth"
import { SessionProvider } from "next-auth/react"
import type { AppProps } from 'next/app'
import NavBar from '../../components/NavBar'

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps<{ session: Session }>) {
  return (
    <SessionProvider session={session}>
      <div className="bg-neutral-900 min-h-screen">
        <NavBar />
        <div className="md:px-10 lg:px-14 max-w-screen-xl px-4 py-6 mx-auto">
          <Component {...pageProps} />
        </div>
      </div>
    </SessionProvider >
  )
}

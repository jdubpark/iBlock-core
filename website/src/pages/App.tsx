import clsx from 'clsx'
import { Location } from 'history'
import React, {
  lazy, Suspense, useEffect, useState,
} from 'react'
import { Helmet } from 'react-helmet'
import {
  Redirect, Route, Switch, useLocation,
} from 'react-router-dom'

import ErrorBoundary from '../components/ErrorBoundary'
import Notification from '../components/Notification'
import Web3ReactManager from '../components/Web3ReactManager'
import useRouter from '../hooks/useRouter'
import Header from '../layouts/Header'

/* Page Imports */
const AccountHome = lazy(() => import('./account/Home'))
const DecentralizedAppHome = lazy(() => import('./decen/Home'))
const ExplorerHome = lazy(() => import('./explorer/Home'))

type WrapperProps = {
  children: JSX.Element | JSX.Element[],
}

const AppWrapper = ({ children }: WrapperProps) => (<div className="flex flex-col items-start h-auto min-h-screen w-screen max-w-screen">{children}</div>)

const HeaderWrapper = ({ children }: WrapperProps) => (<div className="flex md:flex-nowrap justify-between w-full t-0 z-50">{children}</div>)

const Loader = () => <span />

export default function App(): JSX.Element {
  const location = useLocation<Location>()
  const [isDecenApp, setIsDecenApp] = useState<boolean>(false)
  const [isMarketplace, setIsMarketplace] = useState<boolean>(false)

  useRouter(() => {
    window.scrollTo(0, 0)
  })

  useEffect(() => {
    setIsDecenApp(location.pathname.startsWith('/app'))
    setIsMarketplace(location.pathname.startsWith('/marketplace'))
  }, [location.pathname])

  const BodyWrapper = ({ children }: WrapperProps) => (
    <div
      className={clsx('w-full pb-10 z-10', isDecenApp && 'h-auto min-h-screen')}
      style={{
        // background: 'radial-gradient(50% 50% at 50% 50%, rgba(252, 7, 125, 6%) 0%, rgba(255, 255, 255, 0) 100%)',
        // #FF552E20 ==> #FF552E at 20% opacity
        ...(isDecenApp && { background: 'radial-gradient(50% 50% at 50% 50%, #FF552E20, #FF552E05 100%)' }),
        ...(isMarketplace && { background: 'radial-gradient(50% 50% at 50% 50%, #3772FF20,#3772FF05 100%)' }),
      }}
    >
      {children}
    </div>
  )

  return (
    <ErrorBoundary>
      <Helmet>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta charSet="utf-8" />
        <meta name="description" content="The Disruption Lab at UIUC presents an industry-leading Proof-of-Authority blockchain system with ERC-20 tokens, ERC-1155 NFT marketplace, and innovative dApps." />
        <title>iBlock at UIUC</title>
        <link rel="canonical" href="https://iblockcore.com" />
      </Helmet>
      <Web3ReactManager>
        <AppWrapper>
          <Notification />
          {/* <Popups /> */}
          {/* <TopLevelModals /> */}
          <HeaderWrapper>
            <Header />
          </HeaderWrapper>
          <ErrorBoundary>
            <BodyWrapper>
              <Suspense fallback={<Loader />}>
                <Switch>
                  {/* Landing Page */}
                  {/* <Route exact strict path="/" component={lazy(() => import('./explorer/Home'))} /> */}
                  <Route exact strict path="/">
                    <Redirect from="*" to="/explorer" />
                  </Route>
                  {/* Explorer (doesn't require Wallet connection) */}
                  <Route path="/explorer">
                    <ExplorerHome />
                  </Route>
                  {/* Decentralized App (requires Wallet connection) */}
                  <Route path="/app">
                    <DecentralizedAppHome />
                  </Route>
                  {/* Learning Center (doesn't require Wallet connection) */}
                  {/* NFT Marketplace */}
                  {/* <Route exact sensitive strict path="/marketplace" component={lazy(() => import('./marketplace/NFTMarketplace'))} /> */}
                  {/* <Route exact sensitive strict path="/marketplace/createNFT" component={lazy(() => import('./marketplace/CreateNFT'))} /> */}
                  {/* <Route exact sensitive strict path="/marketplace/creatorDashboard" component={lazy(() => import('./marketplace/CreatorDashboard'))} /> */}
                  {/* <Route exact sensitive strict path="/marketplace/nftDashboard" component={lazy(() => import('./marketplace/NFTDashboard'))} /> */}
                  {/* Merch Shop */}
                  <Route exact sensitive strict path="/shop" component={lazy(() => import('./marketplace/Home'))} />
                  <Route exact sensitive strict path="/shop/product/:id" component={lazy(() => import('./marketplace/Product'))} />
                  <Route exact sensitive strict path="/shop/cart" component={lazy(() => import('./marketplace/Cart'))} />
                  <Route path="/marketplace/">
                    {/* case-insensitive to case-sensitive redirect */}
                    <Redirect from="*" to="/marketplace" />
                  </Route>
                  {/* Account & Sign In */}
                  <Route exact sensitive strict path="/signin" component={lazy(() => import('./universal/SignIn'))} />
                  <Route path="/account">
                    <AccountHome />
                  </Route>
                  {/* 404 */}
                  <Route>
                    <Redirect from="*" to="/" />
                  </Route>
                </Switch>
              </Suspense>
            </BodyWrapper>
          </ErrorBoundary>
          {/* {!(isMobile() && mobileMenuVisible) && <Footer />} */}
        </AppWrapper>
      </Web3ReactManager>
    </ErrorBoundary>
  )
}

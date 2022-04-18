import React from 'react'
import { Helmet } from 'react-helmet'
import {
  Redirect, Route, Switch, useRouteMatch,
} from 'react-router-dom'

import Container from '../../components/Container'
import useActiveWeb3React from '../../hooks/useActiveWeb3React'
import { switchChainForMetaMask } from '../../hooks/web3'
import Interact from './Interact'
import Transfer from './Transfer'
import Swap from './Swap'
import Wallet from './Wallet'

export default function DecentralizedAppHome() {
  const { active } = useActiveWeb3React()
  const { path } = useRouteMatch() // path = /app

  if (active) {
    // Ignore promise for this function
    switchChainForMetaMask()
  }

  return (
    <>
      <Helmet>
        <title>App - iBlock by DLab</title>
      </Helmet>

      <section className="relative w-full pt-16 md:pt-24 pb-10 overflow-hidden z-20">
        <Container className="justify-start items-center space-y-4">
          <Switch>
            <Route exact sensitive strict path={path}>
              <Swap />
            </Route>
            {/* swap ==> home */}
            <Route exact sensitive strict path={`${path}/swap`}>
              <Redirect from="*" to={path} />
            </Route>
            <Route exact sensitive strict path={`${path}/transfer`}>
              <Transfer />
            </Route>
            {/* Interact has subpages, so remove `exact` and `strict` flags */}
            <Route sensitive path={`${path}/interact`}>
              <Interact />
            </Route>
            <Route exact sensitive strict path={`${path}/wallet`}>
              <Wallet />
            </Route>
            {/* Catch all other urls & redirect to /app */}
            <Route>
              <Redirect from="*" to="/app" />
            </Route>
          </Switch>
        </Container>
      </section>
    </>
  )
}

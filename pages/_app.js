import { useEffect } from 'react';

import TreeView from '../source/components/tree/TreeView';

import MyCollector from '../source/components/general/MyCollector';

import ProtectLinks from '../source/components/general/ProtectLinks';

import BigWrapper from '../source/components/general/BigWrapper';

import NavBar from '../source/components/general/NavBar';

import { processCookies } from '../source/controllers/GeneralCtrl';

import Message from '../source/controllers/Messages/Message';

import Authenticator from '../source/components/general/Authenticator';

import NextjsProgressbar from 'nextjs-progressbar';

import { Provider } from 'react-redux'

import GlobalStyles from '../source/beautify/GlobalStyles'

import store from '../source/store/store'

import HeadTag from '../source/components/general/HeadTag';


const MyApp = ({ Component, pageProps }) => {

  useEffect(() => { processCookies() }, []) // Queries user for permisission to use cookies

  return (

    <Provider store={store}>

      {/* <HeadTag crawl="none" /> */}

      <GlobalStyles />

      <NextjsProgressbar color='#4472c3' />

      <Authenticator />

      <BigWrapper>

        <NavBar />

        <MyCollector>

          <TreeView />

          <Component {...pageProps} />

        </MyCollector>

      </BigWrapper>

      <Message />

    </Provider>

  )

}

export default MyApp;

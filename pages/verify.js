import HeadTag from '../source/components/general/HeadTag'

import { siteName } from '../source/__env'

import VerifyPage from '../source/components/verify/VerifyPage'


const verify = () => {

  return (

    <>

      <HeadTag description={`Login or sign up into ${siteName}`} />

      <VerifyPage />

    </>

  )

}

export default verify

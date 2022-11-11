import HeadTag from '../source/components/general/HeadTag'

import { siteName } from '../source/__env'

import VerifyPage from '../source/components/verify/VerifyPage'
import ProtectLinks from '../source/components/general/ProtectLinks'


const verify = () => {

  return (

    <>

      <HeadTag description={`Welcome to ${siteName}. We are a note keeping application, signup and keep your notes with us. Your notes can also be made public for others to view without access to your account" Login or sign up into ${siteName}`} crawl={true} />

      <ProtectLinks />

      <VerifyPage />

    </>

  )

}

export default verify

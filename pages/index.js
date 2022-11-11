import AuthControl from '../source/components/general/AuthControl'
import HeadTag from '../source/components/general/HeadTag'
import ProtectLinks from '../source/components/general/ProtectLinks'

import NotePage from '../source/components/note/NotePage'


const IndexPage = () => {

  return (

    <>

      <ProtectLinks />

      <HeadTag crawl="none" />

      <AuthControl>

        <NotePage noteID="welcome" />

      </AuthControl>

    </>

  )

}

export default IndexPage

import AuthControl from '../../source/components/general/AuthControl'
import HeadTag from '../../source/components/general/HeadTag'
import ProtectLinks from '../../source/components/general/ProtectLinks'

import NewSectionX from '../../source/components/section/NewSection'



const NewSection = () => {

  return (

    <>

      <ProtectLinks />

      <HeadTag crawl="none" />

      <AuthControl>

        <NewSectionX />

      </AuthControl>


    </>

  )

}

export default NewSection

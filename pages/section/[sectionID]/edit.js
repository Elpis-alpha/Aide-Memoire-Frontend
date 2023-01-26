import AuthControl from '../../../source/components/general/AuthControl'
import HeadTag from '../../../source/components/general/HeadTag'
import ProtectLinks from '../../../source/components/general/ProtectLinks'
import EditSection from '../../../source/components/section/EditSection'

const SectionView = ({ sectionID }) => {

  return (

    <>

      <ProtectLinks />

      <HeadTag crawl="none" />

      <AuthControl>

        <EditSection sectionID={sectionID} />

      </AuthControl>


    </>

  )

}

export const getServerSideProps = async ({ params }) => {

  const sectionID = params.sectionID

  return {

    props: { sectionID }

  }

}

export default SectionView
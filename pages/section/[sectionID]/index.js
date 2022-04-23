import HeadTag from '../../../source/components/general/HeadTag'

import SectionPage from '../../../source/components/section/SectionPage'


const SectionView = ({ sectionID }) => {

  return (

    <>

      <HeadTag />

      <SectionPage sectionID={sectionID} />

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
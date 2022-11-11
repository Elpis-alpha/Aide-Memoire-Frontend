import AuthControl from '../../../source/components/general/AuthControl'
import HeadTag from '../../../source/components/general/HeadTag'

import ProtectLinks from '../../../source/components/general/ProtectLinks'

import EditNoteX from '../../../source/components/note/EditNote'


const EditNote = ({ noteID }) => {

  return (

    <>

      <ProtectLinks />

      <HeadTag crawl="none" />

      <AuthControl>

        <EditNoteX noteID={noteID} />

      </AuthControl>

    </>

  )

}

export const getServerSideProps = async ({ params }) => {

  const noteID = params.noteID

  return {

    props: {

      noteID

    }

  }

}
export default EditNote
import AuthControl from '../../../source/components/general/AuthControl'
import HeadTag from '../../../source/components/general/HeadTag'

import ProtectLinks from '../../../source/components/general/ProtectLinks'

import NotePage from '../../../source/components/note/NotePage'


const NoteHome = ({ noteID }) => {

  return (

    <>

      <ProtectLinks />

      <HeadTag crawl="none" />

      <AuthControl>

        <NotePage noteID={noteID} />

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

export default NoteHome
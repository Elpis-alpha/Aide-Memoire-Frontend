import AuthControl from '../../../source/components/general/AuthControl'
import HeadTag from '../../../source/components/general/HeadTag'

import ProtectLinks from '../../../source/components/general/ProtectLinks'

import NoteSettingsX from '../../../source/components/note/NoteSettings'


const NoteSettings = ({ noteID }) => {

  return (

    <>

      <ProtectLinks />

      <HeadTag crawl="none" />

      <AuthControl>

        <NoteSettingsX noteID={noteID} />

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

export default NoteSettings
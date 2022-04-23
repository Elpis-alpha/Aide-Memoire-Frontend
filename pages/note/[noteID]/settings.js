import HeadTag from '../../../source/components/general/HeadTag'

import NoteSettingsX from '../../../source/components/note/NoteSettings'


const NoteSettings = ({ noteID }) => {

  return (

    <>

      <HeadTag />

      <NoteSettingsX noteID={noteID} />

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
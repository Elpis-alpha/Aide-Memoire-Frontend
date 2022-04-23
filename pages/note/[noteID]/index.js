import HeadTag from '../../../source/components/general/HeadTag'

import NotePage from '../../../source/components/note/NotePage'


const NoteHome = ({ noteID }) => {

  return (

    <>

      <HeadTag />

      <NotePage noteID={noteID} />

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
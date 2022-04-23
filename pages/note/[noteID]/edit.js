import HeadTag from '../../../source/components/general/HeadTag'

import EditNoteX from '../../../source/components/note/EditNote'


const EditNote = ({ noteID }) => {

  return (

    <>

      <HeadTag />

      <EditNoteX noteID={noteID} />

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
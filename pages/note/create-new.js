import HeadTag from '../../source/components/general/HeadTag'

import CreateNoteX from '../../source/components/note/CreateNote'



const CreateNote = () => {

  return (

    <>

      <HeadTag />

      <CreateNoteX note={{ heading: "I am a new note" }} />

    </>

  )

}


export default CreateNote
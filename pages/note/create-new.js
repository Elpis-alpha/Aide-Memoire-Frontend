import AuthControl from '../../source/components/general/AuthControl'
import HeadTag from '../../source/components/general/HeadTag'

import ProtectLinks from '../../source/components/general/ProtectLinks'

import CreateNoteX from '../../source/components/note/CreateNote'



const CreateNote = () => {

  return (

    <>

      <ProtectLinks />

      <HeadTag crawl="none" />

      <AuthControl>

        <CreateNoteX note={{ heading: "I am a new note" }} />

      </AuthControl>


    </>

  )

}


export default CreateNote
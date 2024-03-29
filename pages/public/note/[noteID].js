import { getPublicNote } from '../../../source/api'
import HeadTag from '../../../source/components/general/HeadTag'
import { getApiJson } from '../../../source/controllers/APICtrl'
import PubNote from '../../../source/components/note/PubNote'
import ProtectLinks from '../../../source/components/general/ProtectLinks'


const PubNoteHome = ({ note, keysX }) => {

  return (

    <>

      <ProtectLinks />

      <HeadTag title={note.name} description={note.description} keywords={keysX} crawl={true} />

      <PubNote note={note} />

    </>

  )

}


export const getServerSideProps = async ({ params }) => {

  const noteID = params.noteID

  const pubNote = await getApiJson(getPublicNote(noteID))

  if (pubNote.error) return { notFound: true }

  return {

    props: {

      note: pubNote,

      keysX: pubNote.tags.map(tag => tag.name).concat(pubNote.tags.map(tag => `#${tag.name}`))

    }

  }

}

export default PubNoteHome
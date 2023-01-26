import { getPublicSectionNote } from "../../../../source/api"
import HeadTag from "../../../../source/components/general/HeadTag"
import ProtectLinks from "../../../../source/components/general/ProtectLinks"
import PublicNote from "../../../../source/components/section/public/PublicNote"
import { getApiJson } from "../../../../source/controllers/APICtrl"

const PubNoteHome = ({ note, section }) => {

	return (

		<>

			<ProtectLinks />

			<HeadTag title={note.name} description={note.description} crawl={true} />

			<PublicNote {...{ note, section }} />

		</>

	)

}


export const getServerSideProps = async ({ params }) => {

	const noteID = params.noteID

	const sectionID = params.sectionID

	const pubNote = await getApiJson(getPublicSectionNote(sectionID, noteID))

	if (pubNote.error) return { notFound: true }

	const { section, note } = pubNote

	return {

		props: { note, section }

	}

}

export default PubNoteHome
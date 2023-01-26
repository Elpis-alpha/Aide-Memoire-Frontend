import { getPublicSection } from "../../../source/api"
import HeadTag from "../../../source/components/general/HeadTag"
import { getApiJson } from "../../../source/controllers/APICtrl"
import ProtectLinks from "../../../source/components/general/ProtectLinks"
import PublicSection from "../../../source/components/section/public/PublicSection"

const PubSection = ({ section }) => {
	return (
		<>

			<ProtectLinks />

			<HeadTag title={section.name} description={section.description} crawl={true} />

			<PublicSection section={section} />

		</>
	)
}

export const getServerSideProps = async ({ params }) => {

	const sectionID = params.sectionID

	const pubSection = await getApiJson(getPublicSection(sectionID))

	if (pubSection.error) return { notFound: true }

	return {

		props: {

			section: pubSection

		}

	}

}

export default PubSection
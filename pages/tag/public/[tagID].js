import { getTagByID, getTagNotesNA } from '../../../source/api'

import HeadTag from '../../../source/components/general/HeadTag'

import { getApiJson } from '../../../source/controllers/APICtrl'

import PubTagPage from '../../../source/components/tag/PubTagPage'


const TagView = ({ tag, notes }) => {

  return (

    <>

      <HeadTag keywords={[tag.name]} />

      <PubTagPage {...{ tag, notes }} />

    </>

  )

}

export const getServerSideProps = async ({ params }) => {

  const tagID = params.tagID

  const tag = await getApiJson(getTagByID(tagID))

  let notes = await getApiJson(getTagNotesNA(tag._id))

  return {

    props: { tag, notes }

  }

}

export default TagView
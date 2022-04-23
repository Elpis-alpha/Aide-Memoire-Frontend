import { getTagByID } from '../../../source/api'

import HeadTag from '../../../source/components/general/HeadTag'

import TagPage from '../../../source/components/tag/TagPage'

import { getApiJson } from '../../../source/controllers/APICtrl'


const TagView = ({ tag }) => {

  return (

    <>

      <HeadTag />

      <TagPage pace="private" tag={tag} />

    </>

  )

}

export const getServerSideProps = async ({ params }) => {

  const tagID = params.tagID

  const tag = await getApiJson(getTagByID(tagID))

  return {

    props: { tag }

  }

}

export default TagView
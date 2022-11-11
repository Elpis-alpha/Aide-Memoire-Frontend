import { getTagByID } from '../../../source/api'
import AuthControl from '../../../source/components/general/AuthControl'

import HeadTag from '../../../source/components/general/HeadTag'
import ProtectLinks from '../../../source/components/general/ProtectLinks'

import TagPage from '../../../source/components/tag/TagPage'

import { getApiJson } from '../../../source/controllers/APICtrl'


const TagView = ({ tag }) => {

  return (

    <>

      <ProtectLinks />

      <HeadTag crawl="none" />

      <AuthControl>

        <TagPage pace="private" tag={tag} />

      </AuthControl>


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
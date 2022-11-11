import { getQNote } from '../../source/api'

import HeadTag from '../../source/components/general/HeadTag'
import ProtectLinks from '../../source/components/general/ProtectLinks'

import SearchPage from '../../source/components/search/SearchPage'

import { getApiJson } from '../../source/controllers/APICtrl'



const TagView = ({ q, notes }) => {

  return (

    <>

      <ProtectLinks />

      <HeadTag keywords={[q].concat(notes.map(n => n.name))} crawl={true} title={`Search for "${q}"`} description={`A search for all public and self-private notes that contains the word/letter "${q}"`} />

      <SearchPage {...{ q, notes }} />

    </>

  )

}

export const getServerSideProps = async ({ query }) => {

  const q = query.q

  const notes = await getApiJson(getQNote(q.trim().toLowerCase()))

  return {

    props: { q, notes }

  }

}

export default TagView
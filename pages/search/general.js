import { getQNote } from '../../source/api'

import HeadTag from '../../source/components/general/HeadTag'

import SearchPage from '../../source/components/search/SearchPage'

import { getApiJson } from '../../source/controllers/APICtrl'



const TagView = ({ q, notes }) => {

  return (

    <>

      <HeadTag keywords={[q].concat(notes.map(n => n.name))} crawl={true} />

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
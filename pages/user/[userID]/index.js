import AuthControl from '../../../source/components/general/AuthControl'
import HeadTag from '../../../source/components/general/HeadTag'
import ProtectLinks from '../../../source/components/general/ProtectLinks'

import UserPageX from '../../../source/components/user/UserPage'


const UserPage = ({ user }) => {

  return (

    <>

      <ProtectLinks />

      <HeadTag crawl="none" />

      <AuthControl>

        <UserPageX user={user} />

      </AuthControl>


    </>

  )

}

export const getServerSideProps = async ({ params }) => {

  const userID = params.userID

  return {

    props: {

      user: {

        heading: 'A user to view and edit using text inputs',

        _id: userID

      }

    }

  }

}

export default UserPage

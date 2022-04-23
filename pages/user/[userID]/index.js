import HeadTag from '../../../source/components/general/HeadTag'

import UserPageX from '../../../source/components/user/UserPage'


const UserPage = ({ user }) => {

  return (

    <>

      <HeadTag />

      <UserPageX user={user} />

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

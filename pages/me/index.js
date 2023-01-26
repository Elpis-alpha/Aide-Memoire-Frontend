import { useSelector } from 'react-redux'
import AuthControl from '../../source/components/general/AuthControl'
import HeadTag from '../../source/components/general/HeadTag'
import ProtectLinks from '../../source/components/general/ProtectLinks'

import UserPageX from '../../source/components/user/UserPage'


const UserPage = () => {

  const { data: userData } = useSelector(store => store.user)

  return (

    <>

      <ProtectLinks />

      <HeadTag crawl="none" />

      <AuthControl>

        <UserPageX  />

      </AuthControl>


    </>

  )

}

export default UserPage

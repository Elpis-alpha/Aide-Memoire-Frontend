import { useEffect } from 'react'

import styled from 'styled-components'

import Cookies from 'universal-cookie'

import { getUser } from '../../api'

import { useDispatch, useSelector } from 'react-redux'

import { setUserData, setUserTest } from '../../store/slice/userSlice'

import { siteName } from '../../__env'

import { getApiJson } from '../../controllers/APICtrl'


const InitialLoader = ({ status }) => {

  const dispatch = useDispatch()

  const { revealView } = useSelector(store => store.display)

  useEffect(() => {

    const configureAide = async () => {

      // Start tracking time
      const timeNow = performance.now()

      const cookies = new Cookies()

      const token = cookies.get('aide-user-token') ? cookies.get('aide-user-token') : cookies.get('user-token')

      if (!cookies.get('aide-user-token') && cookies.get('user-token')) {

        cookies.set('aide-user-token', token, { path: '/', expires: new Date(90 ** 7) })

        cookies.remove('user-token', { path: '/' })

      }

      let userData = undefined

      // Fetch and Validate user
      if (token !== undefined) {

        try {

          userData = await getApiJson(getUser())

          userData.token = token

        } catch (e) { userData = undefined }

      }

      // End the Wait
      const timeEnd = performance.now()

      const remainingTime = 1500 - (timeEnd - timeNow)

      if (remainingTime > 1) { await new Promise(resolve => setTimeout(resolve, remainingTime)) }


      // Set data accordinly
      if (userData) { if (!userData.error) { dispatch(setUserData(userData)) } else { dispatch(setUserTest(true)) } }

      else { dispatch(setUserTest(true)) }

    }

    configureAide()

  }, [dispatch])

  if (status === "none") { return <></> }

  return (

    <InitLoaderStyle className={status !== 'remove' ? status : (revealView ? status : 'show')}>

      <div>

        <div className="image-pack">

          <img src="/logo.png" alt="logo" />

        </div>

        <h1>My {siteName}</h1>

      </div>

    </InitLoaderStyle>

  )

}

const InitLoaderStyle = styled.div`
  position: fixed;
  top: 0; bottom: 0;
  right: 0; width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f4f4f4;
  color: black;
  z-index: 20;
  overflow: hidden;
  box-shadow: 0 0 5px 0 black;

  @keyframes slide-out {
    from{top: 0; bottom: 0;}
    to{top: 110%; bottom: 110%;}
  }

  .image-pack{
    max-width: 45%;
    max-height: 45vh;
    margin: 0 auto;
    display: flex;
    align-items: stretch;
    justify-content: center;

    img{
      display: block;
      max-width: 100%;
      max-height: 100%;
      object-fit: contain;
    }

  }

  h1{
    font-size: 3pc;
    line-height: 3pc;
    padding: 3pc 0;
    text-align: center;
    font-family: Styled;
  }
    
  &.remove{
    animation: slide-out .7s ease-in 1;
    top: 110%; bottom: 110%;
  }
`

export default InitialLoader

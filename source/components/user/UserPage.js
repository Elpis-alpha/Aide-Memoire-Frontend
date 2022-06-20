import { Oval } from "react-loader-spinner"

import { patchApiJson, postApiJson, deleteApiJson } from "../../controllers/APICtrl"

import { useDispatch, useSelector } from "react-redux"

import { FaEnvelope } from "react-icons/fa"

import { useRouter } from "next/router"

import { useEffect, useState } from "react"

import styled from "styled-components"

import { editUser, deleteUser, sendVerificationEmail } from "../../api"

import { sendMiniMessage, sendXMessage } from "../../controllers/MessageCtrl"

import { datetoDateStr, datetoFullTimeStr, waitFor } from "../../controllers/TimeCtrl"

import NoteName from "./user-settings/NoteName"

import NoteSections from "./user-settings/NoteSections"

import NoteTags from "./user-settings/NoteTags"

import { removeUserData, setUserData } from "../../store/slice/userSlice"

import UserPassword from "./user-settings/UserPassword"

import Cookie from "universal-cookie"

import { authLink } from "../../__env"


const UserPage = () => {

  const router = useRouter()

  const cookies = new Cookie()

  const dispatch = useDispatch()

  const { divider } = useSelector(store => store.display)

  const { data: userData } = useSelector(store => store.user)

  const [loadingUser, setLoadingUser] = useState(false)

  const [loadingText, setLoadingText] = useState("Deleting User")

  const [userName, setUserName] = useState(userData.name)

  const [userBio, setUserBio] = useState(userData.biography)

  const getWidth = divider => 100 - parseInt(divider) + '%'

  const keyDownHandler = async (e, func) => {

    if (e.keyCode === 13) {

      e.target.blur()

      if (func) {

        await func()

      }

    }

  }

  const saveThisName = async () => {

    if (userName === userData.name) return false

    if (userName.trim() === "") return false

    sendMiniMessage({

      icon: { name: "loading", style: {} },

      content: { text: "Renaming User!", style: {} },

      style: {}

    })

    const newName = await patchApiJson(editUser(), {

      name: userName.trim()

    })

    if (newName.error) {

      sendMiniMessage({

        icon: { name: "times", style: {} },

        content: { text: "An Error Occured!", style: {} },

        style: {}

      }, 2000)

    } else {

      dispatch(setUserData({ ...userData, ...newName }))

      sendMiniMessage({

        icon: { name: "ok", style: {} },

        content: { text: "Name Changed!", style: {} },

        style: {}

      }, 2000)

    }

  }

  const saveThisBio = async () => {

    console.log('fsd');

    if (userBio === userData.biograpghy) return false

    if (userBio.trim() === "") return false

    sendMiniMessage({

      icon: { name: "loading", style: {} },

      content: { text: "Changing Bio!", style: {} },

      style: {}

    })

    const newName = await patchApiJson(editUser(), {

      biography: userBio.trim()

    })

    if (newName.error) {

      sendMiniMessage({

        icon: { name: "times", style: {} },

        content: { text: "An Error Occured!", style: {} },

        style: {}

      }, 2000)

    } else {

      dispatch(setUserData({ ...userData, ...newName }))

      sendMiniMessage({

        icon: { name: "ok", style: {} },

        content: { text: "Bio Changed!", style: {} },

        style: {}

      }, 2000)

    }

  }

  const sendVeriMail = async () => {

    const res = await sendXMessage({

      heading: { text: "Resend Verification Mail", style: {} },

      content: { text: `Proceed to resend a verification mail to this email: "${userData.email}"` },

      buttons: [

        { text: 'Proceed', waitFor: 'se', style: { backgroundColor: 'darkred' } },

        { text: 'Go Back', waitFor: 're', style: { backgroundColor: '#607d8b' } },

      ],

    })

    if (res !== "se") return false

    sendMiniMessage({

      icon: { name: "loading", style: {} },

      content: { text: "Sending Mail!", style: {} },

      style: {}

    })

    const veri = await postApiJson(sendVerificationEmail(), {})

    if (veri.error) {

      sendMiniMessage({

        icon: { name: "times", style: {} },

        content: { text: "An Error Occured!", style: {} },

        style: {}

      }, 2000)

    } else {

      sendMiniMessage({

        icon: { name: "ok", style: {} },

        content: { text: "Mail Sent!", style: {} },

        style: {}

      }, 2000)

    }

  }

  const convertDate = date => {

    return datetoDateStr(new Date(date)) + ", " + datetoFullTimeStr(new Date(date))

  }

  const deleteUserX = async () => {

    const res = await sendXMessage({

      heading: { text: "Delete Account !!!", style: { color: 'red' } },

      content: { text: "Note that this action is completely irreversible, all your notes and sections will be deleted as well as your public notes", style: { color: 'red' } },

      buttons: [

        { text: 'Yes Delete', waitFor: 'se', style: { backgroundColor: 'darkred' } },

        { text: 'Go Back', waitFor: 're', style: { backgroundColor: '#607d8b' } },

      ],

    })

    if (res !== "se") return false

    setLoadingText("Deleting User")

    setLoadingUser(true)

    await deleteApiJson(deleteUser(), undefined)

    cookies.remove('user-token', { path: '/' })

    dispatch(removeUserData())

    router.push(authLink)

  }

  useEffect(() => {

    console.log(userData);

  }, [userData])

  // ! Delete

  return (

    <UserPageStyle style={{ width: getWidth(divider), left: divider }}>

      {!loadingUser && <div className="user-sett-pack">

        <div className="intro">

          <h1>Hello {userData.name}</h1>

        </div>

        <div className="form-pack">

          <label htmlFor="el-aid-sect-name">Name</label>

          <div className="inp-hol">

            <input type="text" id="el-aid-sect-name" name="el-aid-sect-name" value={userName}

              onInput={e => setUserName(e.target.value)} onBlur={saveThisName} onKeyDown={e => keyDownHandler(e)} />

          </div>

        </div>

        <div className="form-pack">

          <label htmlFor="el-aid-sect-pb">Email</label>

          <div className="inp-hol">

            {userData.verify ?

              <input type="text" id="el-aid-sect-pb" name="el-aid-sect-pb" value={userData.email + ` (verified)`} readOnly style={{ color: "green" }} />

              :

              <input type="text" id="el-aid-sect-pb" name="el-aid-sect-pb" value={userData.email + ` (Not Verified)`} readOnly style={{ color: "red" }} />

            }

            {userData.verify ? <></> :

              <button className="rt-sd-btn-ab" onClick={sendVeriMail} title="Resend Verification Mail"><FaEnvelope size="1rem" color="darkblue" /></button>

            }

          </div>

        </div>

        <div className="form-pack">

          <label htmlFor="el-aid-sect-desc">Biography</label>

          <div className="inp-hol">

            <textarea id="el-aid-sect-desc" name="el-aid-sect-desc" value={userBio}

              onInput={e => setUserBio(e.target.value)} onBlur={saveThisBio}></textarea>

          </div>

        </div>

        <NoteName userData={userData} />

        <NoteSections userData={userData} />

        <NoteTags userData={userData} />

        <div className="form-pack">

          <label htmlFor="el-aid-sect-cre">Date Created</label>

          <div className="inp-hol">

            <input type="text" id="el-aid-sect-cre" name="el-aid-sect-cre" value={convertDate(userData.createdAt)} readOnly />

          </div>

        </div>

        <div className="form-pack">

          <label htmlFor="el-aid-sect-up">Last Updated</label>

          <div className="inp-hol">

            <input type="text" id="el-aid-sect-up" name="el-aid-sect-up" value={convertDate(userData.updatedAt)} readOnly />

          </div>

        </div>

        <UserPassword userData={userData} />

        <div className="form-pack">

          <button onClick={deleteUserX}>Delete Account</button>

        </div>

      </div>}

      {loadingUser && <div className="over-lo-all">

        <Oval width="8rem" height="8rem" color="white" secondaryColor="white" />

        <span>{loadingText}</span>

      </div>}

    </UserPageStyle>

  )

}

const UserPageStyle = styled.div`

  position: absolute;
  width: 80%;
  top: 0; left: 20%;
  bottom: 0; right: 100%;
  overflow: auto;
  transition: width .5s, left .5s;

  @keyframes opacity-in {
    from{
      opacity: 0;
    }
    to{
      opacity: 1;
    }
  }

  .user-sett-pack{
    width: 100%;
    padding: 0.5rem;
    animation: opacity-in .5s 1;

    .intro{
      display: block;

      h1{
        text-align: center;
        font-size: 1.5rem;
        line-height: 3rem;
        padding-top: 0.5rem;
      }

      p{
        text-align: center;
      }
    }
  
    .form-pack{
      width: 100%;
      padding: 0 .5rem;
      padding-bottom: 1rem;
  
      label{
        font-weight: bold;
        /* font-size: .9rem; */
      }
  
      div.inp-hol{
        width: 100%;
  
        input{
          display: block;
          width: 100%;
          background-color: #f7f7f7;
          border: 0 none;
          outline: 0 none;
          border-radius: 0.3rem;
          padding: 0.1rem .5rem;
          /* border: 1px solid #c4c4c4; */
          box-shadow: inset 36px 36px 100px #dedede, inset -36px -36px 100px #ffffff;
        }
        
        textarea{
          display: block;
          width: 100%;
          background-color: #f7f7f7;
          border: 0 none;
          outline: 0 none;
          border-radius: 0.3rem;
          padding: 0.1rem .5rem;
          box-shadow: inset 36px 36px 100px #dedede, inset -36px -36px 100px #ffffff;
          height: 5rem;
        }
        
        .rt-sd-btn-ab{
          position: absolute;
          top: 0rem;
          right: 0rem;
          bottom: 0rem;
          width: 1.7rem;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 0 none;
          background-color: transparent;
          color: #a4a4a4;
          border-radius: 0.2rem;
          cursor: pointer;
          padding: 0;
        }
      }

      &.check{
        display: flex;
        align-items: center;
        padding-bottom: .25rem;
        
        .inp-ch-hol{
          display: flex;
          align-items: center;
          padding-left: 0.25rem;
        }
      }

      button{
        border: 0 none;
        outline: 0 none;
        background-color: #ab1212;
        color: white;
        /* padding: 0 1rem; */
        width: 100%;
        border-radius: 0.3rem;
        transition: background-color .5s;
        
        &:hover{
          background-color: red;
        }
      }
  
    }
  }

  .over-lo-all{
    position: absolute;
    top: 0; left: 0;
    right: 0; bottom: 0;
    height: 100%; width: 100%;
    z-index: 50;
    background-color: rgba(0,0,0,.2);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    color: white;
    animation: opacity-in .5s 1;

    span{
      font-size: 1.5rem;
      line-height: 3rem;
    }
  }

`


export default UserPage

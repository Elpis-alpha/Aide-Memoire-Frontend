import { FaEye, FaEyeSlash, FaTimes } from 'react-icons/fa'

import { AiFillTags, AiOutlinePlus } from "react-icons/ai"

import { useRef, useState } from "react"

import { Oval } from "react-loader-spinner"

import Parse from "html-react-parser"

import { getApiJson, postApiJson, patchApiJson } from "../../../controllers/APICtrl"

import styled from "styled-components"

import { editUser, createTag, filterTag, getTagByName, changePassword } from "../../../api"

import { sendMiniMessage } from "../../../controllers/MessageCtrl"

import { waitFor } from "../../../controllers/TimeCtrl"

import { useDispatch } from "react-redux"

import { setUserData } from "../../../store/slice/userSlice"


const UserPassword = ({ userData }) => {

  const dispatch = useDispatch()

  const [oldPassword, setOldPassword] = useState("")

  const [newPassword, setNewPassword] = useState("")

  const [showPassword, setShowPassword] = useState(false)

  const [showPasswordN, setShowPasswordN] = useState(false)

  const inputRef = useRef(null)

  const changePasswordX = async () => {

    if (oldPassword === newPassword) return false

    if (oldPassword === "" || newPassword === "") return false

    if (newPassword.length <= 4) {

      sendMiniMessage({

        icon: { name: "times", style: {} },

        content: { text: "Too Short!", style: {} },

        style: {}

      }, 2000)

      return false

    }

    setNewPassword("")

    setOldPassword("")

    sendMiniMessage({

      icon: { name: "loading", style: {} },

      content: { text: "Changing Password!", style: {} },

      style: {}

    })

    const passE = await postApiJson(changePassword(), {

      oldPassword, newPassword

    })

    if (passE.error) {

      sendMiniMessage({

        icon: { name: "times", style: {} },

        content: { text: "An Error Occured!", style: {} },

        style: {}

      }, 2000)

      return false

    }

    sendMiniMessage({

      icon: { name: "ok", style: {} },

      content: { text: "Password Changed!", style: {} },

      style: {}

    }, 2000)

  }

  return (

    <UserPasswordStyle>

      <div className="inp-hol">

        <form onSubmit={e => { e.preventDefault(); changePasswordX() }}>

          <div className="side-all">

            <div className="side-by" style={{ paddingRight: ".5rem" }}>

              <label>Old Password</label>

              <div className="inp-eye">

                <input required type={showPassword ? "text" : "password"} placeholder="●●●●●●●●" value={oldPassword} onInput={e => setOldPassword(e.target.value)} autoComplete="off" />

                <div className='icon-hol'>{getPasswordIcon(showPassword, setShowPassword)}</div>

              </div>

            </div>

            <div className="side-by" style={{ paddingLeft: ".5rem" }}>

              <label>New Password</label>

              <div className="inp-eye">

                <input required type={showPasswordN ? "text" : "password"} placeholder="●●●●●●●●" value={newPassword} onInput={e => setNewPassword(e.target.value)} autoComplete="off" />

                <div className='icon-hol'>{getPasswordIcon(showPasswordN, setShowPasswordN)}</div>

              </div>

            </div>

          </div>

          <button className="rt-sd-btn-ab">Change Password</button>

        </form>

      </div>

    </UserPasswordStyle>

  )

}

const UserPasswordStyle = styled.div`
  width: 100%;
  padding: 1rem .5rem;
  padding-top: 0;

  label{
    font-weight: bold;
  }

  div.inp-hol{
    width: 100%;

    .side-all{
      display: flex;
      align-items: center;
      justify-content: center;
      padding-bottom: 0.5rem;

      .side-by{
        width: 50%;
        flex: 1;

        .smx-eye{
          position: absolute;
          right: 0; bottom: 0;
          z-index: 5;
        }

        .icon-hol{
          width: 1.8rem;
          cursor: pointer;
          height: 100%;
          position: absolute;
          right: 0; top: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      }
    }

    input{
      width: 100%;
      background-color: #f7f7f7;
      border: 0 none;
      outline: 0 none;
      border-radius: 0.3rem;
      padding: 0.1rem .5rem;
      box-shadow: inset 36px 36px 100px #dedede, inset -36px -36px 100px #ffffff;
    }

    .rt-sd-btn-ab{
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 0 none;
      background-color: darkmagenta;
      border-radius: 0.2rem;
      color: white;
      cursor: pointer;
    }
  }
  
`

const getPasswordIcon = (showPassword, setShowPassword) => {

  switch (showPassword) {

    case true: return <FaEyeSlash size="1.2rem" onClick={() => setShowPassword(!showPassword)} />

    case false: return <FaEye size="1.2rem" onClick={() => setShowPassword(!showPassword)} />

    default: return <></>

  }

}

export default UserPassword

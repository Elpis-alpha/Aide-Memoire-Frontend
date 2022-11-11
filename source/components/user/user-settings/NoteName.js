import { useState } from "react"

import { reloadTree } from "../../../store/slice/noteSlice"

import { patchApiJson } from "../../../controllers/APICtrl"

import styled from "styled-components"

import { editUser } from "../../../api"

import { sendMiniMessage } from "../../../controllers/MessageCtrl"

import { useDispatch } from "react-redux"

import { setUserData } from "../../../store/slice/userSlice"


const NoteName = ({ userData }) => {

  const dispatch = useDispatch()

  const [noteName, setNoteName] = useState(userData.noteName)

  const saveThisName = async () => {

    if (noteName === userData.noteName) return false

    if (noteName.trim() === "") return false

    sendMiniMessage({

      icon: { name: "loading", style: {} },

      content: { text: "Changing Note!", style: {} },

      style: {}

    })

    const newName = await patchApiJson(editUser(), {

      noteName

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

  const keyDownHandler = async (e) => {

    if (e.keyCode === 13) {

      e.target.blur()

      await saveThisName()

    }

  }

  return (

    <NoteNameStyle>

      <label htmlFor="el-aid-note-name">Default Note Name</label>

      <div className="inp-hol">

        <input type="text" id="el-aid-note-name" name="el-aid-note-name" value={noteName}

          onInput={e => setNoteName(e.target.value)} onBlur={saveThisName} onKeyDown={keyDownHandler} />

      </div>

    </NoteNameStyle>

  )

}

const NoteNameStyle = styled.div`
  width: 100%;
  padding: 0 .5pc;
  padding-bottom: 0.5pc;

  label{
    font-weight: bold;
    /* font-size: .9pc; */
  }

  div.inp-hol{
    width: 100%;

    input{
      width: 100%;
      background-color: #f7f7f7;
      border: 0 none;
      outline: 0 none;
      border-radius: 0.3pc;
      padding: 0.1pc .5pc;
      /* border: 1px solid #c4c4c4; */
      box-shadow: inset 36px 36px 100px #dedede, inset -36px -36px 100px #ffffff;
    }
  }
`

export default NoteName

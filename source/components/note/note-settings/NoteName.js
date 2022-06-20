import { useEffect, useState } from "react"

import { reloadTree } from "../../../store/slice/noteSlice"

import { patchApiJson } from "../../../controllers/APICtrl"

import styled from "styled-components"

import { updateNote } from "../../../api"

import { sendMiniMessage } from "../../../controllers/MessageCtrl"

import { useDispatch } from "react-redux"

import { waitFor } from "../../../controllers/TimeCtrl"


const NoteName = ({ note, setNote, userData }) => {

  const dispatch = useDispatch()

  const [noteName, setNoteName] = useState(note.name)

  const saveThisName = async () => {

    if (noteName === note.name) return false

    sendMiniMessage({

      icon: { name: "loading", style: {} },

      content: { text: "Renaming Note!", style: {} },

      style: {}

    })

    const newName = await patchApiJson(updateNote(note._id), {

      name: noteName

    })

    if (newName.error) {

      sendMiniMessage({

        icon: { name: "times", style: {} },

        content: { text: "An Error Occured!", style: {} },

        style: {}

      }, 2000)

    } else {

      if (note.sections.length < 1) {

        dispatch(reloadTree("user"))

      } else {

        for (const sect of note.sections) {

          await waitFor(100)

          dispatch(reloadTree(sect.name))

        }

      }

      sendMiniMessage({

        icon: { name: "ok", style: {} },

        content: { text: "Note Renamed!", style: {} },

        style: {}

      }, 2000)

      setNote({ ...note, name: noteName })

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

      <label htmlFor="el-aid-note-name">Note Name</label>

      <div className="inp-hol">

        <input type="text" id="el-aid-note-name" name="el-aid-note-name" value={noteName}

          onInput={e => setNoteName(e.target.value)} onBlur={saveThisName} onKeyDown={keyDownHandler} />

      </div>

    </NoteNameStyle>

  )

}

const NoteNameStyle = styled.div`
  width: 100%;
  padding: 0 .5rem;
  padding-bottom: 0.5rem;

  label{
    font-weight: bold;
    /* font-size: .9rem; */
  }

  div.inp-hol{
    width: 100%;

    input{
      width: 100%;
      background-color: #f7f7f7;
      border: 0 none;
      outline: 0 none;
      border-radius: 0.3rem;
      padding: 0.1rem .5rem;
      /* border: 1px solid #c4c4c4; */
      box-shadow: inset 36px 36px 100px #dedede, inset -36px -36px 100px #ffffff;
    }
  }
`

export default NoteName

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

  const [noteDescription, setNoteDescription] = useState(note.description)

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

  const saveThisDesc = async () => {

    if (noteDescription === note.description) return false

    sendMiniMessage({

      icon: { name: "loading", style: {} },

      content: { text: "Saving Description!", style: {} },

      style: {}

    })

    const newDesc = await patchApiJson(updateNote(note._id), {

      description: noteDescription

    })

    if (newDesc.error) {

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

        content: { text: "Description Saved!", style: {} },

        style: {}

      }, 2000)

      setNote({ ...note, description: noteDescription })

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

      <div className="form-holder">

        <label htmlFor="el-aid-note-name">Note Name</label>

        <div className="inp-hol">

          <input type="text" id="el-aid-note-name" name="el-aid-note-name" value={noteName}

            onInput={e => setNoteName(e.target.value)} onBlur={saveThisName} onKeyDown={keyDownHandler} />

        </div>

      </div>

      <div className="form-holder">

        <label htmlFor="el-aid-note-desc" className="duo">Note Description</label>

        <div className="inp-hol">
          <textarea required id="el-aid-note-desc" name="el-aid-note-desc" value={noteDescription}
            onInput={e => setNoteDescription(e.target.value)} onBlur={saveThisDesc}></textarea>
        </div>

      </div>

    </NoteNameStyle>

  )

}

const NoteNameStyle = styled.div`
  width: 100%;
  padding: 0 .5pc;
  padding-bottom: 1pc;

  label{
    display: block;
    font-weight: bold;

    &.duo {
      padding-top: 1pc;
    }
  }

  div.inp-hol{
    width: 100%;

    input, textarea {
      width: 100%;
      background-color: #f7f7f7;
      border: 0 none;
      outline: 0 none;
      border-radius: 0.3pc;
      padding: 0.1pc .5pc;
      /* border: 1px solid #c4c4c4; */
      box-shadow: inset 36px 36px 100px #dedede, inset -36px -36px 100px #ffffff;
    }

    textarea{
      height: 7pc;
    }
  }
`

export default NoteName

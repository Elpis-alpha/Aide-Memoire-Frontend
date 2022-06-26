import { useRouter } from "next/router"

import { useEffect, useRef, useState } from "react"

import styled from "styled-components"

import { useSelector } from "react-redux"

import { useDispatch } from "react-redux"

import CustomEditor from "../rich-text/CustomEditor"

import { FaSave, FaTimes } from "react-icons/fa"

import { setSavedChanges, reloadTree, setActiveNote } from "../../store/slice/noteSlice"

import { getNote, deleteNote, updateNote } from "../../api"

import { getApiJson, patchApiJson, deleteApiJson } from "../../controllers/APICtrl"

import { Oval } from "react-loader-spinner"

import { AiFillDelete } from "react-icons/ai"

import { sendMiniMessage, sendSmallMessage, sendXMessage } from "../../controllers/MessageCtrl"

import { waitFor } from "../../controllers/TimeCtrl"
import { theRightStyle } from "../../controllers/SpecialCtrl"


const EditNote = ({ noteID }) => {

  const router = useRouter()

  const dispatch = useDispatch()

  const { divider } = useSelector(store => store.display)

  const { savedChanges } = useSelector(store => store.note)

  const { data: userData } = useSelector(store => store.user)

  const noteIDRef = useRef(null)

  const noteContentRef = useRef(null)

  const savedChangesRef = useRef(null)

  const [show, setShow] = useState("")

  const [note, setNote] = useState({})

  const [noteContent, setNoteContent] = useState("<p></p>")

  const [loadingNote, setLoadingNote] = useState(true)

  const [invalidNote, setInvalidNote] = useState(false)

  const [loadingText, setLoadingText] = useState("Loading Note")

  // Get/fetch note
  useEffect(async () => {

    noteIDRef.current = noteID

    setLoadingNote(true)

    setShow("")

    const noteData = await getApiJson(getNote(noteID))

    if (noteData.error) {

      setInvalidNote(true)

      setLoadingNote(false)

    } else {

      setNoteContent(noteData.text)

      setInvalidNote(false)

      setLoadingNote(false)

      setNote(noteData)

      dispatch(setActiveNote(noteData._id))

      return () => { dispatch(setActiveNote("")) }

    }

    return async () => {

      if (!savedChangesRef.current) {

        sendMiniMessage({

          icon: { name: "loading", style: {} },

          content: { text: "Saving Note", style: {} },

          style: {}

        })

        await saveNoteX()

        sendMiniMessage({

          icon: { name: "ok", style: {} },

          content: { text: "Note Saved", style: {} },

          style: {}

        }, 2000)

      }

    }

  }, [noteID])

  useEffect(() => { noteContentRef.current = noteContent; dispatch(setSavedChanges(false)) }, [noteContent])

  useEffect(() => { savedChangesRef.current = savedChanges }, [savedChanges])

  const getWidth = divider => 100 - parseInt(divider) + '%'

  const saveNoteX = async redirect => {

    let newNote = {}

    dispatch(setSavedChanges(true))

    try {

      newNote = await patchApiJson(updateNote(noteIDRef.current), {

        text: noteContentRef.current

      })

      // if (newNote.error) throw new Error(newNote.error)

    } catch (error) {

      sendSmallMessage({

        heading: { text: "Error Detected!", style: { padding: '.5rem' } },

        content: { text: "Unfortunately, an error occured and the note failed to save", style: {} },

        style: {}

      }, 4000)

      newNote.error = true
    }

    await waitFor(10)  // allow save changes to set

    if (redirect === "read" && !newNote.error) {

      router.push(`/note/${note._id}`)

    }

    return newNote.error ? "failed" : "passed"

  }

  const exitNote = async () => {

    if (savedChanges === false) {

      const res = await sendXMessage({

        heading: { text: "Unsaved Changes", style: {} },

        content: { text: "You have not saved this note. Leaving now will prevent current changes from being saved" },

        buttons: [

          { text: 'Save and Exit', waitFor: 'se', style: { backgroundColor: '#2e2e52' } },

          { text: 'Just Exit', waitFor: 'ee', style: { backgroundColor: 'darkred' } },

          { text: 'Go Back', waitFor: 're', style: { backgroundColor: '#607d8b' } },

        ],

      })

      if (res === "ee") {

        dispatch(setSavedChanges(true))

        await waitFor(10)

        router.push(`/note/${note._id}`)

      } else if (res === "se") {

        setShow("save-x")

        const saved = await saveNoteX("read")

        if (saved === "passed") {

          dispatch(setSavedChanges(true))

          await waitFor(10)

          router.push(`/note/${note._id}`)

        }

      }

    } else {

      dispatch(setSavedChanges(true))

      await waitFor(10)

      router.push(`/note/${note._id}`)

    }

  }

  const runAsyncSave = async () => {

    sendMiniMessage({

      icon: { name: "loading", style: {} },

      content: { text: "Saving Note!", style: {} },

      style: {}

    })

    const saved = await saveNoteX()

    if (saved === "passed") {

      sendMiniMessage({

        icon: { name: "ok", style: {} },

        content: { text: "Note Saved!", style: {} },

        style: {}

      }, 2000)

    } else {

      sendMiniMessage({

        icon: { name: "times", style: {} },

        content: { text: "An Error Occured!", style: {} },

        style: {}

      }, 2000)

    }

  }

  const deleteNoteX = async () => {

    if (e.currentTarget.getAttribute('disabled') === '') return false

    const res = await sendXMessage({

      heading: { text: "Confirm Delete", style: {} },

      content: { text: "Are you sure you want to delete this note. Note that this action is completely irreversible" },

      buttons: [

        { text: 'Yes, Delete', waitFor: 'yd', style: { backgroundColor: '#2e2e52' } },

        { text: 'No, Return', waitFor: 'ee', style: { backgroundColor: 'darkred' } },

      ],

    })

    if (res === "yd") {

      setLoadingText("Deleting Note")

      setLoadingNote(true)

      await deleteApiJson(deleteNote(note._id), {})

      if (note.sections.length < 1) {

        dispatch(reloadTree("user"))

      } else {

        for (const sect of note.sections) {

          await waitFor(100)

          dispatch(reloadTree(sect.name))

        }

      }

      router.push(`/user/${userData.email}`)

    }

  }

  return (

    <EditNoteStyle style={theRightStyle(divider)}>

      {(!loadingNote && !invalidNote) && <>

        <div className="note-editor-pack">

          <CustomEditor editorState={noteContent} setEditorState={setNoteContent} placeholder="Write your note here..." />

        </div>

        <div className="edit-note-bottom">

          <div className="site-bottom-r-btn" onClick={runAsyncSave}>

            <FaSave size="1.2rem" />

            <span>Save</span>

          </div>

          <div className="site-bottom-r-btn" onClick={exitNote}>

            <FaTimes size="1.2rem" />

            <span>Exit</span>

          </div>

          <div className="site-bottom-r-btn" onClick={deleteNoteX} disabled={!note.canDelete}>

            <AiFillDelete size="1.2rem" />

            <span>Delete</span>

          </div>

        </div>

      </>}

      {(!loadingNote && show === "save-x") && <div className="over-sa-all">

        <Oval width="8rem" height="8rem" color="white" secondaryColor="white" />

        <span>Saving Note</span>

      </div>}

      {loadingNote && <div className="over-lo-all">

        <Oval width="8rem" height="8rem" color="white" secondaryColor="white" />

        <span>{loadingText}</span>

      </div>}

      {(!loadingNote && invalidNote) && <div className="note-invalid-pack">

        <div>

          This note either does not exist

          or is inaccessible to you.

        </div>

      </div>}

    </EditNoteStyle>

  )

}

const EditNoteStyle = styled.div`

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

  .note-editor-pack{
    padding: 0.5rem;
    height: calc(100% - 2.5rem);
    overflow: hidden;
    animation: opacity-in .5s 1;
  }
  
  .edit-note-bottom{
    position: fixed;
    right: 0;
    bottom: 0;
    width: inherit;
    z-index: 10;
    height: 2.5rem;
    padding: 0rem 0.5rem;
    padding-bottom: 0.25rem;
    display: flex;
    animation: opacity-in .5s 1;
    
    .site-bottom-r-btn{
      height: 100%;
      margin: 0 .25rem;
      flex: 1;
      background-color: #d4d4d4;
      border-radius: .2rem;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 0 2px #c4c4c4;
      cursor: pointer;
      color: #5a5a5a;
      transition: background-color .5s;
      span{
        display: inline-block;
        padding-left: 0.5rem;
      }

      &:first-of-type{ margin-left: 0 }
      &:last-of-type{ margin-right: 0 }

      &:hover{
        background-color: #b7b7b7;
      }

      
      &[disabled]{
        opacity: 0.5;
        pointer-events: none;
        cursor: not-allowed;
        
        &:hover{
          background-color: #d4d4d4;
        }
      }
    }
  }

  .over-dx-all{
    position: absolute;
    top: 0; left: 0;
    right: 0; bottom: 0;
    height: 100%; width: 100%;
    z-index: 50;
    background-color: rgba(0,0,0,.2);
    display: flex;
    align-items: center;
  }

  .over-sa-all{
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

  .note-invalid-pack{
    padding: 0.5rem;
    height: calc(100%);
    overflow: auto;
    font-size: 1.2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    animation: opacity-in .5s 1;
  }

  @media screen and (max-width: 700px) {
    width: 100%; left: 0%;
  }
`

export default EditNote

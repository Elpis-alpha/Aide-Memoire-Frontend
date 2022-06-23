import { useRouter } from "next/router"

import { useEffect, useRef, useState } from "react"

import styled from "styled-components"

import { useSelector } from "react-redux"

import { useDispatch } from "react-redux"

import CustomEditor from "../rich-text/CustomEditor"

import { FaSave, FaTimes } from "react-icons/fa"

import { setSavedChanges, reloadTree } from "../../store/slice/noteSlice"

import { getPrivateSections } from "../../api"

import { getApiJson } from "../../controllers/APICtrl"

import OverDxName from "./create-note/OverDXName"

import OverDxSection from "./create-note/OverDXSection"

import OverDxTag from "./create-note/OverDXTag"

import { Oval } from "react-loader-spinner"

import { postApiJson } from "../../controllers/APICtrl"

import { createNote, addNoteTag, addSection } from "../../api"

import { sendMiniMessage, sendSmallMessage, sendXMessage } from "../../controllers/MessageCtrl"

import { waitFor } from "../../controllers/TimeCtrl"

import { theRightStyle } from "../../controllers/SpecialCtrl"


const CreateNote = () => {

  const router = useRouter()

  const dispatch = useDispatch()

  const [noteContent, setNoteContent] = useState("<p></p>")

  const { divider } = useSelector(store => store.display)

  const { savedChanges } = useSelector(store => store.note)

  const { data } = useSelector(store => store.user)

  const [noteName, setNoteName] = useState(data.noteName)

  const [sectionList, setSectionList] = useState(data.noteSections)

  const [tagList, setTagList] = useState(data.noteTags)

  const [userSections, setUserSections] = useState([])

  const [show, setShow] = useState("")

  const savedChangesRef = useRef(null)

  const noteContentRef = useRef(null)

  const noteNameRef = useRef(null)

  const sectionListRef = useRef(null)

  const noteTagsRef = useRef(null)

  const dxList = ['name', 'section', 'tag']

  // Get user Sections
  useEffect(async () => {

    const sects = await getApiJson(getPrivateSections(), data.token)

    setUserSections(sects)

  }, [])

  useEffect(() => { noteNameRef.current = noteName }, [noteName])

  useEffect(() => { noteTagsRef.current = tagList }, [tagList])
  
  useEffect(() => { sectionListRef.current = sectionList }, [sectionList])
  
  useEffect(() => { noteContentRef.current = noteContent }, [noteContent])

  useEffect(() => { savedChangesRef.current = savedChanges }, [savedChanges])

  const getWidth = divider => {

    return 100 - parseInt(divider) + '%'

  }

  useEffect(() => {

    return async () => {

      if ((!savedChangesRef.current) && noteContentRef.current !== "<p></p>") {

        sendMiniMessage({

          icon: { name: "loading", style: {} },

          content: { text: "Saving Note", style: {} },

          style: {}

        })

        await createNoteX()

        sendMiniMessage({

          icon: { name: "ok", style: {} },

          content: { text: "Note Saved", style: {} },

          style: {}

        }, 2000)

      }

    }

  }, [])

  useEffect(() => {

    dispatch(setSavedChanges(false))

  }, [noteContent])


  const createNoteX = async (redirect) => {

    let newNote = {}

    dispatch(setSavedChanges(true))

    try {

      newNote = await postApiJson(createNote(), {

        name: noteNameRef.current,

        text: noteContentRef.current

      }, )

      if (newNote.error) throw new Error(newNote.error)

      for (const sect of sectionListRef.current) {

        const addSect = await postApiJson(addSection(newNote._id), {

          id: sect._id

        }, )

        if (addSect.error) {

          sendMiniMessage({
  
            icon: { name: "times", style: {} },
  
            content: { text: "Invalid Section!", style: {} },
  
            style: {}
  
          }, 2000)
  
        }  

      }

      for (const tag of noteTagsRef.current) {

        const addTag = await postApiJson(addNoteTag(newNote._id), {

          id: tag._id

        }, )

        if (addTag.error) {

          sendMiniMessage({
  
            icon: { name: "times", style: {} },
  
            content: { text: "Invalid Tag!", style: {} },
  
            style: {}
  
          }, 2000)
  
        }  

      }

      if (sectionListRef.current.length < 1) {

        dispatch(reloadTree("user"))

      } else {

        for (const sect of sectionListRef.current) {

          await waitFor(100)

          dispatch(reloadTree(sect.name))

        }

      }

    } catch (error) {

      const smallMessg = sendSmallMessage({

        heading: { text: "Error Detected!", style: { padding: '.5rem' } },

        content: { text: "Unfortunately, an error occured and the note failed to save", style: {} },

        style: {}

      }, 4000)

      dispatch(setSavedChanges(false))

      return smallMessg

    }

    await waitFor(10)  // allow save changes to set

    if (redirect === "read") {

      router.push(`/note/${newNote._id}`)

    }

  }

  const exitNote = async () => {

    if (savedChanges === false) {

      const res = await sendXMessage({

        heading: { text: "Unsaved Changes", style: {} },

        content: { text: "You have not saved this note. Leaving now will prevent futher accesibility to this note" },

        buttons: [

          { text: 'Save and Exit', waitFor: 'se', style: { backgroundColor: '#2e2e52' } },

          { text: 'Just Exit', waitFor: 'ee', style: { backgroundColor: 'darkred' } },

          { text: 'Go Back', waitFor: 're', style: { backgroundColor: '#607d8b' } },

        ],

      })

      if (res === "ee") {

        dispatch(setSavedChanges(true))

        await waitFor(10)

        router.push(`/user/${data.email}`)

      } else if (res === "se") {

        setShow("name")

      }

    } else {
      
      dispatch(setSavedChanges(true))

      await waitFor(10)

      router.push(`/user/${data.email}`)

    }

  }

  return (

    <CreateNoteStyle style={theRightStyle(divider)}>

      <div className="note-editor-pack">

        <CustomEditor editorState={noteContent} setEditorState={setNoteContent} placeholder="Write your note here..." />

      </div>

      <div className="edit-note-bottom">

        <div className="site-bottom-r-btn" onClick={() => setShow('name')}>

          <FaSave size="1.2rem" />

          <span>Save</span>

        </div>

        <div className="site-bottom-r-btn" onClick={exitNote}>

          <FaTimes size="1.2rem" />

          <span>Exit</span>

        </div>

      </div>

      {dxList.includes(show) && <div className="over-dx-all">

        <OverDxName {...{ noteName, setNoteName, show, setShow }} />

        <OverDxSection {...{ sectionList, setSectionList, userSections, show, setShow }} />

        <OverDxTag {...{ tagList, setTagList, show, setShow, createNoteX }} />

      </div>}

      {show === "save-x" && <div className="over-sa-all">

        <Oval width="8rem" height="8rem" color="white" secondaryColor="white" />

        <span>Saving Note</span>

      </div>}

    </CreateNoteStyle>

  )

}

const CreateNoteStyle = styled.div`

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
  }
  
  .edit-note-bottom{
    position: fixed;
    right: 0;
    bottom: 0;
    width: inherit;
    height: 2.5rem;
    padding: 0rem 0.5rem;
    padding-bottom: 0.25rem;
    display: flex;
    
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

    span{
      font-size: 1.5rem;
      line-height: 3rem;
    }
  }
  
  @media screen and (max-width: 700px) {
    width: 100%; left: 0%;
  }
`

export default CreateNote

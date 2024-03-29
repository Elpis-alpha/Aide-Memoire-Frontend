import { useRouter } from "next/router"

import { useEffect, useState } from "react"

import styled from "styled-components"

import { useSelector, useDispatch } from "react-redux"

import { AiFillEdit, AiFillDelete } from "react-icons/ai"

import { FaCog } from "react-icons/fa"

import { deleteNote, getNote, getSpecialNote } from "../../api"

import { deleteApiJson, getApiJson } from "../../controllers/APICtrl"

import ReadEditor from "../rich-text/ReadEditor"

import { Oval } from "react-loader-spinner"

import { sendXMessage } from "../../controllers/MessageCtrl"

import { reloadTree, setActiveNote } from "../../store/slice/noteSlice"

import { waitFor } from "../../controllers/TimeCtrl"

import Link from "next/link"

import { specialNotes } from "../../__env"

import { AiFillTags } from "react-icons/ai"

import { theRightStyle } from "../../controllers/SpecialCtrl"


const NotePage = ({ noteID }) => {

  const router = useRouter()

  const dispatch = useDispatch()

  const { divider } = useSelector(store => store.display)

  const { data: userData } = useSelector(store => store.user)

  const [loadingNote, setLoadingNote] = useState(true)

  const [invalidNote, setInvalidNote] = useState(false)

  const [loadingText, setLoadingText] = useState("Loading Note")

  const [note, setNote] = useState({})

  const [noteContent, setNoteContent] = useState("<p></p>")

  useEffect(() => {

    const workStuff = async () => {

      setLoadingNote(true)
  
      let noteData = {}
  
      if (specialNotes.includes(noteID)) {
  
        noteData = await getApiJson(getSpecialNote(noteID))
        
      } else {
        
        noteData = await getApiJson(getNote(noteID))
  
      }
  
  
      if (noteData.error) {
  
        setInvalidNote(true)
  
        setLoadingNote(false)
  
      } else {
  
        setInvalidNote(false)
  
        setNote(noteData)
  
        setNoteContent(noteData.text)
  
        setLoadingNote(false)
  
        dispatch(setActiveNote(noteData._id))
  
      }
  
      return () => { dispatch(setActiveNote("")) }
  
    }

    workStuff()

  }, [noteID])

  const deleteNoteX = async (e) => {

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

      router.push(`/me`)

    }

  }

  return (

    <NotePageStyle style={theRightStyle(divider)}>

      {(!loadingNote && !invalidNote) && <>

        <div className="note-editor-pack">

          <ReadEditor editorState={noteContent} setEditorState={setNoteContent} />

          <div className="note-ist-det">

            <div className="note-tags-all">

              {note.tags.map(tax => <Link key={tax._id} href={`/tag/private/${tax._id}`}><a><div className="tax-time" key={tax._id}>

                <span className="a"><AiFillTags size=".8pc" /></span>

                <span className="t">{tax.name}</span>

              </div></a></Link>)}

              {note.tags.length === 0 && <div className="empt">No tag in this note</div>}

            </div>

          </div>

        </div>

        <div className="edit-note-bottom">

          <div className="site-bottom-r-btn">

            <Link href={`/note/${note._id}/edit`}><a>

              <AiFillEdit size="1pc" />

              <span>Edit</span>

            </a></Link>

          </div>

          <div className="site-bottom-r-btn" onClick={(e) => deleteNoteX(e)} disabled={!note.canDelete} >

            <AiFillDelete size="1pc" />

            <span>Delete</span>

          </div>

          <div className="site-bottom-r-btn">

            <Link href={`/note/${note._id}/settings`}><a>

              <FaCog size="1pc" />

              <span>Info</span>

            </a></Link>

          </div>

        </div>

      </>}

      {(!loadingNote && invalidNote) && <div className="note-invalid-pack">

        <div>

          This note either does not exist

          or is inaccessible to you.

        </div>

      </div>}

      {loadingNote && <div className="over-lo-all">

        <Oval width="8pc" height="8pc" color="white" secondaryColor="white" />

        <span>{loadingText}</span>

      </div>}

    </NotePageStyle>

  )

}

const NotePageStyle = styled.div`

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
    padding: 1pc;
    height: calc(100% - 2.5pc);
    overflow: auto;
    animation: opacity-in .5s 1;
    
    .heading{
      text-align: center;
      font-size: 1.2pc;
      line-height: 3pc;
      padding: 0 1pc;
      padding-top: 0.5pc;
    }

    @media screen and (orientation: portrait) {
      height: calc(100% - 4pc);
    }
  }

  .note-invalid-pack{
    padding: 0.5pc;
    height: calc(100%);
    overflow: auto;
    font-size: 1.2pc;
    display: flex;
    align-items: center;
    justify-content: center;
    animation: opacity-in .5s 1;
  }

  .edit-note-bottom{
    position: fixed;
    right: 0;
    bottom: 0;
    width: inherit;
    z-index: 10;
    height: 2.5pc;
    padding: 0pc 0.5pc;
    padding-bottom: 0.25pc;
    display: flex;
    animation: opacity-in .5s 1;

    background-color: #f7f7f7;

    @media screen and (orientation: portrait) {
      height: 4pc;
      font-size: .9pc;
    }

    .site-bottom-r-btn{
      height: 100%;
      margin: 0 .25pc;
      flex: 1;
      background-color: #d4d4d4;
      border-radius: .2pc;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 0 2px #c4c4c4;
      cursor: pointer;
      color: #5a5a5a;
      transition: background-color .5s;
      span{
        display: inline-block;
        padding-left: 0.5pc;
      }
      
      a{
        display: inline-flex;
        width: 100%;
        height: 100%;
        align-items: center;
        justify-content: center;
        color: inherit;
        text-decoration: none;
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
      font-size: 1.5pc;
      line-height: 3pc;
    }
  }

  .note-tags-all{
    padding: .5pc;
    padding-bottom: 0.3pc;
    margin-bottom: 1pc;
    display: flex;
    flex-wrap: wrap;
    
    .tax-time{
      background-color: #2f2f2f;
      color: white;
      border-radius: 0.5pc;
      padding: 0 .3pc;
      line-height: 1.5pc;
      margin-bottom: .2pc;
      margin-right: .2pc;
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: linear-gradient(145deg, #8b8b8b, #757575);
      box-shadow:  0 0 2px #676767;
      margin-bottom: .7pc;
      cursor: pointer;
      
      span{
        display: flex;
        align-items: center;
        transition: color .5s;

        &.x{
          cursor: pointer;
          color: white;
          
          &:hover{
            color: darkred;
          }
        }

        &.t{
          display: inline-block;
          padding: 0 .3pc;
        }
      }
    }

    .empt{
      width: 100%;
      font-style: italic;
      text-align: center;
      line-height: 1pc;
      margin-bottom: .7pc;
    }
  }

  @media screen and (max-width: 700px) {
    width: 100%; left: 0%;
  }
`


export default NotePage

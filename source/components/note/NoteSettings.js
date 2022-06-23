import { useEffect, useState } from "react"

import { useDispatch, useSelector } from "react-redux"

import { Oval } from "react-loader-spinner"

import { getApiJson, postApiJson } from "../../controllers/APICtrl"

import styled from "styled-components"

import { getNote, toggleNotePublic } from "../../api"

import NoteName from "./note-settings/NoteName"

import NoteTags from "./note-settings/NoteTags"

import NoteSections from "./note-settings/NoteSections"

import { host } from "../../__env"

import { FaCopy } from "react-icons/fa"

import { datetoDateStr, datetoFullTimeStr } from "../../controllers/TimeCtrl"

import { copyText, theRightStyle } from "../../controllers/SpecialCtrl"

import { sendMiniMessage } from "../../controllers/MessageCtrl"
import { setActiveNote } from "../../store/slice/noteSlice"


const NoteSetting = ({ noteID }) => {

  const dispatch = useDispatch()

  const { divider } = useSelector(store => store.display)

  const { data: userData } = useSelector(store => store.user)

  const [loadingNote, setLoadingNote] = useState(true)

  const [invalidNote, setInvalidNote] = useState(false)

  const [loadingText, setLoadingText] = useState("Loading Note")

  const [note, setNote] = useState({})

  const getWidth = divider => 100 - parseInt(divider) + '%'

  const convertDate = date => {

    return datetoDateStr(new Date(date)) + ", " + datetoFullTimeStr(new Date(date))

  }

  const copyTextX = text => {

    sendMiniMessage({

      icon: { name: "copy", style: {} },

      content: { text: "Text Copied!", style: {} },

      style: {}

    }, 2000)

    copyText(text)

  }

  const togglePublic = async () => {

    sendMiniMessage({

      icon: { name: "loading", style: {} },

      content: { text: "Toggling Public!", style: {} },

      style: {}

    })

    const val = await postApiJson(toggleNotePublic(note._id), undefined)

    if (!val.error) {

      setNote({ ...note, isPublic: val })

      sendMiniMessage({

        icon: { name: "ok", style: {} },

        content: { text: "Toggled!", style: {} },

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

  useEffect(async () => {

    setLoadingNote(true)

    const noteData = await getApiJson(getNote(noteID))

    if (noteData.error) {

      setInvalidNote(true)

      setLoadingNote(false)

    } else {

      setInvalidNote(false)

      setNote(noteData)

      setLoadingNote(false)

      dispatch(setActiveNote(noteData._id))

    }

    return () => { dispatch(setActiveNote("")) }

  }, [noteID])

  return (

    <NoteSettingStyle style={theRightStyle(divider)}>

      {(!loadingNote && !invalidNote) && <>

        <div className="note-sett-pack">

          <div className="intro">

            <h1>{note.name}</h1>

            <p>Alter the properties of your note</p>

          </div>

          <NoteName {...{ note, setNote, userData }} />

          <NoteTags {...{ note, setNote, userData }} />

          <NoteSections {...{ note, setNote, userData }} />

          <div className="form-pack">

            <label htmlFor="el-aid-sect-pb">Public Link (if allowed)</label>

            <div className="inp-hol">

              <input type="text" id="el-aid-sect-pb" name="el-aid-sect-pb" value={`${host}/public/note/${note._id}`} readOnly />

              <button className="rt-sd-btn-ab" onClick={() => copyTextX(`${host}/public/note/${note._id}`)}><FaCopy size="1rem" /></button>

            </div>

          </div>

          <div className="form-pack">

            <label htmlFor="el-aid-sect-cre">Date Created</label>

            <div className="inp-hol">

              <input type="text" id="el-aid-sect-cre" name="el-aid-sect-cre" value={convertDate(note.createdAt)} readOnly />

            </div>

          </div>

          <div className="form-pack">

            <label htmlFor="el-aid-sect-up">Last Updated</label>

            <div className="inp-hol">

              <input type="text" id="el-aid-sect-up" name="el-aid-sect-up" value={convertDate(note.updatedAt)} readOnly />

            </div>

          </div>

          <div className="form-pack check">

            <label htmlFor="el-aid-sect-ch">Public Note:</label>

            <div className="inp-ch-hol">

              <input type="checkbox" name="el-aid-sect-ch" id="el-aid-sect-ch" checked={note.isPublic} onChange={togglePublic} />

            </div>

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

        <Oval width="8rem" height="8rem" color="white" secondaryColor="white" />

        <span>{loadingText}</span>

      </div>}

    </NoteSettingStyle>

  )

}

const NoteSettingStyle = styled.div`

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
  
  .note-sett-pack{
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
        padding: 0 1rem;
        border-radius: 0.3rem;
        transition: background-color .5s;
        
        &:hover{
          background-color: red;
        }
      }
  
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

  @media screen and (max-width: 700px) {
    width: 100%; left: 0%;
  }
`


export default NoteSetting

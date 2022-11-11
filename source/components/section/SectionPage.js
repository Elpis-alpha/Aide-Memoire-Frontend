import { Oval } from "react-loader-spinner"

import { getApiJson, patchApiJson, postApiJson, deleteApiJson } from "../../controllers/APICtrl"

import { useDispatch, useSelector } from "react-redux"

import { FaCopy } from "react-icons/fa"

import { useRouter } from "next/router"

import { useEffect, useState } from "react"

import styled from "styled-components"

import { getSection, toggleSectionOpen, toggleSectionPublic, updateSection, deleteSection, getSectionNotes, removeSection } from "../../api"

import { sendMiniMessage, sendXMessage } from "../../controllers/MessageCtrl"

import { reloadTree, setActiveNote } from "../../store/slice/noteSlice"

import { datetoDateStr, datetoFullTimeStr } from "../../controllers/TimeCtrl"

import { host } from "../../__env"

import { copyText, theRightStyle } from "../../controllers/SpecialCtrl"


const SectionPage = ({ sectionID }) => {

  const router = useRouter()

  const dispatch = useDispatch()

  const { divider } = useSelector(store => store.display)

  const { data: userData } = useSelector(store => store.user)

  const [loadingSection, setLoadingSection] = useState(true)

  const [invalidSection, setInvalidSection] = useState(false)

  const [loadingText, setLoadingText] = useState("Loading Section")

  const [sectName, setSectName] = useState("")

  const [sectDesc, setSectDesc] = useState("")

  const [section, setSection] = useState({})

  const getWidth = divider => 100 - parseInt(divider) + '%'

  const copyTextX = text => {

    sendMiniMessage({

      icon: { name: "copy", style: {} },

      content: { text: "Text Copied!", style: {} },

      style: {}

    }, 2000)

    copyText(text)

  }

  const keyDownHandler = async e => {

    if (e.keyCode === 13) {

      e.target.blur()

      await saveThisName()

    }

  }

  const saveThisName = async () => {

    if (sectName === section.name) return false

    if (sectName.trim().length === 0) return false

    sendMiniMessage({

      icon: { name: "loading", style: {} },

      content: { text: "Renaming Section!", style: {} },

      style: {}

    })

    const newName = await patchApiJson(updateSection(section._id), {

      name: sectName

    })

    if (newName.error) {

      sendMiniMessage({

        icon: { name: "times", style: {} },

        content: { text: "An Error Occured!", style: {} },

        style: {}

      }, 2000)

      return false

    } else {

      dispatch(reloadTree("user"))

      sendMiniMessage({

        icon: { name: "ok", style: {} },

        content: { text: "Section Renamed!", style: {} },

        style: {}

      }, 2000)

      setSection(newName)

    }

  }

  const saveThisDesc = async () => {

    if (sectDesc === section.description) return false

    if (sectDesc.trim().length === 0) return false

    sendMiniMessage({

      icon: { name: "loading", style: {} },

      content: { text: "Saving Description!", style: {} },

      style: {}

    })

    const newName = await patchApiJson(updateSection(section._id), {

      description: sectDesc

    })

    if (newName.error) {

      sendMiniMessage({

        icon: { name: "times", style: {} },

        content: { text: "An Error Occured!", style: {} },

        style: {}

      }, 2000)

      return false

    } else {

      sendMiniMessage({

        icon: { name: "ok", style: {} },

        content: { text: "Description Changed!", style: {} },

        style: {}

      }, 2000)

      setSection(newName)

    }

  }

  const convertDate = date => {

    return datetoDateStr(new Date(date)) + ", " + datetoFullTimeStr(new Date(date))

  }

  const toggleOpen = async () => {

    sendMiniMessage({

      icon: { name: "loading", style: {} },

      content: { text: "Toggling Open!", style: {} },

      style: {}

    })

    const val = await postApiJson(toggleSectionOpen(section._id), undefined)

    if (!val.error) {

      setSection({ ...section, open: val })

      dispatch(reloadTree("user"))

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

  const togglePublic = async () => {

    sendMiniMessage({

      icon: { name: "loading", style: {} },

      content: { text: "Toggling Public!", style: {} },

      style: {}

    })

    const val = await postApiJson(toggleSectionPublic(section._id), undefined)

    if (!val.error) {

      setSection({ ...section, isPublic: val })

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

  const deleteSectionX = async () => {

    const res = await sendXMessage({

      heading: { text: "Confirm Delete", style: {} },

      content: { text: "Are you sure you want to delete this section. Note that this action will not delete the notes referenced with this section" },

      buttons: [

        { text: 'Yes Delete', waitFor: 'se', style: { backgroundColor: 'darkred' } },

        { text: 'Go Back', waitFor: 're', style: { backgroundColor: '#607d8b' } },

      ],

    })

    if (res !== "se") return false

    setLoadingText("Deleting Section")

    setLoadingSection(true)

    const notes = await getApiJson(getSectionNotes(section._id))

    for (const note of notes) {

      await postApiJson(removeSection(note._id), { id: section._id })

    }

    await deleteApiJson(deleteSection(section._id), undefined)

    dispatch(reloadTree("user"))

    router.push(`/user/${userData.email}`)

  }

  useEffect(async () => {

    setLoadingSection(true)

    const sectData = await getApiJson(getSection(sectionID))

    if (sectData.error) {

      setInvalidSection(true)

      setLoadingSection(false)

    } else {

      setInvalidSection(false)

      setSectName(sectData.name)

      setSectDesc(sectData.description)

      setSection(sectData)

      setLoadingSection(false)

      dispatch(setActiveNote(sectData._id))

    }

    return () => { dispatch(setActiveNote("")) }

  }, [sectionID])


  return (

    <SectionPageStyle style={theRightStyle(divider)}>

      {(!loadingSection && !invalidSection) && <>

        <div className="sect-sett-pack">

          <div className="intro">

            <h1>{section.name} Section</h1>

          </div>

          <div className="form-pack">

            <label htmlFor="el-aid-sect-name">Name</label>

            <div className="inp-hol">

              <input type="text" id="el-aid-sect-name" name="el-aid-sect-name" value={sectName}

                onInput={e => setSectName(e.target.value)} onBlur={saveThisName} onKeyDown={keyDownHandler} />

            </div>

          </div>

          <div className="form-pack">

            <label htmlFor="el-aid-sect-desc">Description</label>

            <div className="inp-hol">

              <textarea id="el-aid-sect-desc" name="el-aid-sect-desc" value={sectDesc}

                onInput={e => setSectDesc(e.target.value)} onBlur={saveThisDesc}></textarea>

            </div>

          </div>

          {/* <div className="form-pack">

            <label htmlFor="el-aid-sect-pb">Public Link (if allowed)</label>

            <div className="inp-hol">

              <input type="text" id="el-aid-sect-pb" name="el-aid-sect-pb" value={`${host}/public/section/${section._id}`} readOnly />

              <button className="rt-sd-btn-ab" onClick={() => copyTextX(`${host}/public/section/${section._id}`)}><FaCopy size="1pc" /></button>

            </div>

          </div> */}

          <div className="form-pack">

            <label htmlFor="el-aid-sect-cre">Date Created</label>

            <div className="inp-hol">

              <input type="text" id="el-aid-sect-cre" name="el-aid-sect-cre" value={convertDate(section.createdAt)} readOnly />

            </div>

          </div>

          <div className="form-pack">

            <label htmlFor="el-aid-sect-up">Last Updated</label>

            <div className="inp-hol">

              <input type="text" id="el-aid-sect-up" name="el-aid-sect-up" value={convertDate(section.updatedAt)} readOnly />

            </div>

          </div>

          {/* <div className="form-pack check">

            <label htmlFor="el-aid-sect-ch">Public Section:</label>

            <div className="inp-ch-hol">

              <input type="checkbox" name="el-aid-sect-ch" id="el-aid-sect-ch" checked={section.isPublic} onChange={togglePublic} />

            </div>

          </div> */}

          {/* <div className="form-pack check">

            <label htmlFor="el-aid-sect-op">Open:</label>

            <div className="inp-ch-hol">

              <input type="checkbox" name="el-aid-sect-op" id="el-aid-sect-op" checked={section.open} onChange={toggleOpen} />

            </div>

          </div> */}

          {section.canDelete && <div className="form-pack check">

            <button onClick={deleteSectionX}>Delete</button>

          </div>}

        </div>

      </>}

      {(!loadingSection && invalidSection) && <div className="note-invalid-pack">

        <div>

          This section either does not exist

          or is inaccessible to you.

        </div>

      </div>}

      {loadingSection && <div className="over-lo-all">

        <Oval width="8pc" height="8pc" color="white" secondaryColor="white" />

        <span>{loadingText}</span>

      </div>}

    </SectionPageStyle>

  )

}

const SectionPageStyle = styled.div`

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

  .sect-sett-pack{
    width: 100%;
    padding: 0.5pc;
    animation: opacity-in .5s 1;

    .intro{
      display: block;

      h1{
        text-align: center;
        font-size: 1.5pc;
        line-height: 3pc;
        padding-top: 0.5pc;
      }

      p{
        text-align: center;
      }
    }
  
    .form-pack{
      width: 100%;
      padding: 0 .5pc;
      padding-bottom: 1pc;
  
      label{
        font-weight: bold;
      }
  
      div.inp-hol{
        width: 100%;
  
        input{
          display: block;
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
          display: block;
          width: 100%;
          background-color: #f7f7f7;
          border: 0 none;
          outline: 0 none;
          border-radius: 0.3pc;
          padding: 0.1pc .5pc;
          box-shadow: inset 36px 36px 100px #dedede, inset -36px -36px 100px #ffffff;
          height: 5pc;
        }
        
        .rt-sd-btn-ab{
          position: absolute;
          top: 0pc;
          right: 0pc;
          bottom: 0pc;
          width: 1.7pc;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 0 none;
          background-color: transparent;
          color: #a4a4a4;
          border-radius: 0.2pc;
          cursor: pointer;
          padding: 0;
        }
      }

      &.check{
        display: flex;
        align-items: center;
        padding-bottom: .25pc;

        .inp-ch-hol{
          display: flex;
          align-items: center;
          padding-left: 0.25pc;
        }
      }

      button{
        border: 0 none;
        outline: 0 none;
        background-color: #ab1212;
        color: white;
        padding: 0 1pc;
        border-radius: 0.3pc;
        transition: background-color .5s;
        
        &:hover{
          background-color: red;
        }
      }
  
    }
  }

  .sect-invalid-pack{
    padding: 0.5pc;
    height: calc(100%);
    overflow: auto;
    font-size: 1.2pc;
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
      font-size: 1.5pc;
      line-height: 3pc;
    }
  }

  @media screen and (max-width: 700px) {
    width: 100%; left: 0%;
  }
`


export default SectionPage

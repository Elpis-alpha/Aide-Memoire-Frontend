import { Oval } from "react-loader-spinner"
import { getApiJson, postApiJson, deleteApiJson } from "../../controllers/APICtrl"
import { useDispatch, useSelector } from "react-redux"
import { FaCopy, FaSearch, FaShareAlt } from "react-icons/fa"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import styled from "styled-components"
import { getSection, toggleSectionPublic, deleteSection, getSectionNotes, removeSection } from "../../api"
import { sendMiniMessage, sendXMessage } from "../../controllers/MessageCtrl"
import { reloadTree, setActiveNote } from "../../store/slice/noteSlice"
import { complain, host } from "../../__env"
import { copyText, theRightStyle } from "../../controllers/SpecialCtrl"
import Note from "./Note"
import LENote from "./LENote"
import Link from "next/link"
import FloatingBackButton from "../general/FloatingBackButton"

const SectionPage = ({ sectionID }) => {
  const router = useRouter()
  const dispatch = useDispatch()
  const { divider } = useSelector(store => store.display)
  const [loadingSection, setLoadingSection] = useState(true)
  const [invalidSection, setInvalidSection] = useState(false)
  const [loadingText, setLoadingText] = useState("Loading Section")
  const [section, setSection] = useState({})
  const [notes, setNotes] = useState([])
  // const [prevSectID, setPrevSectID] = useState("")
  const [notesStatus, setNotesStatus] = useState("loading")
  const [searchNoteText, setSearchNoteText] = useState("")
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
    router.push(`/me`)
  }
  const shareThisSection = () => {

    const data = {
      title: section.name,
      text: section.description,
      url: `${host}/public/section/${section._id}`
    }

    if (navigator.canShare(data)) {
      navigator.share(data)
    } else {
      sendMiniMessage({
        icon: { name: "error", style: {} },
        content: { text: "Browser does not support share!", style: {} },
        style: {}
      }, 2000)
    }
  }
  useEffect(() => {
    const doStuff = async () => {
      setLoadingSection(true)
      setNotesStatus("loading")
      setSearchNoteText("")
      const sectData = await getApiJson(getSection(sectionID))
      if (sectData.error) {
        setInvalidSection(true)
        setLoadingSection(false)
        setNotesStatus("error")
      } else {
        setInvalidSection(false)
        setSection(sectData)
        setLoadingSection(false)
        dispatch(setActiveNote(sectData._id))

        try {
          const secNotes = await getApiJson(getSectionNotes(sectionID))
          if (secNotes.error) { setNotesStatus("error") }
          else {
            setNotes(secNotes)
            setNotesStatus("ok")
          }
        } catch (error) { setNotesStatus("error") }

      }
    }
    doStuff()
    // if (sectionID !== prevSectID) { setPrevSectID(sectionID); doStuff() }
    return () => { dispatch(setActiveNote("")) }
  }, [sectionID, dispatch])

  const filterNotes = (notes, text) => {
    if (text.length < 1) return notes
    let filteredNotes = []
    filteredNotes = filteredNotes.concat(notes.filter(note => note.name.toLowerCase().startsWith(text)))
    filteredNotes = filteredNotes.concat(notes.filter(note => (!note.name.toLowerCase().startsWith(text) && note.name.toLowerCase().includes(text))))
    return filteredNotes
  }

  return (
    <SectionPageStyle style={theRightStyle(divider)}>
      {(!loadingSection && !invalidSection) && <>
        <div className="sect-sett-pack">
          <div className="intro">
            <h1>Welcome to {section.name}</h1>
          </div>
          <div className="desc">
            <p>{section.description}</p>
          </div>
          <div className="pub">
            <div className="form-pack check">
              <label htmlFor="el-aid-sect-ch">Public Section:</label>
              <div className="inp-ch-hol">
                <input type="checkbox" name="el-aid-sect-ch" id="el-aid-sect-ch" checked={section.isPublic} onChange={togglePublic} />
              </div>
            </div>
            {section.isPublic && <div className="pub-break">
              <button className="rt-sd-btn-ab" onClick={() => copyTextX(`${host}/public/section/${section._id}`)}>
                <FaCopy size=".8pc" />
                {/* Copy */}
              </button>
              <button className="rt-sd-btn-ab" onClick={shareThisSection}>
                {/* Share  */}
                <FaShareAlt size=".8pc" />
              </button>
            </div>}
          </div>
          <div className="sep-sec-pub"></div>
          <div className="sec-notes">
            <h2>Notes</h2>
            <div className="search-cont">
              <div className="isc">
                <div className="src-ic"><FaSearch /></div>
                <input type="text" placeholder="Search Notes" onInput={e => setSearchNoteText(e.target.value.trim().toLowerCase())} />
                <div className="butt-cont"><button>Search</button></div>
              </div>
            </div>
            <div className="notes">
              {(notesStatus === "ok" && notes.length > 0) && <div className="good-notes">
                {filterNotes(notes, searchNoteText).map(note => <Note key={"sec-note:" + note._id} note={note} />)}
              </div>}
              {((notesStatus === "ok" && notes.length > 0) && filterNotes(notes, searchNoteText).length < 1) && <div className="t-notes">
                The search could not find any results
              </div>}
              {(notesStatus === "ok" && notes.length === 0) && <div className="t-notes">
                There are no notes in this section
              </div>}
              {notesStatus === "error" && <div className="t-notes">
                An error occured while fetching notes, <a href={complain} target="_blank" rel="noopener noreferrer">send a complaint to us here</a>
              </div>}
              {notesStatus === "loading" && <div className="loading-notes">
                <LENote />
                <LENote />
                <LENote />
                <LENote />
              </div>}
            </div>
          </div>
          <div className="form-pack delete">
            <Link href={`/section/${sectionID}/edit`}><a className="edit-btn">Edit Section</a></Link>
            <button onClick={deleteSectionX}>Delete Section</button>
          </div>
        </div>
      </>}
      {
        (!loadingSection && invalidSection) && <div className="sect-invalid-pack">
          <div>
            This section either does not exist
            or is inaccessible to you.
          </div>
        </div>
      }
      {
        loadingSection && <div className="over-lo-all">
          <Oval width="8pc" height="8pc" color="white" secondaryColor="white" />
          <span>{loadingText}</span>
        </div>
      }
      <FloatingBackButton href={"/me"} />
    </SectionPageStyle >
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
    padding: 1pc 1pc;
    animation: opacity-in .5s 1;

    .intro{
      display: block;

      h1{
        text-align: center;
        font-size: 1.5pc;
        line-height: 3pc;
        padding-top: 0.8pc;
        padding-bottom: 0.3pc;
      }

      p{
        text-align: center;
      }
    }

    .desc{
      display: block;
      padding-bottom: .7pc;

      p{
        text-align: center;
      }
    }
  
    .form-pack{
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
      }

      &.check{
        display: flex;
        align-items: center;

        .inp-ch-hol{
          display: flex;
          align-items: center;
          padding-left: 0.25pc;
        }
      }

      &.delete{
        display: flex;
        align-items: center;
        justify-content: space-around;
        text-align: center;

        .edit-btn {
          border: 0 none;
          outline: 0 none;
          width: 48%;
          line-height: 3pc;
          display: inline-block;
          text-decoration: none;
          /* margin-top: 1pc; */
          background-color: rgb(0,117,255);
          color: white;
          padding: 0 1pc;
          border-radius: 0.3pc;
          transition: background-color .5s;
          
          &:hover{
            background-color: #0155b4;
          }
        }
      }

      button{
        border: 0 none;
        outline: 0 none;
        line-height: 3pc;
        width: 48%;
        /* margin-top: 1pc; */
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

    .pub {
      display: flex;
      align-items: center;
      justify-content: center;
      .pub-break {
        margin-left: .8pc;
        padding-left: .8pc;
        border-left: 1px solid #999;
        display: flex;
      }
      button {
        border: 0 none;
        outline: 0 none;
        background-color: #0075ff;
        color: white;
        padding: .7pc 0.5pc;
        /* border-radius: 0.3pc; */
        display: flex;
        align-items: center;
        justify-content: center;
        transition: background-color .5s;

        &:first-child {
          padding-left: 1pc;
          border-radius: .4pc 0 0 .4pc;
          
          svg {
            margin-right: .3pc;
          }
        }

        &:last-child {
          padding-right: 1pc;
          border-radius: 0 .4pc .4pc 0;

          svg {
            margin-left: .3pc;
          }
        }


        &:hover{
          background-color: #0155b4;
        }
      }
    }

    .sep-sec-pub {
      width: 15vw;
      height: 1px;
      background-color: #999;
      margin: 2pc auto;
      margin-top: 3pc;
    }

    .sec-notes {
      padding: 1pc;
      padding-top: 0;
      h2 {
        font-size: 1.3pc;
        line-height: 2.2pc;
        text-align: center;
      }
      .t-notes {
        padding: 1pc;
        text-align: center;
      }

      .search-cont {

        .isc {

          input {
            height: auto;
            border: 0px none;
            outline: none 0px;
            /* color: rgb(221, 221, 221); */
            width: 100%;
            padding: .5pc 2.7pc ;
            padding-left: 2.8pc;
            padding-right: 2.5pc;
            background-color: rgba(0, 0, 0, 0.1);
            box-shadow: rgb(0 0 0 / 5%) 4px 4px 10px inset;
            border-radius: 5px;
          }

          .butt-cont {
            position: absolute;
            top: 0px;
            right: 0px;
            bottom: 0px;
            padding: 0px 0.5pc 0px 0.2pc;
            display: flex;
            align-items: center;
            justify-content: center;
            
            button {
              font-weight: bold;
              color: rgb(0, 0, 0);
              cursor: pointer;
              border: 0px none;
              outline: none 0px;
              background-color: rgba(0, 0, 0, 0.15);
              box-shadow: rgb(0 0 0 / 5%) 4px 4px 10px inset;
              border-radius: 5px;
              transition: background-color 0.2s ease 0s, box-shadow 0.2s ease 0s;
              padding: 0pc 1pc;
            }
          }
          
          .src-ic {
            position: absolute;
            top: 0px;
            left: 0px;
            bottom: 0px;
            padding: 0px 0.2pc 0px 0.9pc;
            font-size: 1.3pc;
            display: flex;
            align-items: center;
            justify-content: center;
          }
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
    text-align: center;
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

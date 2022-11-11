import { AiOutlinePlus } from "react-icons/ai"

import { FaFolder, FaTimes } from "react-icons/fa"

import { useEffect, useRef, useState } from "react"

import Parse from "html-react-parser"

import { getApiJson, patchApiJson, postApiJson } from "../../../controllers/APICtrl"

import styled from "styled-components"

import { editUser, getPrivateSections } from "../../../api"

import { sendMiniMessage } from "../../../controllers/MessageCtrl"

import { useDispatch } from "react-redux"

import { setUserData } from "../../../store/slice/userSlice"


const NoteSections = ({ userData }) => {

  const dispatch = useDispatch()

  const [addSectionX, setAddSectionX] = useState("")

  const [filteredList, setFilteredList] = useState([])

  const [sectionsList, setSectionsList] = useState(userData.noteSections)

  const [userSections, setUserSections] = useState([])

  const inputRef = useRef(null)

  const removeSectionX = async sect => {

    sendMiniMessage({

      icon: { name: "loading", style: {} },

      content: { text: "Removing Section!", style: {} },

      style: {}

    })

    const newLi = sectionsList.filter(sectx => sectx._id !== sect._id)

    const sectionList = await patchApiJson(editUser(), {

      noteSections: newLi

    })

    if (sectionList.error) {

      sendMiniMessage({

        icon: { name: "times", style: {} },

        content: { text: "An Error Occured!", style: {} },

        style: {}

      }, 2000)

    } else {

      dispatch(setUserData({ ...userData, ...sectionList }))

      setSectionsList(newLi)

      sendMiniMessage({

        icon: { name: "ok", style: {} },

        content: { text: "Removed!", style: {} },

        style: {}

      }, 2000)

    }

  }

  const convertI = item => {

    let returnText = item.name

    const sv = addSectionX.trim().toLowerCase()

    const iv = item.name

    returnText = iv.replaceAll(sv, `<b>${iv.substr(iv.toLowerCase().indexOf(sv), sv.length)}</b>`)

    return returnText

  }

  const clickAutoC = item => {

    setAddSectionX("");

    addASection(item)

    setTimeout(() => {

      inputRef.current.focus()

    }, 100)

  }

  const inputHandler = e => {

    const text = e.target.value.trim().toLowerCase()

    setAddSectionX(e.target.value)

    const filteredLis = userSections.filter(sect => sect.name.toLowerCase().includes(text))

    setFilteredList(filteredLis)

  }

  const addASection = async section => {

    sendMiniMessage({

      icon: { name: "loading", style: {} },

      content: { text: "Adding Section!", style: {} },

      style: {}

    })

    if (!section) {

      section = sectionsList.find(sect => sect.name === addSectionX)

      if (!section) {

        sendMiniMessage({

          icon: { name: "times", style: {} },

          content: { text: "Invalid Section!", style: {} },

          style: {}

        }, 2000)

        return false

      }

    }

    let newList = sectionsList.concat(section)

    newList = newList.filter((v, i, s) => s.findIndex(h => h._id.toString() === v._id.toString()) === i)

    if (newList.length === sectionsList.length) {

      sendMiniMessage({

        icon: { name: "times", style: {} },

        content: { text: "Duplicate Section!", style: {} },

        style: {}

      }, 2000)

      return false

    }

    const sectionsL = await patchApiJson(editUser(), {

      noteSections: newList

    })

    if (sectionsL.error) {

      sendMiniMessage({

        icon: { name: "times", style: {} },

        content: { text: "An Error Occured!", style: {} },

        style: {}

      }, 2000)

      return false

    }

    sendMiniMessage({

      icon: { name: "ok", style: {} },

      content: { text: "Section Added!", style: {} },

      style: {}

    }, 2000)

    dispatch(setUserData({ ...userData, ...sectionsL }))

    setSectionsList(newList)

    setAddSectionX("")

  }

  useEffect(() => {

    String.prototype.replaceAll = function (strReplace, strWith) {

      var esc = strReplace.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');

      var reg = new RegExp(esc, 'ig');

      return this.replace(reg, strWith);

    };

  }, [])

  useEffect(async () => {

    const userSections = await getApiJson(getPrivateSections())

    setUserSections(userSections)

  }, [])

  return (

    <NoteSectionsStyle>

      <label htmlFor="el-aid-note-section">Default Note Sections</label>

      <div className="note-sections-all">

        {sectionsList.map(sect => <div className="sect-time" key={sect._id}>

          <span className="v">

            <span><FaFolder size="1pc" /></span>

            <span className="g">{sect.name}</span>

          </span>

          <span className="x" onClick={() => removeSectionX(sect)}><FaTimes size="1pc" /></span>

        </div>)}

        {sectionsList.length === 0 && <div className="empt">No Sections Included</div>}

      </div>

      <div className="inp-hol">

        <form onSubmit={e => { e.preventDefault(); addASection() }}>

          <input type="text" id="el-aid-note-section" name="el-aid-note-section" placeholder="Add a section here"

            ref={inputRef} value={addSectionX} onInput={inputHandler} onFocus={inputHandler} autoComplete="off" onBlur={() => setFilteredList([])} />

          <button className="rt-sd-btn-ab"><AiOutlinePlus /></button>

        </form>

        <div className="auto-comp-li">

          {filteredList.map(item => <div className="it" key={item._id} onMouseDown={() => clickAutoC(item)}>

            <span><FaFolder size={"1pc"} /></span>

            <span style={{ display: "inline-block" }}>{Parse(convertI(item))}</span>

          </div>)}

        </div>

      </div>

    </NoteSectionsStyle>

  )

}

const NoteSectionsStyle = styled.div`
  width: 100%;
  padding: 1pc .5pc;

  label{
    font-weight: bold;
    /* font-size: .9pc; */
  }

  .note-sections-all{

    border-radius: 1pc;
    background: #f7f7f7;
    box-shadow: inset 20px 20px 60px #d2d2d2, inset -20px -20px 60px #ffffff;
    padding: 1pc;
    padding-bottom: 0.3pc;
    margin-bottom: 1pc;
    display: flex;
    flex-wrap: wrap;
    
    .sect-time{
      background-color: #d3d3d3;
      color: black;
      border-radius: 0.5pc;
      padding: 0 .5pc;
      width: 100%;
      margin-bottom: .2pc;
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: linear-gradient(315deg, #cacaca, #aaaaaa);
      box-shadow:  0 0 2px #676767;
      margin-bottom: .7pc;
      
      span{
        display: flex;
        align-items: center;
        transition: color .5s;

        &.x{
          cursor: pointer;
          
          &:hover{
            color: darkred;
          }
        }

        &.g{
          padding-left: 0.5pc;
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

    .rt-sd-btn-ab{
      position: absolute;
      top: 0.4pc;
      right: .4pc;
      bottom: 0.4pc;
      width: 1.5pc;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 0 none;
      background-color: #b6b6b6;
      border-radius: 0.2pc;
      color: white;
      cursor: pointer;
    }
  }
  
  .auto-comp-li{
    position: absolute;
    left: 0; right: 0;
    width: 100%;
    background-color: #f3f3f3;
    top: 105%;
    z-index: 10;
    box-shadow: 2px 2px 5px 0 black;
    max-height: 10pc;
    overflow: auto;

    div.it{
      border-bottom: 1px solid #d3d3d3;
      height: 2pc;
      cursor: pointer;
      transition: background-color .5s, color .5s;
      line-height: 1.5pc;
      display: flex;
      align-items: center;
      padding-left: 0.5pc;

      &.load{
        justify-content: center;
        cursor: progress;
        
        &:hover{
          background-color: transparent;
        }
      }

      span{
        display: inline-flex;
        align-items: center;
        margin-right: .5pc;
      }

      &:hover{
        background-color: rgb(60 115 233);
        color: white;
      }
    }
  }
`

export default NoteSections

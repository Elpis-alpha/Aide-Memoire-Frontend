import { FaTimes } from "react-icons/fa"

import { AiFillTags, AiOutlinePlus } from "react-icons/ai"

import { useRef, useState } from "react"

import { Oval } from "react-loader-spinner"

import Parse from "html-react-parser"

import { getApiJson, postApiJson, patchApiJson } from "../../../controllers/APICtrl"

import styled from "styled-components"

import { editUser, createTag, filterTag, getTagByName } from "../../../api"

import { sendMiniMessage } from "../../../controllers/MessageCtrl"

import { waitFor } from "../../../controllers/TimeCtrl"

import { useDispatch } from "react-redux"

import { setUserData } from "../../../store/slice/userSlice"


const NoteTags = ({ userData }) => {

  const dispatch = useDispatch()

  const [addTag, setAddTag] = useState("")

  const [filteredList, setFilteredList] = useState([])

  const [loadingTag, setLoadingTag] = useState(false)

  const [tagsList, setTagsList] = useState(userData.noteTags)

  const inputRef = useRef(null)

  const removeTagX = async tax => {

    sendMiniMessage({

      icon: { name: "loading", style: {} },

      content: { text: "Removing Tag!", style: {} },

      style: {}

    })

    const newLi = tagsList.filter(tag => tag._id !== tax._id)

    const tagListX = await patchApiJson(editUser(), {

      noteTags: newLi

    })

    if (tagListX.error) {

      sendMiniMessage({

        icon: { name: "times", style: {} },

        content: { text: "An Error Occured!", style: {} },

        style: {}

      }, 2000)

    } else {

      dispatch(setUserData({ ...userData, ...tagListX }))

      setTagsList(newLi)

      sendMiniMessage({

        icon: { name: "ok", style: {} },

        content: { text: "Removed!", style: {} },

        style: {}

      }, 2000)

    }

  }

  const convertI = item => {

    let returnText = item.name

    const sv = addTag.trim().toLowerCase()

    const iv = item.name

    returnText = iv.replaceAll(sv, `<b>${iv.substr(iv.toLowerCase().indexOf(sv), sv.length)}</b>`)

    return returnText

  }

  const clickAutoC = (item) => {

    setAddTag("");

    addATag(item)

    setTimeout(() => {

      inputRef.current.focus()

    }, 100)

  }

  const testTag = async e => {

    e.preventDefault();

    sendMiniMessage({

      icon: { name: "loading", style: {} },

      content: { text: `Checking Tag`, style: {} },

      style: {}

    })

    let text = addTag.trim().toLowerCase().replaceAll('/', '').replaceAll(' ', '-')

    const tag = await getApiJson(getTagByName(text))

    if (tag.error) {

      if (text.length > 0) {

        sendMiniMessage({

          icon: { name: "loading", style: {} },

          content: { text: `Creating Tag: ${text}`, style: {} },

          style: {}

        })

        const newTag = await postApiJson(createTag(), { name: text })

        if (newTag.error) {

          sendMiniMessage({

            icon: { name: "times", style: {} },

            content: { text: `An Error Occured`, style: {} },

            style: {}

          }, 2000)

        } else {

          sendMiniMessage({

            icon: { name: "ok", style: {} },

            content: { text: `Tag Created`, style: {} },

            style: {}

          }, 2000)

          addATag(newTag)

        }

      }

    } else {

      addATag(tag)

    }

  }

  const inputHandler = async e => {

    setLoadingTag(true)

    setFilteredList([])

    setAddTag(e.target.value)

    let text = e.target.value.trim().toLowerCase().replaceAll('/', '').replaceAll(' ', '-')

    await waitFor(100)

    if (e.target.value.trim().toLowerCase().replaceAll('/', '').replaceAll(' ', '-') === text) {

      if (document.activeElement !== e.target) { setLoadingTag(false); return false }

      if (text.length < 1) text = "a"

      const filteredLis = await getApiJson(filterTag(text))

      if (e.target.value.trim().toLowerCase() === text || (e.target.value.trim().toLowerCase() === "" && text === 'a')) {

        if (document.activeElement !== e.target) { setLoadingTag(false); return false }

        setFilteredList(filteredLis)

        setLoadingTag(false)

      }

    }

  }

  const addATag = async tag => {

    sendMiniMessage({

      icon: { name: "loading", style: {} },

      content: { text: "Adding Tag!", style: {} },

      style: {}

    })

    let newList = tagsList.concat(tag)

    newList = newList.filter((v, i, s) => s.findIndex(h => h._id.toString() === v._id.toString()) === i)

    if (newList.length === tagsList.length) {

      sendMiniMessage({

        icon: { name: "times", style: {} },

        content: { text: "Duplicate Tag!", style: {} },

        style: {}

      }, 2000)

      return false

    }

    const tagsL = await patchApiJson(editUser(), {

      noteTags: newList

    })

    if (tagsL.error) {

      sendMiniMessage({

        icon: { name: "times", style: {} },

        content: { text: "An Error Occured!", style: {} },

        style: {}

      }, 2000)

      return false

    }

    dispatch(setUserData({ ...userData, ...tagsL }))

    setTagsList(newList)

    sendMiniMessage({

      icon: { name: "ok", style: {} },

      content: { text: "Tag Added!", style: {} },

      style: {}

    }, 2000)

    setAddTag("")

  }

  return (

    <NoteTagsStyle>

      <label htmlFor="el-aid-note-tag">Default Note Tags</label>

      <div className="note-tags-all">

        {tagsList.map(tax => <div className="tax-time" key={tax._id}>

          <span className="a"><AiFillTags size=".8pc" /></span>

          <span className="t">{tax.name}</span>

          <span className="x" onClick={() => removeTagX(tax)}><FaTimes size=".8pc" /></span>

        </div>)}

        {tagsList.length === 0 && <div className="empt">No Tags Included</div>}

      </div>

      <div className="inp-hol">

        <form onSubmit={testTag}>

          <input type="text" id="el-aid-note-tag" name="el-aid-note-tag" placeholder="Add a tag here or create a new one (Hit enter to add)"

            ref={inputRef} value={addTag} onInput={inputHandler} onFocus={inputHandler} autoComplete="off" onBlur={() => setFilteredList([])} />

          <button className="rt-sd-btn-ab"><AiOutlinePlus /></button>

        </form>

        <div className="auto-comp-li">

          {filteredList.map(item => <div className="it" key={item._id} onMouseDown={e => clickAutoC(item)}>

            <span><AiFillTags size={"1pc"} /></span>

            {Parse(convertI(item))}

          </div>)}

          {loadingTag && <div className="it load"><Oval width="1pc" height="1pc" color="black" secondaryColor="black" /></div>}

        </div>

      </div>

    </NoteTagsStyle>

  )

}

const NoteTagsStyle = styled.div`
  width: 100%;
  padding: 1pc .5pc;

  label{
    font-weight: bold;
  }

  .note-tags-all{
    border-radius: 1pc;
    background: #f7f7f7;
    box-shadow: inset 20px 20px 60px #d2d2d2, inset -20px -20px 60px #ffffff;
    padding: 1pc;
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

export default NoteTags

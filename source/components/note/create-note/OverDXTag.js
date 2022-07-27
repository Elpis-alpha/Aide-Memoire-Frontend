import styled from "styled-components"

import { Oval } from "react-loader-spinner"

import Parse from "html-react-parser"

import { useRef, useState } from "react"

import { FaTimes } from "react-icons/fa"

import { AiFillTags } from "react-icons/ai"

import { sendMiniMessage } from "../../../controllers/MessageCtrl"

import { filterTag, getTagByName, createTag } from "../../../api"

import { getApiJson, postApiJson } from "../../../controllers/APICtrl"

import { waitFor } from "../../../controllers/TimeCtrl"

import { useRouter } from "next/router"


const OverDXTag = ({ tagList, setTagList, show, setShow, createNoteX }) => {

  const router = useRouter()

  const [addTag, setAddTag] = useState("")

  const [filteredList, setFilteredList] = useState([])

  const [loadingTag, setLoadingTag] = useState(false)

  const inputRef = useRef(null)

  const addATag = tag => {

    let newList = tagList.concat(tag)

    newList = newList.filter((v, i, s) => s.findIndex(h => h._id.toString() === v._id.toString()) === i)

    setTagList(newList)

    if (newList.length === tagList.length) {

      sendMiniMessage({

        icon: { name: "times", style: {} },

        content: { text: "Duplicate Tag!", style: {} },

        style: {}

      }, 2000)

      return false

    } else {

      sendMiniMessage({

        icon: { name: "ok", style: {} },

        content: { text: "Tag Added!", style: {} },

        style: {}

      }, 2000)

    }

    setAddTag("")

  }

  const testTag = async e => {

    e.preventDefault();

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

  const removeTag = tax => {

    let newList = tagList.filter(item => item._id !== tax._id)

    setTagList(newList)

    sendMiniMessage({

      icon: { name: "ok", style: {} },

      content: { text: "Removed!", style: {} },

      style: {}

    }, 2000)

  }

  const convertI = item => {

    let returnText = item.name

    const sv = addTag.trim().toLowerCase()

    const iv = item.name

    returnText = iv.replaceAll(sv, `<b>${iv.substr(iv.toLowerCase().indexOf(sv), sv.length)}</b>`)

    return returnText

  }

  const inputHandle = async e => {

    setLoadingTag(true)

    setFilteredList([])

    let text = e.target.value.trim().toLowerCase()

    setAddTag(e.target.value)

    await waitFor(100)

    text = text.replaceAll('/', '').replaceAll(' ', '-')

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

  const clickAutoC = (item) => {

    setAddTag("");

    addATag(item)

    setTimeout(() => {

      inputRef.current.focus()

    }, 100)

  }

  if (show !== 'tag') return false

  return (

    <OverDXStyle>

      <div className="heading">Add a Tag to Your Note</div>

      <div className="body">

        <div className="tag-list">

          {tagList.map(tax => <div className="tax-time" key={tax._id}>

            <span className="a"><AiFillTags size=".8rem" /></span>

            <span className="t">{tax.name}</span>

            <span className="x" onClick={() => removeTag(tax)}><FaTimes size=".8rem" /></span>

          </div>)}

          {tagList.length === 0 && <div className="empt">No Tags Included</div>}

        </div>

        <div className="add-li-x">

          <form onSubmit={testTag}>

            <input type="text" required value={addTag} onInput={inputHandle} placeholder="Tag Name (Adding an inexistent tag will create it)"

              autoFocus onBlur={() => setFilteredList([])} onFocus={inputHandle} ref={inputRef} autoComplete="off" />

            <button>Add</button>

          </form>

          <div className="auto-comp-li">

            {filteredList.map(item => <div className="it" key={item._id} onMouseDown={e => clickAutoC(item)}>

              <span><AiFillTags size={"1rem"} /></span>

              {Parse(convertI(item))}

            </div>)}

            {loadingTag && <div className="it load"><Oval width="1rem" height="1rem" color="black" secondaryColor="black" /></div>}

          </div>

        </div>

      </div>

      <div className="foot">

        <button onClick={() => setShow("section")}>Go Back</button>

        <button onClick={async () => { setShow("save-x"); await createNoteX("read") }}>Save Note</button>

      </div>

    </OverDXStyle>

  )

}

const OverDXStyle = styled.div`

  padding: 1rem;
  border-radius: .5rem;
  background-color: #f7f7f7;
  width: 80%;
  display: block;
  margin: 0 auto;
  box-shadow: 10px 10px 20px #7f7f7f, -10px -10px 20px #bdbdbd;
  animation: opacity-in .5s 1;

  .heading{
    width: 100%;
    font-size: 1.2pc;
    font-weight: bold;
    line-height: 3pc;
    text-align: center;
  }

  .body{
    width: 100%;

    .tag-list{

      padding-bottom: 0.5rem;
      display: flex;
      flex-wrap: wrap;

      .tax-time{
        background-color: #2f2f2f;
        color: white;
        border-radius: 0.5pc;
        padding: 0 .3pc;
        line-height: 1.5pc;
        margin-bottom: .2rem;
        margin-right: .2pc;
        display: flex;
        align-items: center;
        justify-content: space-between;
        
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
            padding: 0 .3rem;
          }
        }
      }

      .empt{
        width: 100%;
        font-style: italic;
        text-align: center;
      }
    }

    .add-li-x{

      form{
        display: contents;
      }

      display: flex;

      input{
        flex: 1;
        margin: 0;
      }

      button{
        padding: 0 .5rem;
        margin-left: .3rem;
        border: 0 none;
        outline: 0 none;
        background-color: #a9a9a9;
        color: white;
        cursor: pointer;
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
    }

    input{
      width: 80%;
      background-color: transparent;
      border: 1px solid grey;
      outline: 0 none;
      margin: 0 auto;
      display: block;
      padding: 0.2rem .5rem;
    }
  }

  .foot{
    padding-top: 0.6pc;
    display: flex;
    
    button{
      background-color: rgb(60 115 233);
      border: 0 none; outline: 0 none;
      width: 40%;
      display: block;
      margin: 0 auto;
      color: white;
      border-radius: 0.3rem;
      cursor: pointer;
      transition: background-color .5s;

      &:hover{
        background-color: green;
      }
    }
  }
`

export default OverDXTag

import styled from "styled-components"

import Parse from "html-react-parser"

import { useEffect, useState, useRef } from "react"

import { FaFolder, FaTimes } from "react-icons/fa"

import { sendMiniMessage } from "../../../controllers/MessageCtrl"


const OverDXSection = ({ sectionList, setSectionList, userSections, show, setShow }) => {

  const [addSection, setAddSection] = useState("")

  const [filteredList, setFilteredList] = useState([])

  const inputRef = useRef(null)

  const addASection = text => {

    let sect = userSections.find(sect => sect.name === addSection.trim())

    if (text) sect = userSections.find(sect => sect.name === text)

    if (!sect) {

      sendMiniMessage({

        icon: { name: "times", style: {} },

        content: { text: "Invalid Section!", style: {} },

        style: {}

      }, 2000)

      return false

    }

    let newList = sectionList.concat(sect)

    newList = newList.filter((v, i, s) => s.findIndex(h => h._id.toString() === v._id.toString()) === i)

    setSectionList(newList)

    if (newList.length === sectionList.length) {

      sendMiniMessage({

        icon: { name: "times", style: {} },

        content: { text: "Duplicate Section!", style: {} },

        style: {}

      }, 2000)

      return false

    } else {

      sendMiniMessage({

        icon: { name: "ok", style: {} },

        content: { text: "Section Added!", style: {} },

        style: {}

      }, 2000)

    }

    setAddSection("")

  }

  const removeSection = sect => {

    let newList = sectionList.filter(item => item.name !== sect.name)

    setSectionList(newList)

    sendMiniMessage({

      icon: { name: "ok", style: {} },

      content: { text: "Removed!", style: {} },

      style: {}

    }, 2000)

  }

  const convertI = item => {

    let returnText = item.name

    const sv = addSection.trim().toLowerCase()

    const iv = item.name

    returnText = iv.replaceAll(sv, `<b>${iv.substr(iv.toLowerCase().indexOf(sv), sv.length)}</b>`)

    return returnText

  }

  const clickAutoC = (item) => {

    setAddSection("");

    addASection(item.name);

    setTimeout(() => {

      inputRef.current.focus()

    }, 100)

  }

  useEffect(() => {

    String.prototype.replaceAll = function (strReplace, strWith) {

      var esc = strReplace.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');

      var reg = new RegExp(esc, 'ig');

      return this.replace(reg, strWith);

    };

  }, [])


  const inputHandle = e => {

    const text = e.target.value.trim().toLowerCase()

    setAddSection(e.target.value)

    const filteredLis = userSections.filter(sect => sect.name.toLowerCase().includes(text))

    setFilteredList(filteredLis)

  }

  if (show !== 'section') return false

  return (

    <OverDXStyle>

      <div className="heading">Reference Your Note to a Section</div>

      <div className="body">

        <div className="section-list">

          {sectionList.map(sect => <div className="sect-time" key={sect._id}>

            <span className="v">

              <span><FaFolder size="1pc" /></span>

              <span className="g">{sect.name}</span>

            </span>

            <span className="x" onClick={() => removeSection(sect)}><FaTimes size="1pc" /></span>

          </div>)}

          {sectionList.length === 0 && <div className="empt">No Sections Included</div>}

        </div>

        <div className="add-li-x">

          <form onSubmit={e => { e.preventDefault(); addASection() }}>

            <input type="text" required value={addSection} onInput={inputHandle} placeholder="Section Name"

              autoFocus onBlur={() => setFilteredList([])} onFocus={inputHandle} ref={inputRef} autoComplete="off" />

            <button>Add</button>

          </form>

          <div className="auto-comp-li">

            {filteredList.map(item => <div className="it" key={item._id} onMouseDown={() => clickAutoC(item)}>

              <span><FaFolder size={"1pc"} /></span>

              <span style={{ display: "inline-block" }}>{Parse(convertI(item))}</span>

            </div>)}

          </div>

        </div>

      </div>

      <div className="foot">

        <span onClick={() => setShow("name")}>Go Back</span>

        <span onClick={() => setShow("tag")}>Next</span>

      </div>

    </OverDXStyle>

  )

}

const OverDXStyle = styled.div`

  padding: 1pc;
  border-radius: .5pc;
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

    .section-list{

      padding-bottom: 0.5pc;

      .sect-time{
        background-color: #d3d3d3;
        color: black;
        border-radius: 0.5pc;
        padding: 0 .5pc;
        margin-bottom: .2pc;
        display: flex;
        align-items: center;
        justify-content: space-between;
        
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
        padding: 0 .5pc;
        margin-left: .3pc;
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
      padding: 0.2pc .5pc;
    }
  }

  .foot{
    padding-top: 0.5pc;
    display: flex;
    
    span{
      text-align: center;
      background-color: rgb(60 115 233);
      border: 0 none; outline: 0 none;
      width: 40%;
      display: block;
      margin: 0 auto;
      color: white;
      border-radius: 0.3pc;
      cursor: pointer;
      transition: background-color .5s;

      &:hover{
        background-color: green;
      }
    }
  }
`

export default OverDXSection

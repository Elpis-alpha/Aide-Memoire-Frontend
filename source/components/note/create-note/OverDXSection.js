import styled from "styled-components"

import { FaFolder } from "react-icons/fa"


const OverDXSection = ({ sectionList, setSectionList, userSections, show, setShow }) => {

  const addSection = section => {

    if (sectionList.find(sec => sec._id === section._id)) {
      setSectionList(sectionList.filter(sec => sec._id !== section._id))
    } else {
      setSectionList(sectionList.concat(section))
    }

  }

  const isIncluded = section => {
    return sectionList.findIndex(sec => sec._id === section._id) !== -1
  }

  if (show !== 'section') return false

  return (

    <OverDXStyle>

      <div className="heading">Click any Section to Toggle</div>

      <div className="body">

        <div className="section-list">

          {userSections.map(sect => <div className={"sect-time " + (isIncluded(sect) ? "active" : "")} key={sect._id} onClick={() => addSection(sect)}>

            <span className="v">

              <span><FaFolder size="1pc" /></span>

              <span className="g">{sect.name}</span>

            </span>

          </div>)}

          {userSections.length === 0 && <div className="empt">No Sections Available</div>}

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
    line-height: 2.5pc;
    text-align: center;
    padding-bottom: 0.5pc;
  }

  .body{
    width: 100%;

    .section-list{
      display: flex;
      padding-bottom: 0.5pc;
      flex-wrap: wrap;
      align-items: center;
      justify-content: center;

      .sect-time{
        /* background-color: #d3d3d3; */
        color: black;
        border-radius: 0.5pc;
        padding: .2pc .8pc;
        margin: .3pc;
        display: flex;
        align-items: center;
        justify-content: space-between;
        cursor: pointer;
        background: linear-gradient(145deg, #dedede, #ffffff);
        box-shadow:  11px 11px 22px #d9d9d9, -11px -11px 22px #ffffff;
        opacity: .4;
        transition: opacity .5s, transform .5s;

        &.active {
          opacity: 1;
        }

        &:hover {
          transform: scale(1.1);
        }
        
        span{
          display: flex;
          align-items: center;
          transition: color .5s;

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

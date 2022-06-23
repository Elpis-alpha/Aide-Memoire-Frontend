import { Oval } from "react-loader-spinner"

import { postApiJson } from "../../controllers/APICtrl"

import { useDispatch, useSelector } from "react-redux"

import { useRouter } from "next/router"

import { useState } from "react"

import styled from "styled-components"

import { createSection } from "../../api"

import { sendMiniMessage } from "../../controllers/MessageCtrl"

import { reloadTree } from "../../store/slice/noteSlice"
import { theRightStyle } from "../../controllers/SpecialCtrl"



const SectionPage = ({ sectionID }) => {

  const router = useRouter()

  const dispatch = useDispatch()

  const { divider } = useSelector(store => store.display)

  const { data: userData } = useSelector(store => store.user)

  const [loadingSection, setLoadingSection] = useState(false)

  const [loadingText, setLoadingText] = useState("Saving Section")

  const [sectName, setSectName] = useState("")

  const [sectDesc, setSectDesc] = useState("")

  const getWidth = divider => 100 - parseInt(divider) + '%'


  const createThisSection = async e => {

    e.preventDefault()

    setSectDesc(sectDesc.trim()); setSectName(sectName.trim());

    const name = sectName.trim()

    const description = sectDesc.trim()

    if (name.length !== 0) {

      setLoadingSection(true)

      const newSect = await postApiJson(createSection(), { name, description })

      if (!newSect.error) {

        dispatch(reloadTree("user"))

        router.push(`/section/${newSect._id}`)
        
      } else {

        setLoadingSection(false)

      }

    }

  }

  return (

    <SectionPageStyle style={theRightStyle(divider)}>

      {!loadingSection && <>

        <div className="sect-sett-pack">

          <div className="intro">

            <h1>Create a Section</h1>

          </div>

          <form onSubmit={createThisSection}>

            <div className="form-pack">

              <label htmlFor="el-aid-sect-name">Name</label>

              <div className="inp-hol">

                <input type="text" id="el-aid-sect-name" name="el-aid-sect-name" value={sectName}

                  required onInput={e => setSectName(e.target.value)} placeholder="Name of Section" />

              </div>

            </div>

            <div className="form-pack">

              <label htmlFor="el-aid-sect-desc">Description</label>

              <div className="inp-hol">

                <textarea id="el-aid-sect-desc" name="el-aid-sect-desc" value={sectDesc}

                  required onInput={e => setSectDesc(e.target.value)} placeholder="Description of Section" ></textarea>

              </div>

            </div>

            <div className="form-pack check">

              <button>Create Section</button>

            </div>

          </form>

        </div>

      </>}

      {loadingSection && <div className="over-lo-all">

        <Oval width="8rem" height="8rem" color="white" secondaryColor="white" />

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
        
        textarea{
          display: block;
          width: 100%;
          background-color: #f7f7f7;
          border: 0 none;
          outline: 0 none;
          border-radius: 0.3rem;
          padding: 0.1rem .5rem;
          box-shadow: inset 36px 36px 100px #dedede, inset -36px -36px 100px #ffffff;
          height: 5rem;
        }
      }

      button{
        border: 0 none;
        outline: 0 none;
        background-color: #3c73e9;
        color: white;
        padding: 0 1rem;
        border-radius: 0.3rem;
        transition: background-color .5s;
        width: 100%;
        
        &:hover{
          background-color: darkgreen;
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
      font-size: 1.5rem;
      line-height: 3rem;
    }
  }

  @media screen and (max-width: 700px) {
    width: 100%; left: 0%;
  }
`


export default SectionPage

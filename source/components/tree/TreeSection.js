import styled from "styled-components"

import { useEffect, useState } from "react"

import { useRouter } from "next/router"

import { FaAngleRight, FaAngleDown } from "react-icons/fa"

import { Oval } from "react-loader-spinner"

import TreeNote from "./TreeNote"

import { setLoadingTreeSide } from "../../store/slice/displaySlice"

import { getApiJson, postApiJson } from "../../controllers/APICtrl"

import { getSectionNotes, toggleSectionOpen } from "../../api"

import { useDispatch, useSelector } from "react-redux"
import { getSectionOpenStatus, toggleSectionOpenStatus } from "../../controllers/GeneralCtrl"


const TreeSection = ({ sectionData, makeCircle }) => {

  const router = useRouter()

  const dispatch = useDispatch()

  const { data: userData } = useSelector(store => store.user)

  const { refreshTree, activeNote } = useSelector(store => store.note)

  const [loadedSection, setLoadedSection] = useState(false)

  const [showAll, setShowAll] = useState(false)

  const [noteList, setNoteList] = useState([])

  const [firstTime, setFirstTime] = useState(true)

  useEffect(async () => {

    const workOff = async () => {

      setNoteList([])

      setLoadedSection(false)

      const notes = await getApiJson(getSectionNotes(sectionData._id))

      setNoteList(notes)

      setLoadedSection(true)

    }

    if (refreshTree._ === sectionData.name || firstTime) {

      await workOff()

      setFirstTime(false)

    }

    setShowAll(getSectionOpenStatus(sectionData._id))

  }, [sectionData, refreshTree])

  const clickSectionText = () => {

    // toggleShowAll()

    router.push(`/section/${sectionData._id}`)

    dispatch(setLoadingTreeSide(true))

    makeCircle()

  }

  const toggleShowAll = async () => {

    setLoadedSection(false)

    setShowAll(toggleSectionOpenStatus(sectionData._id))

    setLoadedSection(true)

  }

  return (

    <TreeSectionStyle>

      <div className={`the-sect ${activeNote === sectionData._id ? "active" : ""}`} >

        <div className="the-icon" onClick={toggleShowAll}>

          {

            loadedSection ?

              (showAll ? <FaAngleDown size="1pc" /> : <FaAngleRight size="1pc" />)

              :

              <Oval width=".9pc" height=".9pc" color="black" secondaryColor="black" />

          }

        </div>

        <div className="the-text" onClick={clickSectionText}>

          {sectionData.name}

        </div>

      </div>

      <div className={"my-children " + (showAll ? 'show' : 'hide')}>

        {noteList.map(data => <TreeNote noteData={data} key={data._id} makeCircle={makeCircle} />)}

      </div>

    </TreeSectionStyle>

  )

}

const TreeSectionStyle = styled.div`

  div.the-sect{
    
    display: flex;
    align-items: center;
    justify-content: flex-start;
    cursor: pointer;
    transition: background-color .5s;

    .the-icon{
      display: flex;
      align-items: center;
      justify-content: center;
      padding-right: 0.1pc;
    }

    .the-text{
      white-space: pre;
      overflow: auto;
      flex: 1;

      &::-webkit-scrollbar {
        height: 0.2pc;
      }
    }
    
    &:hover{
      background-color: rgba(0, 0, 0, .1);
    }
    
    &.active{
      background-color: rgba(0, 0, 0, .2);
    }
  }

  .my-children{
    padding-left: 0.5pc;
    
    &.show{ display: block }

    &.hide{ display: none }
  }
`

export default TreeSection

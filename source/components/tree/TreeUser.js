import styled from "styled-components"

import { useEffect, useState } from "react"

import { useRouter } from "next/router"

import { FaAngleRight, FaAngleDown } from "react-icons/fa"

import { Oval } from "react-loader-spinner"

import TreeSection from "./TreeSection"

import TreeNote from "./TreeNote"

import { useDispatch, useSelector } from "react-redux"

import { setLoadingTreeSide } from "../../store/slice/displaySlice"

import { getApiJson } from "../../controllers/APICtrl"

import { getFreeNotes, getPrivateSections } from "../../api"


const TreeUser = ({ userData }) => {

  const router = useRouter()

  const dispatch = useDispatch()

  const [loadedUser, setLoadedUser] = useState(false)

  const [showAll, setShowAll] = useState(true)

  const [sectionList, setSectionList] = useState([])

  const [freeNoteList, setFreeNoteList] = useState([])

  const { refreshTree } = useSelector(store => store.note)

  useEffect(async () => {

    const workOff = async () => {

      setLoadedUser(false)

      setSectionList([])

      setFreeNoteList([])

      if (!userData._id) return false

      const userSections = await getApiJson(getPrivateSections())

      setSectionList(userSections)

      const freeNotes = await getApiJson(getFreeNotes())

      setFreeNoteList(freeNotes)

      setLoadedUser(true)

    }

    if (refreshTree._ === "user") {

      await workOff()

    }

  }, [refreshTree])

  const clickUserText = () => {

    setShowAll(!showAll)

    router.push(`/user/${userData._id}`)

    dispatch(setLoadingTreeSide(true))

  }

  if (!userData.isOwner) return false

  return (

    <TreeUserStyle>

      <div className="the-user">

        <div className="the-icon" onClick={() => setShowAll(!showAll)}>

          {

            loadedUser ?

              (showAll ? <FaAngleDown size="1rem" /> : <FaAngleRight size="1rem" />)

              :

              <Oval width=".9rem" height=".9rem" color="black" secondaryColor="black" />

          }

        </div>

        <div className="the-text" onClick={clickUserText}>

          {userData.name}

        </div>

      </div>

      <div className={"my-children " + (showAll ? 'show' : 'hide')}>

        {sectionList.map(data => <TreeSection sectionData={data} key={data._id} />)}

        {freeNoteList.map(data => <TreeNote noteData={data} key={data._id} />)}

      </div>

    </TreeUserStyle>

  )

}

const TreeUserStyle = styled.div`

  div.the-user{
    
    display: flex;
    align-items: center;
    justify-content: flex-start;
    cursor: pointer;
    transition: background-color .5s;

    &.se{
    }

    .the-icon{
      display: flex;
      align-items: center;
      justify-content: center;
      padding-right: 0.1rem;
    }

    .the-text{
      white-space: pre;
      overflow: auto;
      flex: 1;

      &::-webkit-scrollbar {
        height: 0.2rem;
      }
    }

    &:hover{
      background-color: rgba(0, 0, 0, .1);
    }
  }

  .my-children{
    padding-left: 0.5rem;

    &.show{ display: block }

    &.hide{ display: none }
  }
`

export default TreeUser

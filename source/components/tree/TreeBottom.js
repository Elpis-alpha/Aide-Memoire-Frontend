import { useRouter } from "next/router"

import styled from "styled-components"

import { FaEye, FaPlusCircle, FaFolderPlus } from 'react-icons/fa'

import { FiRefreshCw } from 'react-icons/fi'

import { setDivider } from "../../store/slice/displaySlice"

import { useDispatch } from "react-redux"

import { reloadTree } from "../../store/slice/noteSlice"


const TreeBottom = ({ makeCircle }) => {

  const router = useRouter()

  const dispatch = useDispatch()

  const hideTree = () => {

    dispatch(setDivider("0%"))

  }

  const reloTree = () => {

    dispatch(reloadTree("user"))

  }

  const createNote = () => {

    router.push('/note/create-new')

    makeCircle()

  }

  const createSection = () => {

    router.push('/section/create-new')

    makeCircle()

  }

  return (

    <TreeBottomStyle>

      <div className="tree-btm-icn" onClick={createNote}>

        <FaPlusCircle size=".9rem" />

      </div>

      <div className="tree-btm-icn" onClick={createSection}>

        <FaFolderPlus size=".9rem" />

      </div>

      <div className="tree-btm-icn" onClick={reloTree}>

        <FiRefreshCw size=".9rem" />

      </div>

      <div className="tree-btm-icn hide-tree-sds" onClick={hideTree}>

        <FaEye size=".9rem" />

      </div>

    </TreeBottomStyle>

  )

}

const TreeBottomStyle = styled.div`

  display: flex;
  align-items: center;
  justify-content: space-between;
  justify-content: space-around;
  height: 100%; width: 100%;
  overflow: hidden;

  .tree-btm-icn{
    background-color: rgba(255,255,255,.2);
    padding: 0.4rem;
    display: flex;
    border-radius: 50%;
    color: white;
    cursor: pointer;

    &.hide-tree-sds{
      @media screen and (max-width: 700px) {
        display: none;
      }
    }
  }
`

export default TreeBottom

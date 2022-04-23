import { FiMove } from "react-icons/fi"

import styled from "styled-components"

import { useSelector, useDispatch } from "react-redux"

import TreeUser from "./TreeUser"

import { setDivider } from "../../store/slice/displaySlice"

import TreeBottom from "./TreeBottom"

import { useEffect } from "react"


const TreeView = () => {

  const dispatch = useDispatch()

  const { data: userData, available } = useSelector(store => store.user)

  const { showTree, divider } = useSelector(store => store.display)

  useEffect(() => {

    if (!window) return false

    if (window.innerWidth < 410) {

      dispatch(setDivider("27.5%"))

    } else if (window.innerWidth < 510) {

      dispatch(setDivider("25%"))

    } else if (window.innerWidth < 810) {

      dispatch(setDivider("22%"))

    } else if (window.innerWidth < 1210) {

      dispatch(setDivider("20%"))

    } else {

      dispatch(setDivider("18%"))

    }

  }, [])


  if (!showTree) return <></>

  const resizeTree = e => {

    if (e.screenX === 0 && e._reactName === "onDrag") { return false }

    dispatch(setDivider(parseInt((e.screenX) / window.innerWidth * 100) + '%'))

  }

  return (

    <TreeViewStyle style={{ width: divider, right: divider }}>

      <div className="overflow-tree">

        <div className="xtr-ovf">

          {available && <TreeUser userData={{ ...userData, isOwner: true }} />}

        </div>

      </div>

      <div className="tree-bottom-place">

        {available && <TreeBottom userData={userData} />}

      </div>

      <div className="resize-tree" onDrag={resizeTree} onDragEnd={resizeTree} draggable="true">

        <span className="grb-x"><FiMove size=".7rem" /></span>

      </div>

    </TreeViewStyle>

  )

}

const TreeViewStyle = styled.div`

  width: 20%;
  position: absolute;
  top: 0; left: 0;
  bottom: 0; right: 20%;
  height: 100%;
  overflow: visible;
  background-color: #d5d5d5;
  transition: width .5s, right .5s;

  .overflow-tree{
    overflow: hidden;
    height: calc(100% - 2.5rem);
    z-index: 3;
    
    .xtr-ovf{
      padding: 0.5rem;
      height: calc(100%);
      overflow: auto;
    }
  }

  .tree-bottom-place{
    position: absolute;
    bottom: 0; height: 2.5rem;
    left: 0; right: 0;
    width: 100%;
    background-color: grey;
    z-index: 5;
  }
  
  .resize-tree{
    background-color: #a1a1a1;
    height: 100%;
    width: 2px;
    z-index: 6;
    cursor: col-resize;
    position: absolute;
    top: 0; left: 100%;
    bottom: 0;
    overflow: visible;

    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -ms-user-select: none;
    -o-user-select: none;
    user-select: none;
    
    .grb-x{
      cursor: move;
      position: absolute;
      top: 0; left: 100%;
      width: 1rem; height: 1rem;
      background-color: #a1a1a1;
      border-radius: 0 .5rem .5rem 0;

      display: flex;
      align-items: center;
      justify-content: center;
      padding-right: 0.25rem;
      color: white;
    }
  }

`


export default TreeView
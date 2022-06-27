import { FiMove } from "react-icons/fi"

import styled from "styled-components"

import { useSelector, useDispatch } from "react-redux"

import TreeUser from "./TreeUser"

import { setDivider } from "../../store/slice/displaySlice"

import TreeBottom from "./TreeBottom"

import { useEffect, useState } from "react"

import { theLeftStyle } from "../../controllers/SpecialCtrl"

import { FaTimes, FaClipboardList } from "react-icons/fa"

import { sendMiniMessage } from "../../controllers/MessageCtrl"

const isWindowContext = typeof window !== "undefined"

const TreeView = () => {

  const dispatch = useDispatch()

  const { data: userData, available } = useSelector(store => store.user)

  const { showTree, divider, prevDivider } = useSelector(store => store.display)

  const [circleTree, setCircleTree] = useState(false)

  const [displayGrid, setDisplayGrid] = useState(false)

  const [windowResized, setWindowResized] = useState(Math.random())

  // Sets a default width depending on the screen width
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

  // Launches an event to modify the windowResized state
  useEffect(() => {

    if (isWindowContext) {

      window.addEventListener("resize", () => {

        setWindowResized(Math.random())

      })

    }

  }, [])

  // Sends a mini msg to say "You can drag the small circle!"
  useEffect(() => {

    if (circleTree === true) {

      sendMiniMessage({

        icon: { name: "info", style: {} },

        content: { text: "You can drag the small circle!", style: {} },

        style: {}

      }, 2000)

    }

  }, [circleTree])

  // Restores the previous value of the divider
  useEffect(() => {

    const under700 = window.matchMedia('(max-width: 700px)').matches

    if (under700 && divider !== 'small') {

      dispatch(setDivider(prevDivider))
      
    } else if (!under700 && divider === 'small') {
      
      dispatch(setDivider(prevDivider))

    }

  }, [windowResized, divider, prevDivider])

  const localCoordinates = () => {

    if (!isWindowContext) return false

    const strCoor = window.localStorage.getItem('tree-coordinates')

    const coor = JSON.parse(strCoor)

    return coor?.top ? coor : { top: 20, left: 90 }

  }

  const [treeCoordinates, setTreeCoordinates] = useState(localCoordinates())

  if (!showTree) return <></>

  const resizeTree = e => {

    if (e.screenX === 0 && e._reactName === "onDrag") { return false }

    dispatch(setDivider(parseInt((e.screenX) / window.innerWidth * 100) + '%'))

  }

  const positionTree = e => {

    if (e.screenX === 0 && e._reactName === "onDrag") { return false }

    const coord = {

      top: parseInt((e.pageY) / window.innerHeight * 100),

      left: parseInt((e.pageX) / window.innerWidth * 100)

    }

    if (e._reactName === "onDragEnd") localStorage.setItem('tree-coordinates', JSON.stringify(coord))

    setTreeCoordinates(coord)

  }

  const treeCoord = (coord, divider, circleTree) => {

    if (divider === "small") {

      if (circleTree) {

        coord.top = coord.top > 95 ? 95 : coord.top

        coord.left = coord.left > 95 ? 95 : coord.left

        coord.top = coord.top < 5 ? 5 : coord.top

        coord.left = coord.left < 5 ? 5 : coord.left

        return {

          top: `calc(${coord.top}vw - 2rem)`,

          left: `calc(${coord.left}vw - 2rem)`

        }

      } else {

        return {}

      }

    } else {

      return {}

    }

  }

  const turnCircle = e => {

    if (e.target.classList.contains('square-tree') || e.target.classList.contains('tree-cover')) {

      setCircleTree(true)

    }

  }

  const changeTreePosition = e => {

    const coord = {

      top: parseInt((e.pageY) / window.innerHeight * 100),

      left: parseInt((e.pageX) / window.innerWidth * 100)

    }

    localStorage.setItem('tree-coordinates', JSON.stringify(coord))

    setTreeCoordinates(coord)

    setDisplayGrid(false)

    sendMiniMessage({

      icon: { name: "info", style: {} },

      content: { text: "Position Changed", style: {} },

      style: {}

    }, 2000)

    makeCircle()

  }

  const makeCircle = () => setCircleTree(true)

  const style = { ...theLeftStyle(divider), ...treeCoord(treeCoordinates, divider, circleTree) }

  return (

    <TreeViewStyle style={style} className={circleTree ? "circle-tree" : "square-tree"} onClick={turnCircle}>

      <div className="in-tree">

        <div className="tree-sm-top">

          <div className="heading">Item Tree</div>

          <div className="cancel-x"><FaTimes onClick={() => setCircleTree(true)} /></div>

        </div>

        <div className="overflow-tree">

          <div className="xtr-ovf">

            {available && <TreeUser userData={{ ...userData, isOwner: true }} makeCircle={makeCircle} />}

          </div>

        </div>

        <div className="tree-bottom-place">

          {available && <TreeBottom makeCircle={makeCircle} showGrid={() => setDisplayGrid(true)} />}

        </div>

        <div className="resize-tree" onDrag={resizeTree} onDragEnd={resizeTree} draggable="true">

          <span className="grb-x"><FiMove size=".7rem" /></span>

        </div>

      </div>

      <div className="tree-cover" onDrag={positionTree} onDragEnd={positionTree} draggable={circleTree ? "true" : "false"}>

        <div className="tree-inner-content" onClick={() => setCircleTree(false)}>

          <FaClipboardList size={"1.5rem"} />

        </div>

      </div>

      {displayGrid && <div className="display-grid" onClick={changeTreePosition}>

        <div className="dg-text">Click anywhere to choose a new position for the minimized view</div>

      </div>}

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

  .in-tree{
    height: 100%;
    overflow: visible;
  }

  .tree-sm-top{
    display: none;
    height: 3rem;
    /* background-color: #fff; */
    background-color: rgba(0,0,0,.5);
    border: 1px solid #dddddd;
    color: white;
    font-weight: bold;
    align-items: center;
    font-size: 1.2rem;
    padding: 0 .8rem;
    justify-content: space-between;

    .cancel-x{
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fc7272;

      svg{
        cursor: pointer;
      }
    }
  }

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
    background-color: rgba(0,0,0,.5);
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

  .tree-cover{
    display: none;
  }

  .display-grid{
    display: none;
  }

  @media screen and (max-width: 700px) {
    display: flex;
    z-index: 150;
    align-items: center;
    justify-content: center;
    background-color: rgba(0,0,0,.1);
    background-color: transparent;
    position: fixed;
    top: 0; left: 0;
    width: 100vw;
    height: 100vh;
    transition: width 1s, height 1s, background-color 1s, right 1s, top .5s, left .5s;

    .in-tree{
      height: 80%;
      background-color: #dddddd;
      width: 50%;
      box-shadow:  15px 15px 30px #878787, -15px -15px 30px #ffffff;
      opacity: 1;
      overflow: hidden;
      z-index: 20;
      transition: opacity 1s;
    }

    .tree-sm-top{
      display: flex;
    }

    .resize-tree{
      display: none;
    }

    .overflow-tree {
      
      height: calc(100% - 5.5rem);

      .xtr-ovf{
        padding-top: 0;
      }
    }

    .tree-cover {
      width: 100%; height: 100%;
      background-color: rgba(0,0,0,.1);
      position: absolute;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 0;
      overflow: hidden;
      /* opacity: 0; */
      z-index: -5;
      transition: opacity 1s, border-radius 1s, background-color 1s;

      .tree-inner-content{
        position: absolute;
        left: 0;
        width: 100%; height: 100%;
        bottom: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: bottom 1s;
        cursor: pointer;
      }
    }

    .display-grid {
      width: 100vw; height: 100vh;
      background-color: rgba(0,0,0,.6);
      position: fixed;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      z-index: 500;
      transition: opacity 1s, border-radius 1s, background-color 1s;
      animation: opacity-in .5s 1;

      .dg-text{
        color: white;
        font-size: 1.5rem;
        line-height: 3rem;
        padding: 5rem;
        text-align: center;
        /* font-style: italic; */
        font-weight: 100;
        font-stretch: extra-expanded;
        letter-spacing: .3rem;
        word-spacing: 1rem;
      }
    }

    &.circle-tree {
      background-color: transparent;
      width: 4rem; height: 4rem;

      .in-tree {
        opacity: 0;
      }

      .tree-cover {
        opacity: 1;
        border-radius: 50%;
        background-color: #f7f7f7;
        z-index: 45;
        box-shadow:  6px 6px 12px #b9b9b9, -6px -6px 12px #ffffff;

        .tree-inner-content{
          bottom: 0; 
        }
      }
    }
  }

`


export default TreeView
import styled from "styled-components"

import { useRouter } from "next/router"

import { setLoadingTreeSide } from "../../store/slice/displaySlice"

import { useDispatch, useSelector } from "react-redux"

import Link from "next/link"


const TreeNote = ({ noteData }) => {

  const router = useRouter()

  const dispatch = useDispatch()

  const { activeNote } = useSelector(store => store.note)

  const clickNote = () => {

    router.push(`/note/${noteData._id}`)

    dispatch(setLoadingTreeSide(true))

  }

  return (

    <TreeNoteStyle onClick={clickNote} className={activeNote === noteData._id && "active"}>

      <Link href={`/note/${noteData._id}`}><a>

        <div className="the-logo">

          <img src="/images/logo_tiny.png" alt="logo" />

        </div>

        <div className="the-text">

          {noteData.name}

        </div>

      </a></Link>

    </TreeNoteStyle>

  )

}

const TreeNoteStyle = styled.div`

  display: flex;
  align-items: center;
  justify-content: flex-start;
  cursor: pointer;
  transition: background-color .5s;

  a{
    display: flex;
    align-items: center;
    justify-content: flex-start;
    cursor: pointer;
    color: inherit;
    text-decoration: none;
    width: 100%;
  }

  .the-logo{
    display: flex;
    align-items: center;
    justify-content: center;
    padding-right: 0.3rem;

    img{
      max-width: 1rem;
    }
  }

  .the-text{
    white-space: pre;
    overflow: auto;

    &::-webkit-scrollbar {
      height: 0.2rem;
    }
  }

  &.active{
    background-color: rgba(0, 0, 0, .2);
  }

  &:hover{
    background-color: rgba(0, 0, 0, .1);
  }
`

export default TreeNote

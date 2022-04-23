import { useState } from "react"

import styled from "styled-components"

import Link from "next/link"

import { AiFillTags } from "react-icons/ai"

import ReadEditor from "../rich-text/ReadEditor"


const NotePage = ({ note }) => {

  const [noteContent, setNoteContent] = useState(note.text)

  return (

    <NotePageStyle>

      <div className="note-editor-pack">

        <div className="heading"><h1>{note.name}</h1></div>

        <ReadEditor editorState={noteContent} setEditorState={setNoteContent} />

        <div className="note-ist-det">

          <div className="note-tags-all">

            {note.tags.map(tax => <Link href={`/tag/public/${tax._id}`} key={tax._id}><a><div className="tax-time">

              <span className="a"><AiFillTags size=".8rem" /></span>

              <span className="t">{tax.name}</span>

            </div></a></Link>)}

            {note.tags.length === 0 && <div className="empt">No tag in this note</div>}

          </div>

        </div>

      </div>

    </NotePageStyle>

  )

}

const NotePageStyle = styled.div`
  width: 100%;
  flex: 1;
  display: flex;
  align-items: stretch;
  justify-content: flex-start;
  overflow-x: hidden;

  @keyframes opacity-in {
    from{
      opacity: 0;
    }
    to{
      opacity: 1;
    }
  }

  .note-editor-pack{
    width: 100%;

    .heading{
      text-align: center;
      font-size: 1.5rem;
      line-height: 3rem;
      padding: 0 1rem;
      padding-top: 0.5rem;
    }
  }

  .note-tags-all{
    padding: .5rem;
    padding-bottom: 0.3rem;
    margin-bottom: 1rem;
    display: flex;
    flex-wrap: wrap;
    
    .tax-time{
      background-color: #2f2f2f;
      color: white;
      border-radius: 0.5rem;
      padding: 0 .3rem;
      line-height: 1.5rem;
      margin-bottom: .2rem;
      margin-right: .2rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: linear-gradient(145deg, #8b8b8b, #757575);
      box-shadow:  0 0 2px #676767;
      margin-bottom: .7rem;
      cursor: pointer;
      
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
      line-height: 1rem;
      margin-bottom: .7rem;
    }
  }

`


export default NotePage

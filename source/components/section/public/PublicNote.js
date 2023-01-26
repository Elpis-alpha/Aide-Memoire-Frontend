import { useState } from "react"
import styled from "styled-components"
import Link from "next/link"
import { AiFillTags } from "react-icons/ai"
import ReadEditor from "../../rich-text/ReadEditor"
import { host } from "../../../__env"
import FloatingBackButton from "../../general/FloatingBackButton"


const PublicNote = ({ note, section }) => {

  const [noteContent, setNoteContent] = useState(note.text)

  return (

    <PublicNoteStyle>

      <div className="note-editor-pack">

        <div className="heading"><h1>{note.name} from <a href={`${host}/public/section/${section._id}`} target="_blank" rel="noopener noreferrer">{section.name}</a></h1></div>

        <ReadEditor editorState={noteContent} setEditorState={setNoteContent} />

        <div className="note-ist-det">

          <div className="note-tags-all">

            {note.tags.map(tax => <Link href={`/tag/public/${tax._id}`} key={tax._id}><a><div className="tax-time">

              <span className="a"><AiFillTags size=".8pc" /></span>

              <span className="t">{tax.name}</span>

            </div></a></Link>)}

            {note.tags.length === 0 && <div className="empt">No tag in this note</div>}

          </div>

        </div>

      </div>

			<FloatingBackButton href={`${host}/public/section/${section._id}`} />

    </PublicNoteStyle>

  )

}

const PublicNoteStyle = styled.div`
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
      font-size: 1.5pc;
      line-height: 3pc;
      padding: 0 1pc;
      padding-top: 0.5pc;
    }
  }

  .note-tags-all{
    padding: .5pc;
    padding-bottom: 0.3pc;
    margin-bottom: 1pc;
    display: flex;
    flex-wrap: wrap;
    
    .tax-time{
      background-color: #2f2f2f;
      color: white;
      border-radius: 0.5pc;
      padding: 0 .3pc;
      line-height: 1.5pc;
      margin-bottom: .2pc;
      margin-right: .2pc;
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: linear-gradient(145deg, #8b8b8b, #757575);
      box-shadow:  0 0 2px #676767;
      margin-bottom: .7pc;
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
          padding: 0 .3pc;
        }
      }
    }

    .empt{
      width: 100%;
      font-style: italic;
      text-align: center;
      line-height: 1pc;
      margin-bottom: .7pc;
    }
  }

`


export default PublicNote

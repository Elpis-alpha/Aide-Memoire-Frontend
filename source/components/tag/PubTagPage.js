import styled from "styled-components"

import { datetoDateSlash, datetoTimeStr } from "../../controllers/TimeCtrl"

import Link from "next/link"


const TagPage = ({ tag, notes }) => {

  return (

    <TagPageStyle>

      <div className="all-pack-all">

        <div className="all-intro">

          <h1>All Notes with Tag: "{tag.name}"</h1>

        </div>

        <div className="notes-li-holx">

          <div className="notes-li-hol">

            {notes.map(note => <Link href={`/public/note/${note._id}`} key={note._id}><a className="kst-byt">

              <div className="note-item-ll">

                <h3 className="note-name">{note.name}</h3>

                <p className="note-created">{datetoTimeStr(new Date(note.updatedAt))} | {datetoDateSlash(new Date(note.updatedAt))}</p>

              </div>

            </a></Link>)}

            {notes.length === 0 && <div className="empt">No Notes Here</div>}

          </div>

        </div>

      </div>

    </TagPageStyle>

  )

}

const TagPageStyle = styled.div`

  position: absolute;
  width: 100%;
  top: 0; left: 0;
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

  .all-pack-all{
    padding: 0.5rem;
    height: calc(100%);
    overflow: auto;
    animation: opacity-in .5s 1;

    .all-intro{
      font-size: 1.4rem;
      line-height: 3rem;
      text-align: center;
    }

    .notes-intro{
      display: block;
      background-color: #c4c4c4;
      z-index: 7;
      padding: 0.25rem 0.5rem;
      font-size: 1rem;
    }

    a.kst-byt{
      text-decoration: none;
      color: inherit;
    }

    .note-item-ll{
      display: flex;
      margin: 1rem auto;
      padding: 0.5rem 1rem;
      display: flex; width: 80%;
      align-items: center;
      justify-content: space-between;
      background: linear-gradient(145deg, #dedede, #ffffff);
      border: 1px solid #d7d7d7;
      border-radius: 1rem;
      box-shadow: 20px 20px 39px #d2d2d2, -20px -20px 39px #ffffff;
      transition: transform .5s;
      transform: scale(1);

      &:hover{
        transform: scale(1.05);
      }
    }

    .empt{
      width: 100%;
      text-align: center;
      font-style: italic;
    }
  }

  .note-invalid-pack{
    padding: 0.5rem;
    height: calc(100%);
    overflow: auto;
    font-size: 1.2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    animation: opacity-in .5s 1;
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
`
export default TagPage

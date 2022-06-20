import { Oval } from "react-loader-spinner"

import { useEffect, useState } from "react"

import { useSelector } from "react-redux"

import styled from "styled-components"

import { getApiJson } from "../../controllers/APICtrl"

import { getTagNotes, getTagNotesNA } from "../../api"

import { datetoDateSlash, datetoTimeStr } from "../../controllers/TimeCtrl"

import Link from "next/link"


const TagPage = ({ tag }) => {

  const { divider } = useSelector(store => store.display)

  const getWidth = divider => 100 - parseInt(divider) + '%'

  const [loadingTags, setLoadingTags] = useState(true)

  const [invalidTag, setInvalidTag] = useState(false)

  const [loadingText, setLoadingText] = useState("Fetching Private Notes")

  const [myNotes, setMyNotes] = useState([])

  const [ONotes, setONotes] = useState([])

  const { data: userData } = useSelector(store => store.user)

  useEffect(async () => {

    setLoadingTags(true); setLoadingText("Fetching Private Notes")

    const notes = await getApiJson(getTagNotes(tag._id))

    setLoadingTags(true); setLoadingText("Fetching External Notes")

    let notesNA = await getApiJson(getTagNotesNA(tag._id))

    if (!notes.error || notesNA.error) notesNA = notesNA.filter(x => notes.every((y) => y._id !== x._id))

    if (notes.error || notesNA.error || tag.error) {

      setMyNotes([])

      setONotes([])

      setInvalidTag(true)

      setLoadingTags(false)

    } else {

      setMyNotes(notes)

      setONotes(notesNA)

      setInvalidTag(false)

      setLoadingTags(false)

    }

  }, [tag])

  return (

    <TagPageStyle style={{ width: getWidth(divider), left: divider }}>

      {(!loadingTags && !invalidTag) && <div className="all-pack-all">

        <div className="all-intro">

          <h1>All Notes with Tag: "{tag.name}"</h1>

        </div>

        <div className="notes-li-holx">

          <div className="notes-intro">

            <h2>Your Notes</h2>

          </div>

          <div className="notes-li-hol">

            {myNotes.map(note => <Link href={`/note/${note._id}`} key={note._id}><a className="kst-byt">

              <div className="note-item-ll">

                <h3 className="note-name">{note.name}</h3>

                <p className="note-created">{datetoTimeStr(new Date(note.updatedAt))} | {datetoDateSlash(new Date(note.updatedAt))}</p>

              </div>

            </a></Link>)}

            {myNotes.length === 0 && <div className="empt">No Notes Here</div>}

          </div>

        </div>

        <div className="notes-li-holx">

          <div className="notes-intro">

            <h2>Other Notes</h2>

          </div>

          <div className="notes-li-hol">

            {ONotes.map(note => <Link href={`/public/note/${note._id}`} key={note._id}><a className="kst-byt">

              <div className="note-item-ll">

                <h3 className="note-name">{note.name}</h3>

                <p className="note-created">{datetoTimeStr(new Date(note.updatedAt))} | {datetoDateSlash(new Date(note.updatedAt))}</p>

              </div>

            </a></Link>)}

            {ONotes.length === 0 && <div className="empt">No Notes Here</div>}

          </div>

        </div>

      </div>}

      {(!loadingTags && invalidTag) && <div className="note-invalid-pack">

        <div>

          This note either does not exist

          or is inaccessible to you.

        </div>

      </div>}

      {loadingTags && <div className="over-lo-all">

        <Oval width="8rem" height="8rem" color="white" secondaryColor="white" />

        <span>{loadingText}</span>

      </div>}

    </TagPageStyle>

  )

}

const TagPageStyle = styled.div`

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
      margin: .5rem 0;
      padding: 0.5rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: linear-gradient(145deg, #dedede, #ffffff);
      border: 1px solid #d7d7d7;
      border-radius: 1rem;
      box-shadow: 20px 20px 39px #d2d2d2, -20px -20px 39px #ffffff;
      transition: transform .5s;
      transform: scale(1);

      &:hover{
        transform: scale(0.95);
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

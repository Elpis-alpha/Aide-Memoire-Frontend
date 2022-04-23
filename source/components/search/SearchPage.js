import styled from "styled-components"

import { datetoDateSlash, datetoTimeStr } from "../../controllers/TimeCtrl"

import Link from "next/link"

import { getQANote, getQNote } from "../../api"

import { getApiJson } from "../../controllers/APICtrl"

import { Oval } from "react-loader-spinner"

import { useEffect, useState } from "react"

import { FaUser } from "react-icons/fa"

import { useSelector } from "react-redux"


const SearchPage = ({ q, notes }) => {

  const [formStatus, setFormStatus] = useState("filled") // ? filled, fetching

  const [searchValue, setSearchValue] = useState(q)

  const [noteData, setNoteData] = useState(notes)

  const { available, data: userData } = useSelector(store => store.user)

  const searchItem = async e => {

    e.preventDefault()

    e.target['q'].blur()

    setFormStatus("fetching")

    let notes = await getApiJson(getQNote(searchValue.trim().toLowerCase()))

    if (available) {

      const notesA = await getApiJson(getQANote(searchValue.trim().toLowerCase()), userData.token)

      const notesNA = notes.filter(note => note.owner !== userData._id)

      if (!notesA.error) notes = [...notesA, ...notesNA]

    }

    setNoteData(notes)

    setFormStatus("filled")

  }

  const getURL = note => available ? (userData._id === note.owner ? `/note/${note._id}` : `/public/note/${note._id}`) : `/public/note/${note._id}`

  useEffect(async () => {

    if (available) {

      const notesA = await getApiJson(getQANote(searchValue.trim().toLowerCase()), userData.token)

      const notesNA = noteData.filter(note => note.owner !== userData._id)

      if (q === searchValue && !notesA.error) setNoteData(notesA.concat(notesNA))

    }

  }, [])


  return (

    <SearchPageStyle>

      <div className="all-pack-all">

        <div className="all-intro">

          <form onSubmit={searchItem}>

            <input type="search" placeholder="Search for a note" name="q" value={searchValue} onInput={e => setSearchValue(e.target.value)} />

            <button>Search</button>

          </form>

        </div>

        <div className="notes-li-holx">

          {formStatus === "filled" ? <div className="notes-li-hol">

            {noteData.map(note => <Link href={getURL(note)} key={note._id}><a className="kst-byt">

              <div className="note-item-ll">

                <h3 className="note-name">{note.name} {available && (userData._id === note.owner && <FaUser size=".8rem" />)}</h3>

                <p className="note-created">{datetoTimeStr(new Date(note.updatedAt))} | {datetoDateSlash(new Date(note.updatedAt))}</p>

              </div>

            </a></Link>)}

            {noteData.length === 0 && <div className="empt">No Notes Here</div>}

          </div> : <div className="ovx-lox-load">

            <Oval width="6rem" height="6rem" color="black" secondaryColor="black" />

            <span>Searching</span>

          </div>}

        </div>

      </div>

    </SearchPageStyle>

  )

}

const SearchPageStyle = styled.div`

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
      text-align: center;

      form{
        display: flex;
        align-items: center;
        justify-content: center;
        width: 70%;
        margin: 0 auto;
        padding: 1rem;
  
        input{
          display: block;
          flex: 1;
          line-height: 2.5rem;
          height: 2.5rem;
          padding: 0 .5rem;
          background-color: #e7e7e7;
          border: 0 none; outline: 0 none;
        }
        
        button{
          display: flex;
          align-items: center;
          justify-content: center;
          line-height: 2.5rem; height: 2.5rem;
          background-color: #c5c5c5;
          border: 0 none; outline: 0 none;
        }
      }
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

  .ovx-lox-load{
    height: 100%; width: 100%;
    z-index: 50;
    padding: 2rem 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    animation: opacity-in .5s 1;

    span{
      font-size: 1.5rem;
      line-height: 3rem;
    }
  }
`
export default SearchPage

import { useEffect } from "react"
import { useState } from "react"
import styled from "styled-components"
import { getPublicSectionNotes } from "../../../api"
import { getApiJson } from "../../../controllers/APICtrl"
import LENote from "../LENote"
import Note from "../Note"

const PublicSection = ({ section }) => {
	const sectionID = section._id
	const [notes, setNotes] = useState([])
	const [notesStatus, setNotesStatus] = useState("loading")

	useEffect(() => {
		const doStuff = async () => {
			try {
				const secNotes = await getApiJson(getPublicSectionNotes(sectionID))
				if (secNotes.error) { setNotesStatus("error") }
				else {
					setNotes(secNotes)
					setNotesStatus("ok")
				}
			} catch (error) { setNotesStatus("error") }
		}
		doStuff()
	}, [sectionID])

	return (
		<PublicSectionStyle>
			<div className="sect-sett-pack">
				<div className="intro">
					<h1>Welcome to {section.name}</h1>
				</div>
				<div className="desc">
					<p>{section.description}</p>
				</div>
				<div className="sep-sec-pub"></div>
				<div className="sec-notes">
					<h2>Notes</h2>
					<div className="notes">
						{(notesStatus === "ok" && notes.length > 0) && <div className="good-notes">
							{notes.map(note => <Note key={"sec-note:" + note._id} note={note} publicNote={true} sectionID={sectionID} />)}
						</div>}
						{(notesStatus === "ok" && notes.length === 0) && <div className="t-notes">
							There are no notes in this section
						</div>}
						{notesStatus === "error" && <div className="t-notes">
							An error occured while fetching notes, <a href={complain} target="_blank" rel="noopener noreferrer">send a complaint to us here</a>
						</div>}
						{notesStatus === "loading" && <div className="loading-notes">
							<LENote />
							<LENote />
							<LENote />
							<LENote />
						</div>}
					</div>
				</div>
			</div>
		</PublicSectionStyle>
	)
}
const PublicSectionStyle = styled.div`
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

  .sect-sett-pack{
    width: 100%;
    padding: 1pc 1pc;
    animation: opacity-in .5s 1;

    .intro{
      display: block;

      h1{
        text-align: center;
        font-size: 1.5pc;
        line-height: 3pc;
        padding-top: 0.8pc;
        padding-bottom: 0.3pc;
      }

      p{
        text-align: center;
      }
    }

    .desc{
      display: block;
      padding-bottom: .7pc;

      p{
        text-align: center;
      }
    }

    .sep-sec-pub {
      width: 15vw;
      height: 1px;
      background-color: #999;
      margin: 2pc auto;
      margin-top: 3pc;
    }

    .sec-notes {
      padding: 1pc;
      padding-top: 0;
      h2 {
        font-size: 1.3pc;
        line-height: 2.2pc;
        text-align: center;
      }
      .t-notes {
        padding: 1pc;
        text-align: center;
      }
    }
  }
`
export default PublicSection
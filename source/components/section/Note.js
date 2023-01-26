import Link from "next/link"
import styled from "styled-components"
import ElpisImage from "../general/ElpisImage"

const Note = ({ note, publicNote = false, sectionID = "" }) => {
	const trimText = (text, words = 10) => {
		const wordList = text.split(" ")
		return wordList.slice(0, words).join(" ") + ((wordList.length > words) ? "..." : "")
	}
	return (
		<NoteStyle>
			<div className="l-side">
				<ElpisImage src="/images/blur/book_icon.png" alt="Book" removeNext={false} />
			</div>
			<div className="r-side">
				<h4><Link href={publicNote ? `/public/s-note/${sectionID}/${note._id}` : `/note/${note._id}`}><a>{note.name}</a></Link></h4>
				<p>{note.description ? trimText(note.description, 8) : <em>No description available for this note</em>}</p>
			</div>
		</NoteStyle>
	)
}
const NoteStyle = styled.div`
	display: flex;
	border-bottom: 1px solid #ccc;
	padding: 1pc 0;
	animation: opacity-in .5s 1;

	&:last-of-type {
		border-bottom: 0 none;
	}

	.l-side {
		display: flex;
		padding-right: .8pc;
		img {
			width: 60px;
			height: auto;
			object-fit: contain;
			object-position: center;
		}
	}

	.r-side {
		display: flex;
		flex-direction: column;

		a {
			color: #0075ff;
			text-decoration: none;

			&:hover {
				text-decoration: underline;
			}
		}
	}
`
export default Note
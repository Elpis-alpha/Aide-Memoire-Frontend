import Link from "next/link"
import { FaArrowLeft } from "react-icons/fa"
import styled from "styled-components"

const FloatingBackButton = ({ href }) => {
	return (
		<Link href={href}>
			<FloatingBackButtonStyle href={href}>
				<FaArrowLeft />
			</FloatingBackButtonStyle>
		</Link>
	)
}
const FloatingBackButtonStyle = styled.a`
	position: absolute;
	top: 1pc; left: 1pc;
	width: 2.5pc;
	height: 2.5pc;
	/* background-color: #696969; */
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 1.2pc;
	color: #555;
	cursor: pointer;
	z-index: 100;
	border-radius: 50%;
	background: linear-gradient(145deg, #dedede, #ffffff);
	box-shadow:  3px 3px 6px #e1e1e1, -3px -3px 6px #eee;
	transition: transform .5s;

	&:hover {
		transform: scale(1.1);
	}
`
export default FloatingBackButton
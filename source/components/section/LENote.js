import styled from "styled-components"

const LENote = () => {
	return (
		<LENoteStyle>
			<div className="l-side">
				<div className="imm"></div>
			</div>
			<div className="r-side">
				<div className="h4-load"></div>
				<div className="p-load"></div>
			</div>
		</LENoteStyle>
	)
}
const LENoteStyle = styled.div`
	display: flex;
	border-bottom: 1px solid #ccc;
	padding: 1pc 0;

	@keyframes skeleton-animation {
		0% {background-color: #ccc}		
		50% {background-color: #999}		
		100% {background-color: #ccc}		
	}
		
	&:last-of-type {
		border-bottom: 0 none;
	}

	.l-side {
		display: flex;
		padding-right: .8pc;
		height: 72.8px;
		.imm {
			width: 60px;
			height: 76.8;
			border-radius: 15px;
			/* background-color: #aaa; */
			animation: skeleton-animation 2s ease-in-out infinite;
		}
	}

	.r-side {
		display: flex;
		flex-direction: column;

		.h4-load {
			width: 8pc;
			height: 1.2pc;
			/* background-color: #aaa; */
			animation: skeleton-animation 2s ease-in-out infinite;
			margin-top: 5px;
			border-radius: 8px;
			margin-bottom: 15px;
		}
		
		.p-load {
			width: 21pc;
			height: 1.2pc;
			border-radius: 8px;
			/* background-color: #aaa; */
			animation: skeleton-animation 2s ease-in-out infinite;
		}

		@media screen and (max-width: 500px) {
			.h4-load { width: 7pc; }
			.p-load { width: 18pc }
		}

		@media screen and (max-width: 440px) {
			.h4-load { width: 5pc; }
			.p-load { width: 15pc }
		}

		@media screen and (max-width: 390px) {
			.h4-load { width: 4.5pc; }
			.p-load { width: 10pc }
		}

		@media screen and (max-width: 300px) {
			.h4-load { width: 4pc; }
			.p-load { width: 8pc }
		}
	}
`
export default LENote
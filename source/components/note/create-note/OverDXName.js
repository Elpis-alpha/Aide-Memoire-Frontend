import styled from "styled-components"

const OverDXName = ({ noteName, setNoteName, noteDescription, setNoteDescription, show, setShow, defaultName }) => {

  const placeholderEffect = e => {

    if (defaultName === e.target.value) setNoteName("")

  }

  if (show !== 'name') return false

  return (

    <OverDXStyle>

      <form onSubmit={e => { e.preventDefault(); setShow("section"); }}>

        <div className="body">

          <div className="heading">Note Name</div>

          <input autoFocus type="text" required value={noteName} onInput={e => setNoteName(e.target.value)} onFocus={placeholderEffect} />

        </div>

        <div className="body">

          <div className="heading">Note Description</div>

          <textarea required value={noteDescription} onInput={e => setNoteDescription(e.target.value)}></textarea>

        </div>

        <div className="foot">

          <span onClick={() => setShow("")}>Go Back</span>

          <button>Next</button>

        </div>

      </form>

    </OverDXStyle>

  )

}

const OverDXStyle = styled.div`
  padding: 1pc;
  border-radius: .5pc;
  background-color: #f7f7f7;
  width: 80%;
  margin: 0 auto;
  box-shadow: 10px 10px 20px #7f7f7f, -10px -10px 20px #bdbdbd;
  display: block;
  animation: opacity-in .5s 1;

  .heading{
    width: 100%;
    font-size: 1.2pc;
    font-weight: bold;
    line-height: 3pc;
    /* padding-bottom: 0.5pc; */
    text-align: center;
  }

  .body{
    width: 100%;

    input, textarea {
      width: 80%;
      background-color: transparent;
      border: 1px solid grey;
      outline: 0 none;
      margin: 0 auto;
      display: block;
      padding: 0.2pc .5pc;
    }

    textarea {
      height: 5pc;
    }
  }

  .foot{
    padding-top: 0.5pc;
    display: flex;
    
    span, button {
      background-color: rgb(60 115 233);
      border: 0 none; outline: 0 none;
      width: 40%;
      display: block;
      margin: 0 auto;
      color: white;
      border-radius: 0.3pc;
      cursor: pointer;
      text-align: center;
      transition: background-color .5s;

      &:hover{
        background-color: green;
      }
    }
  }
`

export default OverDXName

import styled from "styled-components"

const OverDXName = ({ noteName, setNoteName, show, setShow }) => {

  if (show !== 'name') return false

  return (

    <OverDXStyle>

      <div className="heading">Give Your Note a Name</div>

      <form onSubmit={e => { e.preventDefault(); setShow("section"); }}>

        <div className="body">

          <input autoFocus type="text" required value={noteName} onInput={e => setNoteName(e.target.value)} />

        </div>

        <div className="foot">

          <span onClick={() => setShow("")}>Go Back</span>

          <span onClick={() => setShow("section")}>Next</span>

        </div>

      </form>

    </OverDXStyle>

  )

}

const OverDXStyle = styled.div`
  padding: 1rem;
  border-radius: .5rem;
  background-color: #f7f7f7;
  width: 80%;
  margin: 0 auto;
  box-shadow: 10px 10px 20px #7f7f7f, -10px -10px 20px #bdbdbd;
  display: block;
  animation: opacity-in .5s 1;

  .heading{
    width: 100%;
    font-size: 1.5rem;
    font-weight: bold;
    line-height: 3rem;
    padding-bottom: 0.5rem;
    text-align: center;
  }

  .body{
    width: 100%;

    input{
      width: 80%;
      background-color: transparent;
      border: 1px solid grey;
      outline: 0 none;
      margin: 0 auto;
      display: block;
      padding: 0.2rem .5rem;
    }
  }

  .foot{
    padding-top: 0.5rem;
    display: flex;
    
    span{
      background-color: rgb(60 115 233);
      border: 0 none; outline: 0 none;
      width: 40%;
      display: block;
      margin: 0 auto;
      color: white;
      border-radius: 0.3rem;
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

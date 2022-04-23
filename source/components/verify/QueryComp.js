import styled from 'styled-components'

const QueryComp = ({ setWhichForm }) => {

  return (

    <QueryStyle>

      <h1>What would you like to do?</h1>

      <div>

        <button onClick={() => setWhichForm('login')}>Login</button>

        <span>or</span>

        <button onClick={() => setWhichForm('signup')}>Signup</button>

      </div>

    </QueryStyle>

  )

}

const QueryStyle = styled.div`

  animation: shoz-verify .5s ease-in 1;

  h1{
    text-align: center;
    font-size: 1.2rem;
    line-height: 3rem;
  }

  span{
    width: 100%;
    text-align: center;
    display: inline-block;
  }

  button{
    display: block;
    width: 80%;
    margin: 0 auto;
    border: 0 none; outline: 0 none;
    background: linear-gradient(145deg, #f0f0f0, #d8d8d8);
    box-shadow: 6px 6px 6px #b4b4b4, -6px -6px 6px #fff;
    border-radius: 0.5rem;
    cursor: pointer;
    transform: scale(1);
    transition: transform .5s;

    &:hover{
      transform: scale(1.1);
    }
  }

`

export default QueryComp

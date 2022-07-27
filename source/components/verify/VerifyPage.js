import styled from 'styled-components'

import { useState } from 'react'

import { useDispatch } from 'react-redux'

import { siteName } from '../../__env'

import SignupComp from './SignupComp'

import LoginComp from './LoginComp'

import QueryComp from './QueryComp'

import { FaSearch } from 'react-icons/fa'

import { toggleShowSearch } from '../../store/slice/displaySlice'


const VerifyPage = () => {

  const dispatch = useDispatch()

  const [whichForm, setWhichForm] = useState('query')

  return (

    <ContainerStyle>

      <div className="img-part">

        <img src="/logo.png" alt="logo" />

        <div className='t-text'>

          <h1>Welcome to {siteName}</h1>

          <p>Create a new account or log into your existing account to explore what we have to offer</p>

        </div>

      </div>

      <div className="form-part">

        <div className="form-content">{getWhichForm(whichForm, setWhichForm)}</div>

      </div>

      <div className="search-whole" onClick={() => dispatch(toggleShowSearch(true))}>

        <span>Search</span>

        <FaSearch />

      </div>

    </ContainerStyle>

  )

}

const ContainerStyle = styled.div`

  width: 100%;
  flex: 1;
  display: flex;
  align-items: stretch;
  justify-content: flex-start;
  overflow-x: hidden;
  font-size: 1rem;
  line-height: 2rem;

  @keyframes shoz-verify {
    from{ opacity: 0;}
    to{opacity: 1}
  }

  .img-part{
    width: 60%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    background: linear-gradient(225deg, #d5d5d5, #9e9e9e);

    .t-text{
      width: 100%;
      color: black;
      padding: 0 1rem;
      text-align: center;

      h1{
        font-size: 1.5rem;
        line-height: 3rem;
      }
    }

    img{
      max-width: 50%;
      max-height: 50%;
    }

  }

  .form-part{
    width: 40%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;

    .form-content{
      width: 80%;
    }

  }

  .search-whole{
    position: fixed;
    right: 1rem; top: 1rem;
    padding: 0 0.5rem;
    border-radius: 0.3rem;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;

    background: #f7f7f7;
    box-shadow: 1px 1px 4px #636363, -1px -1px 4px #ffffff;

    span{
      display: inline-block;
      padding-right: 0.3rem;
    }
  }

  @media screen and (orientation: portrait) {

    .img-part{
      width: 40%;
      
      .t-text{

        h1{
          font-size: 1.2rem;
          line-height: 2rem;
        }

      }

      img{
        max-width: 70%;
        max-height: 70%;
      }
    }

    .form-part{
      width: 60%;
    }
  }

`

const getWhichForm = (whichForm, setWhichForm) => {

  switch (whichForm) {

    case "query": return <QueryComp setWhichForm={setWhichForm} />

    case "signup": return <SignupComp setWhichForm={setWhichForm} />

    case "login": return <LoginComp setWhichForm={setWhichForm} />

    default: return <></>

  }

}

export default VerifyPage

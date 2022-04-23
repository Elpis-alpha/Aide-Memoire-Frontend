import Link from "next/link"

import styled from "styled-components"

import { Sling as Hamburger } from "hamburger-react"

import { useEffect, useRef, useState } from "react"

import { AiOutlineSearch, AiOutlinePlusSquare } from "react-icons/ai"

import { FiLogOut } from "react-icons/fi"

import { FaUser, FaTimes } from "react-icons/fa"

import { useSelector } from "react-redux"

import { useDispatch } from "react-redux"

import { siteName } from "../../__env"

import { toggleShowSearch } from "../../store/slice/displaySlice"

import { authLink } from "../../__env"

import { sendMiniMessage, sendXMessage } from "../../controllers/MessageCtrl"

import { useRouter } from "next/router"

import { postApiJson } from "../../controllers/APICtrl"

import { logoutUser } from "../../api"

import Cookies from "universal-cookie"

import { removeUserData } from "../../store/slice/userSlice"


const NavBar = () => {

  const router = useRouter()

  const cookies = new Cookies()

  const [isNavOpened, setIsNavOpened] = useState(false)

  const { showNav } = useSelector(store => store.display)

  const navChildrenRef = useRef(null)

  const dispatch = useDispatch()

  const { showSearch } = useSelector(store => store.display)

  const { available, data: userData } = useSelector(store => store.user)

  const createNewI = async () => {

    setIsNavOpened(false)

    const res = await sendXMessage({

      heading: { text: "Create Something New" },

      content: { text: "What do you want to create" },

      buttons: [

        { text: 'Note', waitFor: '/note/create-new', style: { backgroundColor: '#636363' } },

        { text: 'Section', waitFor: '/section/create-new', style: { backgroundColor: '#607d8b' } },

      ],

    })

    router.push(res)

  }

  const logoutThisUser = async () => {

    setIsNavOpened(false)

    const res = await sendXMessage({

      heading: { text: "Confirm Logout" }, content: {},

      buttons: [

        { text: 'Yes, Logout', waitFor: 'se', style: { backgroundColor: 'darkred' } },

        { text: 'Go Back', waitFor: 're', style: { backgroundColor: '#607d8b' } },

      ],

    })

    if (res !== "se") return false

    sendMiniMessage({

      icon: { name: "loading", style: {} },

      content: { text: "Logging Out!", style: {} },

      style: {}

    })

    await postApiJson(logoutUser(), undefined, userData.token)

    sendMiniMessage({

      icon: { name: "ok", style: {} },

      content: { text: "Logged Out!", style: {} },

      style: {}

    }, 2000)

    cookies.remove('user-token', { path: '/' })

    dispatch(removeUserData())

    router.push(authLink)

  }

  useEffect(() => {

    if (isNavOpened) { navChildrenRef.current.style.right = "0vw" }

    else { navChildrenRef.current.style.right = "105vw" }

  }, [isNavOpened])

  return (

    <NavStyle className={showNav ? 'show-nav' : 'hide-nav'}>

      <div className="heading">

        <Link href="/"><a>{siteName}</a></Link>

      </div>

      <div className="ham-holder">

        <Hamburger color="black" size={20} toggled={isNavOpened} toggle={setIsNavOpened} duration={1} distance="sm" rounded />

      </div>

      <div className="children" ref={navChildrenRef}>

        <div className="ham-spe-hol">

          <Hamburger color="black" size={20} toggled={isNavOpened} toggle={setIsNavOpened} duration={1} distance="sm" rounded />

        </div>

        {available ?

          <ul>

            <li className="like-a" onClick={createNewI}>

              New <AiOutlinePlusSquare />

            </li>

            <li><Link href={`/user/${userData._id}`}><a onClick={() => setIsNavOpened(false)}>

              Profile <FaUser />

            </a></Link></li>

            <li className="click-x" onClick={() => { dispatch(toggleShowSearch(!showSearch)); setIsNavOpened(false) }}>

              Search <AiOutlineSearch />

            </li>

            <li className="like-a" onClick={logoutThisUser}>

              Logout <FiLogOut />

            </li>

          </ul>

          :

          <ul>

            <li><Link href={authLink}><a onClick={() => setIsNavOpened(false)}>

              Join us <FaUser />

            </a></Link></li>

            <li className="click-x" onClick={() => dispatch(toggleShowSearch(!showSearch))}>

              Search <AiOutlineSearch />

            </li>

          </ul>

        }

      </div>

      {showSearch && <div className="search-form">

        <form action="/search/general" method="GET">

          <p>What are you looking for?</p>

          <div className="cancel-x" onClick={() => dispatch(toggleShowSearch())}><FaTimes size="1.25rem" /></div>

          <input type="text" placeholder="Search For Any Note" autoFocus name="q" />

        </form>

      </div>}

    </NavStyle>

  )

}

const NavStyle = styled.nav`

  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid rgba(128, 128, 128, 0.3);
  z-index: 100;
  width: 100%;

  &.hide-nav{
    /* display: none; */
    height: 0;

    & > div{
      opacity: 0;
      visibility: hidden;
      z-index: -1;
    }

    & > div.search-form{
      opacity: 1;
      visibility: visible;
      z-index: 5;

      form{
        box-shadow: 8px 8px 16px #b9b9b9;
      }
    }
  }

  .heading {

    a{
      padding: 1.5rem;
      line-height: 2rem;
      display: block;
      font-size: 1.5rem;
      color: black;
      text-decoration: none;
      font-weight: bold;
      transition: color .5s, background-color .5s;

      &:hover{color: #3c73e9;}
    }
    
  }

  .ham-holder{
    display: none;
  }

  .children{
    display: flex;
    position: static;
    right: 105vw;

    ul{
      display: flex;
      list-style-type: none;

      li{
        display: flex;
        align-items: center;
        justify-content: center;
        transition: color .5s, background-color .5s;
        padding: .5rem 1rem;
        font-size: .9rem;
        line-height: .9rem;
        color: black;
        cursor: pointer;

        &.like-a{
          color: black;
          text-decoration: none;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: color .5s, background-color .5s;

          &:hover{
            color: #3c73e9;
            svg{color: #3c73e9;}
          }

          svg{margin-left: .3rem; transition: color .5s;}
        }

        a{
          color: black;
          text-decoration: none;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: color .5s, background-color .5s;

          &:hover{
            color: #3c73e9;
            svg{color: #3c73e9;}
          }

          svg{margin-left: .3rem; transition: color .5s;}
        }

        &.click-x{
          cursor: pointer;
          
          &:hover{
            color: #3c73e9;
            svg{color: #3c73e9;}
          }

          svg{margin-left: .3rem; transition: color .5s;}
        }
      }
    }

    .ham-spe-hol{
      display: none;
    }
  }

  @media screen and (max-width: 600px) {

    .ham-holder{
      display: flex;
    }    

    .children{
      position: fixed;
      align-items: center;
      justify-content: center;
      width: 100vw;
      top: 0; bottom: 0;
      background-color: #f0f0f0;
      box-shadow: 0 0 3px 0 black;
      z-index: 15;
      transition: right 1s;

      .ham-spe-hol{
        display: flex;
        position: absolute;
        top: 1rem; right: 1rem;
        z-index: 3;
      }

      ul{
        flex-direction: column;
        width: 100%;

        li{
          padding: 0;
          font-size: 1.2rem;
          line-height: 1.2rem;

          a{
            padding: 1.5rem;
            width: 100%;
          }
          
          a:hover{
            background-color: rgba(0, 0, 0, 0.15);
            color: black;
            svg{color: black;}
          }

          &.like-a{
            font-size: 1.2rem;
            line-height: 1.2rem;
            padding: 1.5rem;

            &:hover{
              color: #3c73e9;
              svg{color: #3c73e9;}
            }

            svg{margin-left: .3rem; transition: color .5s;}
          }

          &.click-x{
            padding: 1.5rem;
            
            &:hover{
              background-color: rgba(0, 0, 0, 0.15);
              color: black;
              svg{color: black;}
            }
          }
        }
      }
    }
  }

  @keyframes show-below {
    from{top: 50%; opacity: 0;}
    to{top: 90%; opacity: 1;}
  }

  .search-form{
    display: block;
    position: absolute;
    top: 90%; left: 0;
    width: 100%;
    animation: show-below .5s ease-in 1;
    z-index: 20;
    
    form{
      /* background-color: #f0f0f0; */
      background: linear-gradient(145deg,#f3f3f3,#e9e9e9);
      box-shadow: 8px 8px 16px #b9b9b9, -8px -8px 16px #fff;
      display: flex;
      padding: 2rem;
      padding-top: 1rem;
      width: 90%;
      margin: auto;
      flex-direction: column;

      p{
        font-size: 1rem;
        font-weight: bold;
        padding-bottom: 0.5rem;
      }

      input{
        width: 100%;
        padding: 0 0.5rem;
        background-color: #f1f1f1;
        border: 1px solid grey;
        outline: 0 none;
      }

      .cancel-x{
        position: absolute;
        top: .7rem; right: 1rem;
        height: 1.2rem;
        color: red;
        cursor: pointer;
        transition: transform .5s;

        &:hover{
          transform: scale(1.2);
        }
      }
    }
  }

`

export default NavBar

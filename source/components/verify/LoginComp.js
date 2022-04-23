import styled from 'styled-components'

import { useState } from 'react'

import { Oval } from 'react-loader-spinner'

import { FaEye, FaEyeSlash } from 'react-icons/fa'

import { loginUser } from '../../api'

import { postApiJson } from '../../controllers/APICtrl'

import { useDispatch } from 'react-redux'

import { useRouter } from 'next/router'

import { setUserData } from '../../store/slice/userSlice'

import Cookies from 'universal-cookie'

import { sendMiniMessage } from '../../controllers/MessageCtrl'


const LoginComp = ({ setWhichForm }) => {

  const cookie = new Cookies()

  const dispatch = useDispatch()

  const router = useRouter()

  const [showPassword, setShowPassword] = useState(false)

  const [formStatus, setFormStatus] = useState("filling")

  const [formEmail, setFormEmail] = useState("")

  const [formPass, setFormPass] = useState("")

  const loginUserX = async e => {

    e.preventDefault()

    const form = e.currentTarget

    setFormStatus('sending')

    if (formEmail.trim().length < 1) { form['elpis-aide-email'].focus(); return setFormStatus('filling') }

    if (formPass.trim().length < 1) { form['elpis-aide-pass'].focus(); return setFormStatus('filling') }

    const userLoginData = await postApiJson(loginUser(), { email: formEmail, password: formPass })

    if (!userLoginData.error) {

      dispatch(setUserData({ ...userLoginData.user, token: userLoginData.token }))

      cookie.set('user-token', userLoginData.token, { path: '/', expires: new Date(90 ** 7) })

      setFormStatus('sent')

      router.push('/')

    } else {

      sendMiniMessage({

        icon: { name: "times", style: {} },

        content: { text: "Invalid Credentials!", style: {} },

        style: {}

      }, 2000)

      form['elpis-aide-email'].focus(); return setFormStatus('filling')

    }

  }

  return (

    <LoginStyle>

      <div className="intro">

        <h1>Welcome back</h1>

        <p>We've missed you. Kindly enter your details to log in</p>

      </div>

      <div className="form">

        <form onSubmit={loginUserX}>

          <div className="form-pack">

            <label htmlFor="elpis-aide-email">Email</label>

            <div>

              <input required type="email" id='elpis-aide-email' name='elpis-aide-email' placeholder='Enter your email here'

                value={formEmail} onInput={e => setFormEmail(e.currentTarget.value)} />

            </div>

          </div>

          <div className="form-pack">

            <label htmlFor="elpis-aide-pass">Password</label>

            <div>

              <input required type={showPassword ? "text" : "password"} id='elpis-aide-pass' name='elpis-aide-pass' placeholder='●●●●●●●●'

                value={formPass} onInput={e => setFormPass(e.currentTarget.value)} />

              <div className='icon-hol'>{getPasswordIcon(showPassword, setShowPassword)}</div>

            </div>

          </div>

          <div className="but-pack">

            <button disabled={formStatus !== 'filling'}>

              <span>Login</span> {formStatus === 'sending' && <Oval color='white' secondaryColor='white' height="1rem" width="1rem" />}

            </button>

          </div>

        </form>

        <span className='al--dfoouds'>or <span className="glow-me" onClick={() => setWhichForm('query')}>go back</span></span>

      </div>

    </LoginStyle>

  )

}

const LoginStyle = styled.div`

  animation: shoz-verify .5s ease-in 1;

  max-height: 80vh;
  overflow: auto;

  .intro{

    h1{
      font-size: 1.5rem;
    }
  }

  .form-pack{
    width: 100%;
    display: flex;
    flex-direction: column;
    padding-bottom: 0.1rem;

    label{
      font-weight: bold;
    }

    input{
      background-color: #e5e5e5;
      padding: 0.2rem .5rem;
      border: 0 none; outline: 0 none;
      width: 100%;
      border-radius: 0.2rem;
      padding-right: 2rem;
    }

    .icon-hol{
      width: 1.8rem;
      cursor: pointer;
      height: 100%;
      position: absolute;
      right: 0; top: 0;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .valid-text{
      line-height: 1rem;
      position: absolute;
      top: calc(100% - .3rem); left: 0%;
      width: 100%;
      text-align: center;
      font-size: .7rem;
    }

    &.good{

      input{
        background-color: #c6e0c6;
      }

      .valid-text{
        color: green;
      }
    }

    &.bad{

      input{
        background-color: #f4c6c6;
      }

      .valid-text{
        color: red;
      }
    }

  }

  .but-pack{
    padding-top: .75rem;

    button{
      width: 100%;
      background-color: #3c73e9;
      border: 0 none; outline: 0 none;
      color: white;
      border-radius: 0.2rem;
      padding: 0 .5rem;
      cursor: pointer;
      transition: background-color .5s;
      display: flex;
      align-items: center;
      justify-content: center;

      span{
        display: inline-block;
        padding-right: 0.3rem;
      }

      &:hover{
        background-color: #34b933;
      }

      &:disabled{
        opacity: .5;
        cursor: not-allowed;
      }

      &:disabled:hover{
        background-color: #3c73e9;
      }
    }
  }

  .al--dfoouds{
    width: 100%;
    /* text-align: center; */
    display: block;

    .glow-me{
      color: #3c73e9;
      text-decoration: underline;
      cursor: pointer;
    }
  }

`

const getPasswordIcon = (showPassword, setShowPassword) => {

  switch (showPassword) {

    case true: return <FaEyeSlash size="1.2rem" onClick={() => setShowPassword(!showPassword)} />

    case false: return <FaEye size="1.2rem" onClick={() => setShowPassword(!showPassword)} />

    default: return <></>

  }

}

export default LoginComp

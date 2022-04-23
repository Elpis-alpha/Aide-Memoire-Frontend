import styled from 'styled-components'

import { useState } from 'react'

import { Oval } from 'react-loader-spinner'

import { FaEye, FaEyeSlash, FaCheck, FaTimes } from 'react-icons/fa'

import { isEmail } from 'validator'

import Cookies from 'universal-cookie'

import { addClass, removeClass } from '../../controllers/UICtrl'

import { userExistence, createUser } from '../../api'

import { getApiJson, postApiJson } from '../../controllers/APICtrl'

import { useDispatch } from 'react-redux'

import { useRouter } from 'next/router'

import { setUserData } from '../../store/slice/userSlice'

import { sendMiniMessage } from '../../controllers/MessageCtrl'


const SignupComp = ({ setWhichForm }) => {

  const cookie = new Cookies()

  const dispatch = useDispatch()

  const router = useRouter()

  const [showPassword, setShowPassword] = useState(false)

  const [emailStatus, setEmailStatus] = useState("unverified") // unverified, valid, invaliid, checking

  const [formStatus, setFormStatus] = useState("filling") // filling, sending, sent

  const [formName, setFormName] = useState("")

  const [formEmail, setFormEmail] = useState("")

  const [formPass, setFormPass] = useState("")

  const validateName = e => {

    const input = e.currentTarget

    const text = input.value.trim()

    setFormName(input.value)

    if (text.length < 1) {

      removeClass(input.parentElement, 'good')

      addClass(input.parentElement, 'bad')

      input.nextElementSibling.innerText = "Name is too short"

    } else {

      removeClass(input.parentElement, 'bad')

      addClass(input.parentElement, 'good')

      input.nextElementSibling.innerText = ""

    }

  }

  const validateEmail = e => {

    const input = e.currentTarget

    const text = input.value.trim()

    setFormEmail(input.value)

    setEmailStatus('unverified')

    if (isEmail(text)) {

      removeClass(input.parentElement.parentElement, 'bad')

      addClass(input.parentElement.parentElement, 'good')

      input.parentElement.nextElementSibling.innerText = ""

    } else {

      removeClass(input.parentElement.parentElement, 'good')

      addClass(input.parentElement.parentElement, 'bad')

      input.parentElement.nextElementSibling.innerText = "Invalid Email"

    }

  }

  const identifyUnique = async e => {

    const input = e.currentTarget

    const text = input.value.trim()

    const makeInvalid = (val) => {

      setEmailStatus('invalid')

      removeClass(input.parentElement.parentElement, 'good')

      addClass(input.parentElement.parentElement, 'bad')

      input.parentElement.nextElementSibling.innerText = val

    }

    const makeValid = () => {

      setEmailStatus('valid')

      removeClass(input.parentElement.parentElement, 'bad')

      addClass(input.parentElement.parentElement, 'good')

      input.parentElement.nextElementSibling.innerText = ""

    }

    setFormEmail(input.value)

    if (isEmail(text)) {

      setEmailStatus('checking')

      const data = await getApiJson(userExistence(text))

      if (data.message === 'user does not exist') {

        makeValid()

      } else { makeInvalid("Email is taken") }

    } else { makeInvalid("Invalid Email") }

  }

  const validatePass = e => {

    const input = e.currentTarget

    const text = input.value.trim()

    setFormPass(input.value)

    if (text.length > 4) {

      removeClass(input.parentElement.parentElement, 'bad')

      addClass(input.parentElement.parentElement, 'good')

      input.parentElement.nextElementSibling.innerText = ""

    } else {

      removeClass(input.parentElement.parentElement, 'good')

      addClass(input.parentElement.parentElement, 'bad')

      input.parentElement.nextElementSibling.innerText = "Password is too short"

    }

  }

  const createAccount = async e => {

    e.preventDefault()

    const form = e.currentTarget

    setFormStatus('sending')

    if (formName.trim().length < 1) { form['elpis-aide-name'].focus(); return setFormStatus('filling') }

    if (!isEmail(formEmail.trim())) { form['elpis-aide-email'].focus(); return setFormStatus('filling') }

    if (formPass.trim().length <= 4) { form['elpis-aide-pass'].focus(); return setFormStatus('filling') }

    const data = await getApiJson(userExistence(formEmail.trim()))

    if (!data.message === 'user does not exist') { form['elpis-aide-email'].focus(); return setFormStatus('filling') }

    const userCreationData = await postApiJson(createUser(), { name: formName, email: formEmail, password: formPass })

    if (userCreationData.error) {

      sendMiniMessage({

        icon: { name: "times", style: {} },

        content: { text: "An Error Occured!", style: {} },

        style: {}

      }, 2000)

      form['elpis-aide-name'].focus(); return setFormStatus('filling')

    } else {

      dispatch(setUserData({ ...userCreationData.user, token: userCreationData.token }))

      cookie.set('user-token', userCreationData.token, { path: '/', expires: new Date(90 ** 7) })

      setFormStatus('sent')

      router.push('/')

    }

  }

  return (

    <SignUpStyle>

      <div className="intro">

        <h1>Sign up</h1>

        <p>Hello there, you'll never imagine what awaits you</p>

      </div>

      <div className="form">

        <form onSubmit={createAccount}>

          <div className="form-pack">

            <label htmlFor="elpis-aide-name">Name</label>

            <input required type="text" id='elpis-aide-name' name='elpis-aide-name' placeholder='Enter your name here'

              value={formName} onInput={validateName} onFocus={validateName} onBlur={validateName} />

            <small className="valid-text"></small>

          </div>

          <div className="form-pack">

            <label htmlFor="elpis-aide-email">Email</label>

            <div>

              <input required type="email" id='elpis-aide-email' name='elpis-aide-email' placeholder='Enter your email here'

                value={formEmail} onInput={validateEmail} onFocus={validateEmail} onBlur={identifyUnique} />

              <div className='icon-hol'>{getEmailIcon(emailStatus)}</div>

            </div>

            <small className="valid-text"></small>

          </div>

          <div className="form-pack">

            <label htmlFor="elpis-aide-pass">Password</label>

            <div>

              <input required type={showPassword ? "text" : "password"} id='elpis-aide-pass' name='elpis-aide-pass' placeholder='●●●●●●●●'

                value={formPass} onInput={validatePass} onFocus={validatePass} onBlur={validatePass} />

              <div className='icon-hol'>{getPasswordIcon(showPassword, setShowPassword)}</div>

            </div>

            <small className="valid-text"></small>

          </div>

          <div className="but-pack">

            <button disabled={formStatus !== 'filling'}>

              <span>Sign up</span> {formStatus === 'sending' && <Oval color='white' secondaryColor='white' height="1rem" width="1rem" />}

            </button>

          </div>

        </form>

        <span className='al--dfoouds'>or <span className="glow-me" onClick={() => setWhichForm('query')}>go back</span></span>

      </div>

    </SignUpStyle>

  )

}

const SignUpStyle = styled.div`

  animation: shoz-verify .5s ease-in 1;

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
      transition: background-color .5s;
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

const getEmailIcon = status => {

  switch (status) {

    case "unverified": return <></>

    case "checking": return <Oval width="1rem" height="1rem" color='black' secondaryColor='black' />

    case "valid": return <FaCheck size="1rem" color='green' />

    case "invalid": return <FaTimes size="1rem" color='red' />

    default: return <></>

  }

}

const getPasswordIcon = (showPassword, setShowPassword) => {

  switch (showPassword) {

    case true: return <FaEyeSlash size="1.2rem" onClick={() => setShowPassword(!showPassword)} />

    case false: return <FaEye size="1.2rem" onClick={() => setShowPassword(!showPassword)} />

    default: return <></>

  }

}

export default SignupComp

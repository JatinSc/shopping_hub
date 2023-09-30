import React, { useContext, useState } from 'react'
import user from './user.png'
import email from './email.svg'
import lock from './lock.svg'
import { NavLink } from 'react-router-dom'
import css from './Login.module.scss'
import UseAnimations from "react-useanimations";
import visibility from 'react-useanimations/lib/visibility';
import userContext from '../../context/userContext'

const Login = () => {
  const {loginUser} = useContext(userContext)
  const [credentials, setCredentials] = useState({
    email: "",
    password:""
  })

  const handelSubmit = (e) => {
    e.preventDefault()
    loginUser(credentials)
  }
  const [visible,setVisible] = useState(false)
  return (
    <div className={css.authContainer}>
      <h2>Register Here</h2>
      <div className={css.container}>
        <div className={css.formGroup}>
          <label htmlFor="email">Email</label>
          <input
            placeholder='Enter your Email'
            type="email"
            id='email'
            onChange={(e) => { setCredentials({ ...credentials, email: e.target.value }) }}
          />
          <img src={email} alt="email" />
        </div>
        <div id={css.password} className={css.formGroup}>
          <label htmlFor="password">Password</label>
          <input
            placeholder='Enter your Password'
            type={visible ? "text" : "password"}
            id='password'
            onChange={(e) => { setCredentials({ ...credentials, password: e.target.value }) }}
          />
          <img src={lock} alt="password" />
          <UseAnimations speed={3} id={css.visible} animation={visibility} size={25} onClick={() => setVisible(!visible)} />
        </div><br />
        <button className={css.signBtn} onClick={handelSubmit}>Sign in</button>
        <div className={css.signUp}>
          <p id={css.p}>Don't have an account ? <NavLink className={css.NavLink} to='/register'>Sign up</NavLink></p></div>
      </div>
    </div>
  )
}

export default Login
import React, { useContext, useState } from 'react'
import userContext from '../../context/userContext'
import user from './user.png'
import email from './email.svg'
import lock from './lock.svg'
import { NavLink } from 'react-router-dom'
import UseAnimations from "react-useanimations";
import visibility from 'react-useanimations/lib/visibility';
import alertCircle from 'react-useanimations/lib/alertCircle';
import css from './Register.module.scss'
import { Oval } from 'react-loader-spinner'


const Register = () => {
    const { registerUser } = useContext(userContext)
    const [credentials, setCredentials] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: ""
    })
    const [loading,setLoading] = useState(false)

    const handelSubmit = async (e) => {
        setLoading(true)
        e.preventDefault()
        const result = await registerUser(credentials)
        if (result == false)
            setLoading(false)
    }
    const [visible, setVisible] = useState(false)
    return (
        <div className={css.authContainer}>
            <h2>Register Here</h2>
            <div className={css.container}>
                <div className={css.formGroup}>
                    <label htmlFor="firstName">First Name</label>
                    <input
                        placeholder='Enter your Name'
                        type="email"
                        id='firstName'
                        onChange={(e) => { setCredentials({ ...credentials, firstName: e.target.value }) }}
                    />
                    <img className={css.userImg} src={user} alt="email" />
                </div>
                <div className={css.formGroup}>
                    <label htmlFor="lastName">Last Name</label>
                    <input
                        placeholder='Enter your Name'
                        type="email"
                        id='lastName'
                        onChange={(e) => { setCredentials({ ...credentials, lastName: e.target.value }) }}
                    />
                    <img className={css.userImg} src={user} alt="email" />
                </div>
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
                    <label htmlFor="password">
                        Password
                        <UseAnimations speed={1} id={css.alertCircle} animation={alertCircle} size={25} title={'password should atLeast contain 1 uppercase letter, 1 lowerCase letter, 1 digit, 1 special character and length must be atLeast 10'} />
                    </label>
                    <input
                        placeholder='Enter your Password'
                        type={visible ? "text" : "password"}
                        id='password'
                        onChange={(e) => { setCredentials({ ...credentials, password: e.target.value }) }}
                    />
                    <img src={lock} alt="password" />
                    <UseAnimations speed={3} id={css.visible} animation={visibility} size={25} onClick={() => setVisible(!visible)} />
                </div><br />
                <button className={css.signBtn} onClick={handelSubmit}>
                    {loading ? <Oval
                        height={30}
                        width={30}
                        color="black"
                        wrapperStyle={{}}
                        wrapperClass=""
                        visible={loading}
                        ariaLabel='oval-loading'
                        secondaryColor="white"
                        strokeWidth={2}
                        strokeWidthSecondary={2}

                    /> : "Sign up"}</button>
                <div className={css.signUp}><p id={css.p}>Already have an account ? <NavLink className={css.NavLink} to='/login'>Sign In</NavLink></p></div>
            </div>
        </div>
    )
}

export default Register
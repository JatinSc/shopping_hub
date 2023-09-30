import React, { useEffect, useState } from 'react'
import css from './EmailVerify.module.scss'
import axios from 'axios'
import verified from './verified.gif'


import { Link, useParams } from 'react-router-dom'

const EmailVerify = () => {
    const [validUrl, setValidUrl] = useState(false)
    const param = useParams()


    useEffect(() => {
        const verifyEmailUrl = async () => {
            try {
                
                const url = `http://127.0.0.1:8000/user/${param.id}/verify/${param.token}`
                console.log(url)
                const { data } = await axios.get(url)
                console.log(data)
                setValidUrl(true)
            } catch (error) {
                console.log(error)
                setValidUrl(false)
            }
        }
        verifyEmailUrl()
    }, [param])

    return (
        <div className={`${css.mainContainer} flexCenter`}>
            {validUrl ? (
                <div className={`${css.container} flexCenter`}>
                    <img src={verified} alt="verified" />
                    <p>Email verified successfully</p>
                    <Link to='/login'>
                        <button className={css.login_btn}>
                            Login
                        </button>
                    </Link>
                </div>
            ) : (
                <div className={css.container}>
                    <p>404 Not Found</p>
                </div>
            )

            }
        </div>
    )
}

export default EmailVerify
import React, { useContext } from 'react'
import { useNavigate,  } from 'react-router-dom'
import userContext from '../../context/userContext'
import css from './Sidebar.module.scss'

export const Sidebar = () => {
    const navigate = useNavigate()
    const { user,isNavOpen } = useContext(userContext)
    return (
      <div className={isNavOpen? css.sidebarOpen : css.sidebarClose}>
        {user ? (<>
          <ul>
            <li>jan</li>
            <li>feb</li>
            <li>mar</li>
            <li>aug</li>
            <li>april</li>
        </ul></>) : <>
      <button>login</button><button>signUp</button>
      </>}
      </div>
      
  )
}

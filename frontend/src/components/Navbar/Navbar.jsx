import React, { useContext } from 'react'
import css from './Navbar.module.scss'
import { useNavigate } from 'react-router-dom'
import userContext from '../../context/userContext'
import menu2 from 'react-useanimations/lib/menu2';
import UseAnimations from "react-useanimations";

const Navbar = () => {
  const navigate = useNavigate()
  const { user , isNavOpen, setIsNavOpen} = useContext(userContext)
  console.log(user)
  return (
    <div className={css.navbar}>
      <UseAnimations speed={3.5} className={css.hamBurger} animation={menu2} size={35} onClick={()=> setIsNavOpen(!isNavOpen)}/>
      {user ? (
        <div className={css.profile}>
          <img src={user?.userPhoto ? user.userPhoto : "../../../public/user.png"} alt="profile image" onClick={() => navigate('/profile')} />
        </div>
      ) : (null)}
    </div>
  )       
}

export default Navbar
import React, { useContext } from 'react'
import css from './Navbar.module.scss'
import { useNavigate } from 'react-router-dom'
import userContext from '../../context/userContext'
import menu2 from 'react-useanimations/lib/menu2';
import UseAnimations from "react-useanimations";
import logout from './logout.svg'
const Navbar = () => {
  const navigate = useNavigate()
  const { setUser, user, isNavOpen, setIsNavOpen } = useContext(userContext)
  console.log(user)
  return (
    <div className={css.navbar}>
      <UseAnimations speed={3.5} className={css.hamBurger} animation={menu2} size={35} onClick={() => setIsNavOpen(!isNavOpen)} />

      {user ? (
        <>
          <p onClick={(e) => navigate('/')}>Home</p>
          <div className={css.profile}>
            <img src={user?.userPhoto ? user.userPhoto : "../../../public/user.png"} alt="profile image" onClick={() => navigate('/profile')} />
            <button className={css.logout} onClick={() => { localStorage.removeItem('Shopping_Hub_Token'), navigate("/login"), setUser(null) }}><img src={logout} className={css.logoutBtn} /> </button>
          </div>
        </>
      ) : (null)}
    </div>
  )
}

export default Navbar
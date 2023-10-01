import React, { useContext, useRef, useState } from 'react'
import css from './Profile.module.scss'
import userContext from '../../context/userContext'
import toast from 'react-hot-toast';
import axios from 'axios'

const Profile = () => {
  const { user } = useContext(userContext)
  const [image, setImage] = useState(null)
  const imageRef = useRef(null)
 
 

  const handelImageClick = (e) => {
    e.preventDefault()
    imageRef.current.click();
  }

  const uploadFile = async () => {
    const data = new FormData();
    data.append("file", image)
    data.append("upload_preset", "images_preset")

    try {
      // info:- for using env variables in react we need to add VITE as prefix and have to use import.meta.env while using them
      const cloudName = import.meta.env.VITE_CLOUD_NAME_FOR_IMAGE_UPLOAD
      console.log(cloudName)
      const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`
      const res = await axios.post(url, data)
      const { secure_url } = res.data;
      return secure_url;
    } catch (error) {
      console.log(error)
    }
  }

  const saveImage = async (e) => {
    e.preventDefault()
    const imageUrl = await uploadFile()

    const res = await fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/profile-pic`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "content-type": "application/json"
      },
      body: JSON.stringify({imageUrl})
    })

    const result = await res.json()
    if (!result.error) {
      toast.success(result.message, {
        duration: 3000,
        position: 'top-center',
        iconTheme: {
          primary: 'green',
          secondary: 'white',
        },
      })
      setImage(prev => null)
    } else {
      toast.error(result.error, {
        duration: 5000,
        position: 'top-center',
        iconTheme: {
          primary: 'red',
          secondary: 'white',
        },
      })
    }

  }
  const sendVerifyLink = async (id) => {
    const res = await fetch(`http://127.0.0.1:8000/verify-link-resend/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
    const result = await res.json();
    if (!result.error) {
      toast.success(result.message, {
        duration: 3000,
        position: 'top-center',
        iconTheme: {
          primary: 'green',
          secondary: 'white',
        },
      })
    } else {
      toast.error(result.error, {
        duration: 5000,
        position: 'top-center',
        iconTheme: {
          primary: 'red',
          secondary: 'white',
        },
      })
    }
  }
  return (
    <div className={css.container}>
      <div className={css.top_section}>
        <div className={css.dp}>
          <img src={image ? URL.createObjectURL(image) : (user?.userPhoto ? user?.userPhoto : "../../../public/user.png")} alt="profile" />
        </div>
        {/* <i class='bx bxs-edit' style='color:#011629' ></i> */}
        <div className={css.edit}>
          <img src="../../../public/edit.svg" alt="edit" onClick={handelImageClick} />
          <input style={{ display: "none" }} type="file" accept="image/*" ref={imageRef} onChange={(e) => setImage((prev) => e.target.files[0])} />
        </div>
        <div className={css.info}>
          <p>{user?.firstName}</p>
          <p>{user?.email}{user?.verified ? <img title="verified" src='../../../public/verified.gif' /> : <button onClick={() => sendVerifyLink(user?._id)}>verify</button>}</p>
        </div>
        <div className={css.top_section_lower}>

          {image ? <div className={css.action}>
            <button onClick={(e)=>saveImage(e)}>Save</button>
            <button onClick={(e) => setImage(null)}>Cancel</button>
          </div> : null}
        </div>
      </div>
      <div className={css.middle_section}>

      </div>
      <div className={css.bottom_section}>

      </div>
    </div>
  )
}

export default Profile
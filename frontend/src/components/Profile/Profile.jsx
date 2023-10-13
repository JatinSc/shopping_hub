import React, { useContext, useRef, useState } from 'react'
import css from './Profile.module.scss'
import userContext from '../../context/userContext'
import toast from 'react-hot-toast';
import axios from 'axios'
import UploadFile from '../../utils/UploadFile'
import { RotatingLines } from 'react-loader-spinner'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import data from '../../assets/CountriesList.json'

const Profile = () => {
  const base_URL = import.meta.env.VITE_BACKEND_BASE_URL;
  const { user } = useContext(userContext)
  const [image, setImage] = useState(null)
  const [profileData, setProfileData] = useState({ gender: "", address: { street: "", state: "", country: "", postalCode: "" } })
  const [dpLoading, setDpLoading] = useState(false)
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const imageRef = useRef(null)
  const handleClose = () => setIsEditingProfile(false);
  // const handleShow = () => setIsEditingProfile(true);


  const handelImageClick = (e) => {
    e.preventDefault()
    imageRef.current.click();
  }


  const saveImage = async (e) => {
    setDpLoading(true)
    e.preventDefault()
    const imageUrl = await UploadFile(image)

    const res = await fetch(`${base_URL}/profile/dp`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "content-type": "application/json"
      },
      body: JSON.stringify({ imageUrl })
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
      setTimeout(async () => {
        window.location.reload();
        setDpLoading(false)
      }, 3000);

    } else {
      toast.error(result.error, {
        duration: 5000,
        position: 'top-center',
        iconTheme: {
          primary: 'red',
          secondary: 'white',
        },
      })
      setDpLoading(false)
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

  const UpdateProfile = async () => {
    console.log(profileData)
    try {
      if (profileData.gender == "" || profileData.address.street == "" || profileData.address.state == "" || profileData.address.country == "" || profileData.address.postalCode == "") {
        return toast.error("Please enter all the fields", {
          duration: 3000,
          position: 'top-center',
          iconTheme: {
            primary: 'red',
            secondary: 'white',
          },
        })
      }
      const response = await axios.get(`https://api.postalpincode.in/pincode/${profileData.address.postalCode}`)

      //# Check if the response contains data and if the status is not "Error"
      if (response.data.length > 0 && response.data[0].Status !== "Error") {
        console.log(response.data);
      } else {
        return toast.error("Wrong postal code", {
          duration: 3000,
          position: 'top-center',
          iconTheme: {
            primary: 'red',
            secondary: 'white',
          },
        })
      }

      const res = await fetch(`${base_URL}/profile/update`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "content-type": "application/json"
        },
        body: JSON.stringify({ ...profileData })
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
        setIsEditingProfile(false)
      } else {
        toast.error(result.error, {
          duration: 5000,
          position: 'top-center',
          iconTheme: {
            primary: 'red',
            secondary: 'white',
          },
        })
        setIsEditingProfile(false)
      }


    } catch (error) {
      console.log(error)
    }

  }
  return (

    <div className={css.container}>
      {isEditingProfile ?
        <Modal size="lg" show={isEditingProfile} onHide={handleClose}>
          <Modal.Header>
            <Modal.Title>
              <p className={css.modal_name}>{user?.firstName}</p>
              <p className={css.modal_email}>{user?.email}</p>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <div>
                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                  <Form.Label>Street</Form.Label>
                  <Form.Control
                    autoFocus={true}
                    type="text"
                    placeholder="Add your address here"
                    value={profileData?.address?.street}
                    onChange={(e) =>
                      setProfileData({
                        ...profileData,
                        address: {
                          ...profileData.address,
                          street: e.target.value,
                        },
                      })
                    }
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Country</Form.Label>
                  <Form.Select
                    aria-label="Country select"
                    value={profileData?.address?.country} // Bind the selected value
                    onChange={(e) =>
                      setProfileData({
                        ...profileData,
                        address: {
                          ...profileData.address,
                          country: e.target.value,
                        },
                      })
                    }
                  >
                    <option value="">Select Country</option>
                    {data.map((country) => (
                      <option key={country.code} value={country.name}>
                        {country.name}
                      </option>
                    ))}
                  </Form.Select>

                </Form.Group>
              </div>
              <div>
                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                  <Form.Label>State</Form.Label>
                  <Form.Control
                    type="text"
                    value={profileData?.address?.state}
                    placeholder="Add state here"
                    onChange={(e) =>
                      setProfileData({
                        ...profileData,
                        address: {
                          ...profileData.address,
                          state: e.target.value,
                        },
                      })
                    }
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                  <Form.Label>Postal code</Form.Label>
                  <Form.Control
                    type="number"
                    value={profileData?.address?.postalCode}
                    placeholder="Postal code"
                    onChange={(e) =>
                      setProfileData({
                        ...profileData,
                        address: {
                          ...profileData.address,
                          postalCode: e.target.value,
                        },
                      })
                    }
                  />
                </Form.Group>
              </div>
              <div>
                <p>Gender</p>
                <Form.Check
                  inline
                  label="Male"
                  name="group1"
                  type="radio"
                  checked={profileData.gender === "Male" || user?.gender === "Male"}
                  id="Male"
                  onChange={() =>
                    setProfileData({
                      ...profileData,
                      gender: "Male",
                    })
                  }
                />
                <Form.Check
                  className="mb-3"
                  inline
                  label="Female"
                  name="group1"
                  type="radio"
                  checked={profileData.gender === "Female" || user?.gender === "Female"}
                  id="Female"
                  onChange={(e) =>
                    setProfileData({
                      ...profileData, gender: "Female"
                    })
                  }
                />
              </div>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setIsEditingProfile(false)}>
              Close
            </Button>
            <Button variant="primary" onClick={UpdateProfile}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal> : null}
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
          <p>{user?.firstName} {user?.lastName}</p>
          <p>{user?.email}{user?.verified ? <img title="verified" src='../../../public/verified.gif' /> : <button onClick={() => sendVerifyLink(user?._id)}>verify</button>}</p>
          <p>Active since : { user?.joined.slice(2)}</p>
        </div>
        <button className={css.editProfile} onClick={() => { setIsEditingProfile(prev => !isEditingProfile), setProfileData({ ...profileData, address: user.address, gender: user.gender }) }}>
          Edit profile
        </button>
        <div className={css.top_section_lower}>

          {image ? <div className={css.action}>
            {dpLoading ? <RotatingLines
              strokeColor="grey"
              strokeWidth="5"
              animationDuration=".75"
              width="40"
              visible={true}
            /> : (<> <button onClick={(e) => saveImage(e)}>Save</button>
              <button onClick={(e) => { setImage(null), setDpLoading(false) }}>Cancel</button></>)}
          </div> : null}
        </div>
      </div>
      <div className={css.middle_section}>
        <div className={css.sections}>
          <p>Gender</p>
          <p className='flexCenter'>{user?.gender ? user?.gender : "Please edit your profile"}</p>
        </div>
        <div className={css.sections}>
          <p>Address</p>
          <p className='flexCenter'>{user?.address ? `${user?.address.street}, ${user?.address.state}, ${user?.address.postalCode}, ${user?.address.country}` : "Please edit your profile"}</p>
        </div>
      </div>
      <div className={css.bottom_section}>

      </div>
    </div>
  )
}

export default Profile
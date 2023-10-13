import { useState, createContext, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import toast from 'react-hot-toast';
const userContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [isNavOpen, setIsNavOpen] = useState(false)
    const navigate = useNavigate()
    const location = useLocation()

    useEffect(() => {
        checkUserLoggedIn();
    }, []);

    const checkUserLoggedIn = async () => {
        // * localhost url => http://127.0.0.1:8000
        // * deployed url of backend => https://blogs-backend-mha8.onrender.com
        try {
            const res = await fetch("http://127.0.0.1:8000/me", {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            const result = await res.json();
            if (!result.error) {
                if (
                    location.pathname === "/login" ||
                    location.pathname === "/register"
                ) {
                    // setTimeout(() => {
                       
                    // }, 1000);
                    navigate("/", { replace: true });
                } else {
                    navigate(location.pathname ? location.pathname : "/");
                }
                setUser(result.user);
                console.log(user)
            } else {
                navigate("/login", { replace: true });
            }
        } catch (error) {
            console.log(error);
        }
    };

    const loginUser = async (userData) => {
        try {
            const res = await fetch('http://127.0.0.1:8000/login', {
                method: 'POST',
                headers: {
                    "content-type": "application/json"
                },
                body: JSON.stringify({ ...userData })
            });
            const result = await res.json();
            if (!result.error) {
                // console.log(result)
                localStorage.setItem("token", result.token)
                setUser(result.user)
                toast.success(result.message, {
                    duration: 3000,
                    position: 'top-center',
                    iconTheme: {
                        primary: 'green',
                        secondary: 'white',
                    },
                })
                console.log(user)
                navigate('/', { replace: true })
                return false

            } else {
                toast.error(result.error, {
                    duration: 5000,
                    position: 'top-center',
                    iconTheme: {
                        primary: 'red',
                        secondary: 'white',
                    },
                })

                return false
            }
        } catch (error) {
            console.log(error)
            return false
        }
    }

    const registerUser = async (userData) => {
        try {
            const res = await fetch('http://127.0.0.1:8000/register', {
                method: 'POST',
                headers: {
                    "content-type": "application/json"
                },
                body: JSON.stringify({ ...userData })
            });
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
                navigate('/login', { replace: true });
                return false
            } else {
                toast.error(result.error, {
                    duration: 5000,
                    position: 'top-center',
                    iconTheme: {
                        primary: 'red',
                        secondary: 'white',
                    },
                })
                return false
            }
        } catch (error) {
            console.log(error)
            return false
        }

    }

    return (
        <userContext.Provider value={{ user, setUser, loginUser, registerUser, isNavOpen,setIsNavOpen }}>
            {children}
        </userContext.Provider>
    );
    
}

export default userContext;
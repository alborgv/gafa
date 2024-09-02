import {createContext, useState, useEffect} from "react";
import {jwtDecode} from "jwt-decode";
import {useNavigate} from "react-router-dom";

const AuthContext = createContext();

export default AuthContext;

export const AuthProvider = ({ children }) => {
    const [authTokens, setAuthTokens] = useState(() =>
        localStorage.getItem("authTokens")
            ? JSON.parse(localStorage.getItem("authTokens"))
            : null
    );
    

    const [user, setUser] = useState(() => {
        const storedTokens = localStorage.getItem("authTokens")
        if (storedTokens) {
            const decodedTokens = jwtDecode(storedTokens);
            return {
                ...decodedTokens,
                nit: decodedTokens.nit,
            };
        }
        return null;
    });


    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    const urlBackend = import.meta.env.VITE_URL_BACKEND;



    const loginUser = async (nit, password, onError) => {
        const response = await fetch(`${urlBackend}/api/v1/token/`, {
            method: "POST",
            headers:{
                "Content-Type":"application/json"
            },
            body: JSON.stringify({
                nit, password
            })
        })
        const data = await response.json()

        if(response.status === 200){
            setAuthTokens(data)
            setUser(jwtDecode(data.access))
            localStorage.setItem("authTokens", JSON.stringify(data))
            
            navigate("/")

        } else {  
            if (onError){
                onError();
            }
        }
        
    }

    const registerUser = async (nit, usuario, direccion, email, password, password2) => {
        const response = await fetch(`${urlBackend}/api/v1/register/`, {
            method: "POST",
            headers: {
                "Content-Type":"application/json"
            },
            body: JSON.stringify({
                nit, usuario, direccion, email, password, password2
            })
        })
        
        const data = await response.json()

        if (data.error) {
            
            Object.keys(data.error).forEach(key => {
                console.log(data.error[key][0]);
            });
        }

        if(response.status === 201){
            navigate("/login")
            // swal.fire({
            //     title: "Te registraste éxitosamente ¡Ingresa a tu cuenta!",
            //     icon: "success",
            //     toast: true,
            //     timer: 6000,
            //     position: 'top-right',
            //     timerProgressBar: true,
            //     showConfirmButton: false,
            // })
        } else {
            console.log(response.status);
            // swal.fire({
            //     title: "An Error Occured " + response.status,
            //     icon: "error",
            //     toast: true,
            //     timer: 6000,
            //     position: 'top-right',
            //     timerProgressBar: true,
            //     showConfirmButton: false,
            // })
        }
    }

    const logoutUser = async () => {
        
        
        const response = await fetch(`${urlBackend}/api/v1/token/refresh/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                refresh: authTokens.refresh
            })
        })


        setAuthTokens(null)
        setUser(null)
        localStorage.removeItem("authTokens")
        navigate("/login")
    }


    const changePassword = async (old_password, new_password, new_password_confirm) => {
        
        try {
        
            const response = await fetch(`${urlBackend}/api/v1/change_password/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    token: authTokens.refresh, old_password, new_password, new_password_confirm
                })
            })

            const data = await response.json()
            if (response.ok) {

                if(response.status === 200){
                    navigate("/login")
                    // swal.fire({
                    //     title: "Actualizaste tu contraseña ¡Ingresa nuevamente!",
                    //     icon: "success",
                    //     toast: true,
                    //     timer: 6000,
                    //     position: 'top-right',
                    //     timerProgressBar: true,
                    //     showConfirmButton: false,
                    // })
                } else {
                    console.log(response.status);
                    // swal.fire({
                    //     title: "An Error Occured " + response.status,
                    //     icon: "error",
                    //     toast: true,
                    //     timer: 6000,
                    //     position: 'top-right',
                    //     timerProgressBar: true,
                    //     showConfirmButton: false,
                    // })
                }

                logoutUser()
            } else {
                if (data) {
                    Object.keys(data).forEach(key => {
                        console.error(data[key][0]);
                    });

                    return data
                }
            }

        } catch (error) {
            console.error(error)
        }
    }


    const contextData = {
        user, 
        setUser,
        authTokens,
        setAuthTokens,
        registerUser,
        loginUser,
        logoutUser
    }


    useEffect(() => {
        if (authTokens) {
            setUser(jwtDecode(authTokens.access))
        }
        setLoading(false)
    }, [authTokens, loading])

    return (
        <AuthContext.Provider value={contextData}>
            {loading ? null : children}
        </AuthContext.Provider>
    )

}
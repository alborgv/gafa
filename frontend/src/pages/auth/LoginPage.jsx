import { useContext, useState } from "react"
import { Link } from "react-router-dom";
import LoginForm from "../../utils/forms/LoginForm";
import AuthContext from "../../context/AuthContext"


function LoginPage() {

    const { loginUser } = useContext(AuthContext)

    
    const [form, setForm] = useState({
        nit: '',
        password: ''
    })

    const [errors, setErrors] = useState({});


    const handleInputChange = (event) => {
        setForm({
            ...form,
            [event.target.id]: event.target.value,
        });
    };

    const handleSubmit = e => {
        e.preventDefault()

        const newErrors = {};

        const reqErrorMessage = "Rellena los datos requeridos"

        if (!form.nit) newErrors.nit = reqErrorMessage;
        if (!form.password) newErrors.password = reqErrorMessage;

        setErrors(newErrors);

        
        if (Object.keys(newErrors).length === 0) {
            loginUser(form.nit, form.password, () => {
                setErrors({notAuth: "Las credenciales son inválidas."})
                
            });
        }

    } 

    return (
        <div>

            <div className="bg-white shadow-lg rounded-lg p-6 max-w-sm w-full mx-auto mt-20 ">
                <h2 className="text-2xl font-medium text-center">Iniciar sesión</h2>

                {errors && <p className="block text-red-500 text-sm p-2 mb-4 rounded-lg">{Object.values(errors)[0]}</p>}

                <form onChange={handleInputChange} onSubmit={handleSubmit}>
                    <LoginForm errors={errors}/>
                    <div className="flex items-center justify-between">
                        <button className="bg-blue-500 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded focus:outline-none focus:shadow-outline ml-auto" type="submit">
                            Iniciar sesión
                        </button>
                        {/* <Link className="inline-block align-baseline font-medium text-sm text-blue-500 hover:text-blue-800" to="/register">¿No tienes cuenta? Regístrate</Link> */}
                    </div>
                </form>
            </div>

        </div>

        
    )
}



export default LoginPage;
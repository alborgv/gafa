import {createContext} from "react";

const ContratoContext = createContext();

export default ContratoContext;

export const ContratoProvider = ({ children }) => {
    
    const urlBackend = import.meta.env.VITE_URL_BACKEND;


    const Comercializadoras = async () => {
        const response = await fetch(`${urlBackend}/api/v1/comercializadoras/`)
        const data = await response.json();
    
        return data
    }
    
    const CreateComercializadoras = async (formData) => {
        const response = await fetch(`${urlBackend}/api/v1/comercializadoras/create/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(formData)
        })


        if (response.ok) {
            const data = await response.json()

            return data
        } else {
            console.error("Error:", await response.text())
        }
    }
    
    const UpdateComercializadoras = async (formData) => {
        const response = await fetch(`${urlBackend}/api/v1/comercializadoras/update/${formData.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                nic: formData.nic,
                nombre: formData.nombre
            })
        })

        let result = {success: false, data: null, error: null}

        if (response.ok) {
            result.data = await response.json()
            result.success = true
        } else {
            result.error = await response.json()
            console.error("Error:", result)
        }

        return result
    }


    const DeleteComercializadoras = async (id) => {
        const response = await fetch(`${urlBackend}/api/v1/comercializadoras/delete/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
        })

        
        if (!response.ok) {
            console.error("Error:", await response.json())
        }

    }



    const Users = async (nitProvider) => {
        const response = await fetch(`${urlBackend}/api/v1/users/?nit=${nitProvider}`)
        const data = await response.json();

        return data
    }

    const Contratos = async (nits) => {
        const response = await fetch(`${urlBackend}/api/v1/contratos/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                nits: nits
            })
        })
        const data = await response.json();
    
        return data
    }

    
    const Factura = async (nics) => {
        const response = await fetch(`${urlBackend}/api/v1/factura/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                nics: nics,
            })
        })

        const data = await response.json();

        return data
    }


    
    const UVT = async (anho) => {
        const response = await fetch(`${urlBackend}/api/v1/UVT/?anho=${anho}`)
        const data = await response.json();
        
        return data
    }
    
    
    const Tarifa = async (KWH, categoria, uvtPrecio) => {

        const response = await fetch(`${urlBackend}/api/v1/tarifa/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                KWH, categoria, uvtPrecio
            })
        })
        const data = await response.json();

        return data
    }


    const createCustomer = async (nit, name, last_name, phone, email, nit_provider) => {

        const response = await fetch(`${urlBackend}/api/v1/create_customer/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                nit, name, last_name, phone, email, nit_provider
            })
        })


        const data = await response.json()

        if (data.error) {
            Object.keys(data.error).forEach(key => {
                console.log(data.error[key][0]);
            });
        }
    
        if(response.status === 201){
            console.log("cliente creado sin errores")
        } else {
            console.log(response.status);
        }

    }


    const uploadFileComercializadora = async (formData) => {
        try {

            const response = await fetch(`${urlBackend}/api/v1/uploadComercializadora/`, {
                method: "POST",
                body: formData
            })

            const data = response.json()

        } catch (error) {
            console.error("Error al subir el archivo:", error)
        }
    }


    const exportExcel = async (data) => {
        const response = await fetch(`${urlBackend}/api/v1/exportExcel/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                data
            })
        })


        if (!response.ok) {
            throw new Error('ERROR EN EL EXPORTE A EXCEL')
        }

        const blob = await response.blob();
        const url = window.URL.createObjectURL(new Blob([blob]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'datos_exportados.xlsx');
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
    }



    const contextData = {
        Comercializadoras,
        CreateComercializadoras,
        UpdateComercializadoras,
        DeleteComercializadoras,
        Users,
        Contratos,
        Factura,
        UVT,
        Tarifa,
        uploadFileComercializadora,
        exportExcel
    }


    return (
        <ContratoContext.Provider value={contextData}>
            {children}
        </ContratoContext.Provider>
    )

}
import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import AuthContext from "../../context/AuthContext";
import ContratoContext from "../../context/ContratoContext";

import Layout from "../../utils/Layout";
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

export default function Dashboard() {

    const navigate = useNavigate();

    const { Contrato, Users } = useContext(ContratoContext);
    const { user, logoutUser } = useContext(AuthContext);

    const [users, setUsers] = useState([]);
    const [facturas, setFacturas] = useState({});
    const [anhos, setAnhos] = useState([]);
    const [selectAnho, setSelectAnho] = useState('');
    const [selectContrato, setSelectContrato] = useState('');

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const data = await Users("");
                setUsers(data);
            } catch (error) {
                console.error('Error:', error);
            }
        };

        fetchUsers();

    }, [Contrato, user]);

    const handleChange = (event, value) => {
        if (value) {
            navigate(`/consulta?nit=${value.nit}`);
        }
    };

    return (
        <Layout>
            <div className="flex-1 p-4 h-full">
                <h1>Buscar:</h1>
                <Autocomplete
                    disablePortal
                    id="combo-box-demo"
                    options={users}
                    sx={{ width: 300 }}
                    getOptionLabel={(option) => option.usuario}
                    onChange={handleChange}
                    renderInput={(params) => <TextField {...params} label="Usuario" />}
                />
            </div>
        </Layout>
    );
}

import { useContext, useState, useEffect, Fragment } from "react";
import ContratoContext from "../../context/ContratoContext";
import Layout from "../../utils/Layout";
import Modal from "../../utils/Modal";
import { Slide, Autocomplete, TextField, Button, Snackbar, Alert, CircularProgress } from '@mui/material';
import { CiEdit, CiWarning } from "react-icons/ci";
import { LuTrash } from "react-icons/lu";
import { MdUpload } from "react-icons/md"; // Importa el icono de subida

export default function Comercializadoras() {

    const { Comercializadoras, CreateComercializadoras, UpdateComercializadoras, DeleteComercializadoras, uploadFileComercializadora } = useContext(ContratoContext);

    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [comercializadoras, setComercializadoras] = useState([]);
    const [selectComercializadora, setSelectComercializadora] = useState(null);
    const [modComercializadora, setModComercializadora] = useState(0);

    const [formValues, setFormValues] = useState({
        id: '',
        nic: '',
        nombre: ''
    });

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    useEffect(() => {
        const fetchUsuarios = async () => {
            try {
                const data = await Comercializadoras();
                setComercializadoras(data);
            } catch (error) {
                console.error('Error:', error);
            }
        };

        fetchUsuarios();
    }, [Comercializadoras]);

    const handleChange = async (event, value) => {
        try {
            setSelectComercializadora(value);
            setModComercializadora(3);
            setFormValues(value);
        } catch {
            setSelectComercializadora(null);
        }
    };

    const handleUploadComercializadora = async (event) => {
        let file = event.target.files[0];
        const formData = new FormData();
        formData.append('file', file);
        formData.append('comercializadora', selectComercializadora?.nic || '');

        setLoading(true);
        try {
            
            setSnackbarMessage("Cargando datos, espere un momento...");
            setSnackbarSeverity('success');
            setSnackbarOpen(true);
            await uploadFileComercializadora(formData);
        } catch (error) {
            console.error("Error al subir archivo:", error);
        } finally {
            setLoading(false);
            setSnackbarMessage("¡Datos subidos éxitosamente!");
            setSnackbarSeverity('success');
            setSnackbarOpen(true);
            event.target.value = null
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormValues({
            ...formValues,
            [name]: value
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        let message = "";
        let success = false;
        let result = ""

        try {
            if (modComercializadora === 1) {
                result = await CreateComercializadoras(formValues);
                success = result.success;
                message = "¡Comercializadora creada con éxito!";
            } else if (modComercializadora === 2) {
                result = await UpdateComercializadoras(formValues);
                success = result.success;
                message = "¡Comercializadora actualizada con éxito!";
            }

            if (success) {
                const data = await Comercializadoras();
                setComercializadoras(data);
                setSelectComercializadora(null);
                setModComercializadora(3);
            } else {
                message = result.error.nic[0];
            }

        } catch (error) {
            message = "Ocurrió un error al procesar la solicitud.";
            console.error("Error:", error);
        } finally {
            setSnackbarMessage(message);
            setSnackbarSeverity(success ? 'success' : 'error');
            setSnackbarOpen(true);
        }
    };

    const handleDeleteConfirm = async (event) => {
        DeleteComercializadoras(selectComercializadora.id);
        const data = await Comercializadoras();
        
        setShowModal(false);
        setComercializadoras(data);
        setSelectComercializadora(null);
        setModComercializadora(3);
        setSnackbarMessage("¡Comercializadora eliminada con éxito!");
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
    }

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    return (
        <Layout>
            <div className="container mx-auto p-6 mt-[20px]">
                <div className="flex items-center">
                    <input
                        accept=".xlsx, .xls"
                        id="file-upload"
                        style={{ display: "none" }}
                        type="file"
                        onChange={handleUploadComercializadora}
                    />
                    <label htmlFor="file-upload">
                        <Button
                            sx={{ marginRight: 1 }}
                            size="large"
                            variant="contained"
                            component="span"
                            disabled={!selectComercializadora || loading}
                            startIcon={loading ? <CircularProgress size={20} /> : <MdUpload size={20} />}
                        >
                            {loading ? "Cargando..." : "Cargar Archivo"}
                        </Button>
                    </label>

                    <Button
                        sx={{
                            marginRight: 1,
                            background: "rgba(60, 190, 90)",
                            ":hover": { background: "rgba(30, 150, 60)" }
                        }}
                        size="large"
                        variant="contained"
                        component="span"
                        onClick={() => { setModComercializadora(1); setFormValues([]); setSelectComercializadora(null) }}
                    >
                        Crear nueva
                    </Button>

                    <Button
                        sx={{ 
                            marginRight: 1,
                            display: !selectComercializadora ? "none" : "",
                            background: "rgba(235, 210, 50)",
                            ":hover": { background: "rgba(225, 200, 50)" } 
                        }}
                        size="large"
                        variant="contained"
                        component="span"
                        onClick={() => { setModComercializadora(2) }}
                    >
                        <CiEdit size={25} />
                    </Button>

                    <Button
                        sx={{
                            display: !selectComercializadora ? "none" : "",
                            background: "rgba(230, 70, 70)", 
                            ":hover": { background: "rgba(200, 70, 70)" }
                        }}
                        size="large"
                        variant="contained"
                        component="span"
                        onClick={() => setShowModal(true)}>
                        <LuTrash size={25}/>
                    </Button>

                    <Autocomplete
                        className="ml-auto"
                        disablePortal
                        id="combo-box-demo"
                        options={comercializadoras}
                        sx={{ width: 500 }}
                        value={selectComercializadora}
                        getOptionLabel={(option) => option?.nombre || ''}
                        onChange={handleChange}
                        renderInput={(params) => <TextField {...params} label="Comercializadora" />}
                    />
                </div>
            </div>
            <hr className="mb-6" />

            <div className="flex items-center justify-center mb-10 text-3xl font-anton">
                <span>{modComercializadora === 1 ? "Crear comercializadora" : modComercializadora === 2 ? "Editar comercializadora" : modComercializadora === 3 ? "Información de comercializadora" : ""}</span>
            </div>

            <div className="flex items-center justify-center">
                <form onSubmit={handleSubmit} style={{ display: modComercializadora !== 0 ? "" : "none" }}>
                    <TextField
                        error={snackbarSeverity === "error"}
                        label="NIC"
                        name="nic"
                        value={formValues?.nic || ''}
                        onChange={handleInputChange}
                        variant="outlined"
                        fullWidth
                        sx={{ marginBottom: 2 }}
                    />
                    <TextField
                        label="Nombre"
                        name="nombre"
                        value={formValues?.nombre || ''}
                        onChange={handleInputChange}
                        variant="outlined"
                        fullWidth
                        sx={{ marginBottom: 2 }}
                    />

                    <div className="flex w-full space-x-4" style={{display: modComercializadora !== 3 ? "" : "none"}} >
                        <Button className="flex-1" onClick={() => setModComercializadora(0)}  variant="outlined" component="span">
                            Cancelar
                        </Button>
                        
                        <input id="sub-form" type="submit" style={{ display: "none" }} />
                        <label htmlFor="sub-form" className="flex-1">
                            <Button className="w-full" type="submit" variant="contained" color="primary" component="span">
                                {modComercializadora === 1 ? "Crear" : modComercializadora === 2 ? "Editar" : ""}
                            </Button>
                        </label>
                    </div>
                </form>
            </div>

            <Modal show={showModal} onConfirm={handleDeleteConfirm} onCancel={() => setShowModal(false)} />

            <Snackbar open={snackbarOpen} TransitionComponent={Slide} autoHideDuration={3000} onClose={handleSnackbarClose}>
                <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Layout>
    );
}

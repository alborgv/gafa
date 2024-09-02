import { useContext, useState, useEffect, Fragment } from "react";
import { useLocation } from "react-router-dom";

import AuthContext from "../../context/AuthContext";
import ContratoContext from "../../context/ContratoContext"

import Modal from "../../utils/Modal";
import Layout from "../../utils/Layout";
import formatCurrency from "../../utils/formatCurrency";
import formatMes from "../../utils/formatMes";

import { Autocomplete, TextField, InputLabel, Select, MenuItem, FormControl, Box, Fab, Chip } from '@mui/material'

import {
    ListSubheader,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    Paper
} from '@mui/material';

import { IoCloudDownloadOutline } from "react-icons/io5";

export default function Consulta() {

    const { Comercializadoras, Users, Contratos, Factura, exportExcel } = useContext(ContratoContext);

    const [data, setData] = useState([])
    const [comercializadoras, setComercializadoras] = useState([])
    const [selectComercializadora, setSelectComercializadora] = useState(null)
    const [contribuyentes, setContribuyentes] = useState([])
    const [selectContribuyente, setSelectContribuyente] = useState(null)
    const [selectCategoria, setSelectCategoria] = useState(null)

    const [showModal, setShowModal] = useState(false);
    const [selectAnho, setSelectAnho] = useState('');

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const categorias = ["AUTOGENERADORA", "RESIDENCIAL", "COMERCIAL", "INDUSTRIAL", "OFICIAL"]
    const anhos = ["2019", "2020", "2021", "2022", "2023", "2024"]



    const [contribuyentesLoc, setContribuyentesLoc] = useState(null)

    const fetchContribuyentes = async () => {
        try {
            const dataContribuyentes = await Users("");
            return dataContribuyentes.map((item) => ({
                ...item,
                nombre_comercializadora: item.nombre_comercializadora.length > 0 ? item.nombre_comercializadora[0] : "#",
            }));

        } catch (error) {
            console.error("Error:", error);
            return [];
        }
    };

    const fetchContratos = async () => {
        const dataContribuyentes = await Users("");

        const dataFinal = [];
    
        const nits = dataContribuyentes.map(item => item.nit)
        const contratos = await Contratos(nits)
        const nics = contratos.map(item => item.nic)
        const facturas = await Factura(nics)

        const facturaFinal = await Promise.all(facturas.map(async (factura) => {
            const facturaFinal2 = await Promise.all(factura.data.map(async (data) => {

                return {
                    ...data,
                    anho: factura.anho,
                    nit: factura.user_nit,
                    usuario: factura.user_usuario,
                    nic: factura.nic,
                    direccion: factura.contrato_direccion,
                    comercializadora: factura.comercializadora[0].nombre,
                    categoria: factura.user_categoria,
                }
            }))
            dataFinal.push(facturaFinal2)
        }))

        setData(dataFinal.flat())
        return dataFinal.flat();
    };



    useEffect(() => {
        const fetchUsuarios = async () => {
            try {
                const dataComercializadora = await Comercializadoras();
                setComercializadoras(dataComercializadora);

                const processedData = await fetchContribuyentes()
                setContribuyentes(processedData)

            } catch (error) {
                console.error('Error:', error);
            }
        };

        fetchUsuarios();

    }, [Comercializadoras]);

    useEffect(() => {
        const applyFilters = async () => {

            if (!contribuyentesLoc) {
                const contratos = await fetchContratos();
                setContribuyentesLoc(contratos)
            }


            let filteredItems = contribuyentesLoc;

            if (selectComercializadora) {
                filteredItems = filteredItems.filter(
                    (item) => item.comercializadora === selectComercializadora.nombre
                );
            }

            if (selectCategoria) {
                filteredItems = filteredItems.filter(
                    (item) => item.categoria === selectCategoria
                );
            }


            if (selectContribuyente) {
                filteredItems = filteredItems.filter(
                    (item) => item.nit === selectContribuyente.nit
                );
            }
            
            if (selectAnho) {
                filteredItems = filteredItems.filter(
                    (item) => item.anho === selectAnho
                );
            }


            if (filteredItems === contribuyentesLoc) {
                filteredItems = []; 
            }

            setData(filteredItems);
        };

        applyFilters();
    }, [selectComercializadora, selectContribuyente, selectCategoria, selectAnho]);


    const handleChangeContribuyente = async (event, value) => {
        setSelectContribuyente(value);
        setComercializadoras(null);
        setSelectContribuyente(null);
    };

    const handleChangeComercializadora = (event, value) => {
        setSelectComercializadora(value);
        setSelectContribuyente(null);
    };


    const handleChangeCategoria = (event, value) => {
        setSelectCategoria(value);
        setSelectContribuyente(null);
    };

    const handleChangeAnho = (event, value) => {
        setSelectAnho(value);
    };


    const handleExportExcel = async (event) => {
        exportExcel(data)
    }


    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };


    return (
        <Layout>
            <div className="container mx-auto p-8">

                <div className="flex items-center mb-8">

                    <Autocomplete
                        sx={{ width: 400, marginRight: 1.2 }}
                        value={selectContribuyente}
                        onChange={handleChangeContribuyente}
                        options={contribuyentes}
                        groupBy={(option) => option.nombre_comercializadora || '#'}
                        getOptionLabel={(option) => option?.usuario || ''}
                        renderInput={(params) => <TextField {...params} label="Contribuyente" variant="outlined" />}
                        renderGroup={(params) => (
                            <React.Fragment key={params.key}>
                                <ListSubheader>{params.group}</ListSubheader>
                                {params.children}
                            </React.Fragment>
                        )}
                    />
                    <Autocomplete
                        disablePortal
                        id="combo-box-demo"
                        options={comercializadoras}
                        sx={{ width: 400, marginRight: 1.2 }}
                        value={selectComercializadora}
                        getOptionLabel={(option) => option?.nombre || ''}
                        isOptionEqualToValue={(option, value) => option.id === value.id}
                        onChange={handleChangeComercializadora}
                        renderInput={(params) => <TextField {...params} label="Comercializadora" />}
                    />

                    <Autocomplete
                        disablePortal
                        id="combo-box-demo"
                        options={categorias}
                        sx={{ width: 250, marginRight: 1.2 }}
                        value={selectCategoria}
                        getOptionLabel={(option) => option}
                        onChange={handleChangeCategoria}
                        renderInput={(params) => <TextField {...params} label="Categoría" />}
                    />
                    
                    <Autocomplete
                        disablePortal
                        id="combo-box-demo"
                        options={anhos}
                        sx={{ width: 150 }}
                        value={selectAnho}
                        getOptionLabel={(option) => option}
                        isOptionEqualToValue={(option, value) => option.id === value.id}
                        onChange={handleChangeAnho}
                        renderInput={(params) => <TextField {...params} label="Año" />}
                    />
                </div>

                <hr className="mb-8" />


                <div>
                    <TableContainer component={Paper}>
                            
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell><strong>NIT</strong></TableCell>
                                    <TableCell><strong>Usuario</strong></TableCell>
                                    <TableCell><strong>NIC</strong></TableCell>
                                    <TableCell><strong>Dirección</strong></TableCell>
                                    <TableCell><strong>Comercializadora</strong></TableCell>
                                    <TableCell><strong>Categoría</strong></TableCell>
                                    <TableCell><strong>Año</strong></TableCell>
                                    <TableCell><strong>Mes</strong></TableCell>
                                    <TableCell><strong>Consumo KWH</strong></TableCell>
                                    <TableCell><strong>UVT</strong></TableCell>
                                    <TableCell><strong>Tarifa UVT</strong></TableCell>
                                    <TableCell><strong>Rango</strong></TableCell>
                                    <TableCell><strong>Total a pagar</strong></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {data && data
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((row, index) => (
                                        <TableRow key={index}>
                                            <TableCell>{row?.nit || ''}</TableCell>
                                            <TableCell>{row?.usuario || ''}</TableCell>
                                            <TableCell>{row?.nic || ''}</TableCell>
                                            <TableCell>{row?.direccion || ''}</TableCell>
                                            <TableCell>{row?.comercializadora || ''}</TableCell>
                                            <TableCell>{row?.categoria || ''}</TableCell>
                                            <TableCell>{row.anho}</TableCell>
                                            <TableCell>{formatMes(row.mes)}</TableCell>
                                            <TableCell>{row?.consumo_KWH || ''}</TableCell>
                                            <TableCell>{row?.tarifa || ''}</TableCell>
                                            <TableCell>{formatCurrency(row.uvtPrecio)}</TableCell>
                                            <TableCell>{row.inicio}-{row.fin <= 100001 ? row.fin : "En adelante"}</TableCell>
                                            <TableCell>{formatCurrency(row.totalPagar )}</TableCell>
                                    </TableRow>
                                    ))}
                            </TableBody>
                        </Table>
                        <TablePagination 
                            rowsPerPageOptions={[5, 10, 25, 50]}
                            component="div"
                            count={data.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />

                    </TableContainer>
                </div>
            </div>

            <Box
                sx={{
                    position: 'fixed',
                    bottom: 50,
                    left: 90,
                }}>

                <Fab
                    sx={{                    
                        background: "rgb(255, 255, 255)",
                        ":hover": { background: "rgba(230, 230, 230)" }
                    }}
                    variant="extended"
                    size="large"
                    onClick={handleExportExcel}>
                    <IoCloudDownloadOutline size={25} className="mr-3" />
                    Exportar datos
                </Fab>

            </Box>

            <div className="mb-20"></div>


        </Layout>
    );
}

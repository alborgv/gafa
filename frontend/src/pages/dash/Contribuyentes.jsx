import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"

import ContratoContext from "../../context/ContratoContext"

import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { TablePagination, Table, TableBody, TableHead, TableRow, TableCell, TableContainer, Paper, Typography, Card, CardContent, ListSubheader } from '@mui/material';



import Layout from "../../utils/Layout";

export default function Contribuyentes() {

    const navigate = useNavigate();
    const { Comercializadoras, Users, Contratos } = useContext(ContratoContext);

    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    const [comercializadoras, setComercializadoras] = useState([])
    const [selectComercializadora, setSelectComercializadora] = useState(null)
    const [contribuyentes, setContribuyentes] = useState([])
    const [selectContribuyente, setSelectContribuyente] = useState(null)
    const [contribuyentesLoc, setContribuyentesLoc] = useState(null)
    const [selectCategoria, setSelectCategoria] = useState(null)

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);


    const categorias = ["AUTOGENERADORA", "RESIDENCIAL", "COMERCIAL", "INDUSTRIAL", "OFICIAL"]

    const fetchContribuyentes = async () => {
        try {
            const dataContribuyentes = await Users("");
            const contribuyentesOrdenados = dataContribuyentes
                .map((item) => ({
                    ...item,
                    nombre_comercializadora: item.nombre_comercializadora.length > 0 ? item.nombre_comercializadora[0] : "#",
                }))
                .sort((a, b) => {
                    if (a.nombre_comercializadora < b.nombre_comercializadora) return -1;
                    if (a.nombre_comercializadora > b.nombre_comercializadora) return 1;
                    return 0;
                });

            return contribuyentesOrdenados
        } catch (error) {
            console.error("Error:", error);
            return [];
        }
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
                const contribuyentes = await fetchContribuyentes();
                // setContribuyentesLoc(contribuyentes)
                const nits = contribuyentes.map(item => item.nit)
                const contratos = await Contratos(nits)
                setContribuyentesLoc(contratos)
            }


            let filteredItems = contribuyentesLoc;

            if (selectComercializadora) {
                filteredItems = filteredItems.filter(
                    (item) => item.comercializadora[0].nombre === selectComercializadora.nombre
                );
            }

            if (selectCategoria) {
                filteredItems = filteredItems.filter(
                    (item) => item.user_categoria === selectCategoria
                );
            }


            if (selectContribuyente) {
                const result = await Contratos(selectContribuyente.nit);
                setData(result);
                setSelectCategoria(null)
                return
            }

            
            if (filteredItems === contribuyentesLoc) {
                filteredItems = []; 
            }
            
            setData(filteredItems);
        };

        applyFilters();
    }, [selectComercializadora, selectContribuyente, selectCategoria]);

    const handleChangeComercializadora = (event, value) => {
        setSelectComercializadora(value);
        setSelectContribuyente(null);
    };


    const handleChangeContribuyente = async (event, value) => {
        setSelectContribuyente(value);
        if (value) {
            const result = await Contratos(value.nit);
            setData(result);
        } else {
           setData([]);
        }
    };
    

    const handleChangeCategoria = (event, value) => {
        setSelectCategoria(value);
        setSelectContribuyente(null);
    };


    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };



    return (
        <Layout>
            <div className="container mx-auto p-6 mt-[20px]">

                <div className="flex items-center">


                    <Autocomplete
                        sx={{ width: 400, marginRight: 1.2 }}
                        value={selectContribuyente}
                        onChange={handleChangeContribuyente}
                        options={contribuyentes}
                        groupBy={(option) => option.nombre_comercializadora || '#'}
                        getOptionLabel={(option) => option?.usuario || ''}
                        isOptionEqualToValue={(option, value) => option.id === value.id}
                        renderInput={(params) => <TextField {...params} label="Contribuyente" variant="outlined" />}
                        renderGroup={(params) => (
                            <React.Fragment key={`${params.group}-${params.key}`}>
                                <ListSubheader>{params.group}</ListSubheader>
                                {params.children.map((child, index) => (
                                    <div key={`${child.key}-${index}-${child.props.id}`}>{child}</div>
                                ))}
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
                        sx={{ width: 250 }}
                        value={selectCategoria}
                        getOptionLabel={(option) => option}
                        onChange={handleChangeCategoria}
                        renderInput={(params) => <TextField {...params} label="Categoría" />}
                    />

                </div>
            </div>
            <hr className="mb-6" />
            <div className="flex-1 overflow-y-auto p-4">

                <div>

                    <TableContainer component={Paper}>
                        <Typography variant="h6" component="div" style={{ margin: '20px', textAlign: 'center' }}>
                            Datos del Contrato
                        </Typography>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell><strong>NIT</strong></TableCell>
                                    <TableCell><strong>Usuario</strong></TableCell>
                                    <TableCell><strong>NIC</strong></TableCell>
                                    <TableCell><strong>Dirección</strong></TableCell>
                                    <TableCell><strong>Categoría</strong></TableCell>
                                    <TableCell><strong>Comercializadora</strong></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {data && data
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((row, index) => (
                                        <TableRow key={index}>
                                            <TableCell>{row.user_nit}</TableCell>
                                            <TableCell>{row.user_usuario}</TableCell>
                                            <TableCell>{row.nic}</TableCell>
                                            <TableCell>{row.contrato_direccion}</TableCell>
                                            <TableCell>{row.user_categoria}</TableCell>
                                            <TableCell>{row.comercializadora[0].nombre}</TableCell>
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
            <div className="mb-20"></div>
        </Layout>

    )

}
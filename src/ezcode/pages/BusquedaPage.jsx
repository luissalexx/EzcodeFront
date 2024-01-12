import { Avatar, Button, FormControl, FormControlLabel, FormLabel, Grid, IconButton, InputAdornment, List, ListItem, ListItemAvatar, ListItemText, Pagination, Paper, Radio, RadioGroup, TextField, Typography } from "@mui/material"
import { ChangeNav } from "../components/ChangeNav"
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import VisibilitySharpIcon from '@mui/icons-material/VisibilitySharp';
import ReactDOMServer from 'react-dom/server';
import React, { useEffect, useState } from "react";
import ezcodeApi from "../../api/ezcodeApi";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { ChangeFootNav } from "../components/ChangeFootNav";
import { jwtDecode } from "jwt-decode";

export const BusquedaPage = () => {

    const token = localStorage.getItem('token');
    const decodedToken = jwtDecode(token);
    const userId = decodedToken.uid;

    const tipo = localStorage.getItem('tipo');
    const [alumno, setAlumno] = useState({});
    const [categoria, setCategoria] = useState();
    const [termino, setTermino] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [anuncios, setAnuncios] = useState([]);
    const [imageUrls, setImageUrls] = useState({});
    const navigate = useNavigate();

    const itemsPerPage = 10;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const displayedAnuncios = anuncios.slice(startIndex, endIndex);

    const handleChangeCategoria = (event) => {
        setCategoria(event.target.value);
    };

    const handleChangeBusqueda = (event) => {
        setTermino(event.target.value);
    };

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };

    const obtenerUrlImagenAnuncio = async (idAnuncio) => {
        try {
            const response = await ezcodeApi.get(`uploads/anuncios/${idAnuncio}`, { responseType: 'arraybuffer' });
            const byteArray = new Uint8Array(response.data);
            const imageDataFromServer = `data:image/png;base64,${btoa(String.fromCharCode.apply(null, byteArray))}`;
            return imageDataFromServer;
        } catch (error) {
            console.error('Error al obtener datos de usuario:', error);
            return null;
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            if (categoria) {
                try {
                    if (tipo === "Alumno") {
                        const response = await ezcodeApi.get(`user/${userId}`);
                        setAlumno(response.data.alumno);
                    }
                    const response = await ezcodeApi.get(`busqueda/anuncios/${categoria}`);
                    const anuncios = response.data.results;
                    setAnuncios(anuncios);
                    const urls = {};
                    for (const anuncio of anuncios) {
                        const url = await obtenerUrlImagenAnuncio(anuncio.uid);
                        urls[anuncio.uid] = url;
                    }
                    setImageUrls(urls);
                } catch (error) {
                    console.error('Error en la busqueda:', error);
                }
            }
        };

        fetchData();
    }, [categoria]);

    const handleOnClick = async () => {
        try {
            const response = await ezcodeApi.get(`busqueda/anuncios/${termino}`);
            const anuncios = response.data.results;
            setAnuncios(anuncios);
            const urls = {};
            for (const anuncio of anuncios) {
                const url = await obtenerUrlImagenAnuncio(anuncio.uid);
                urls[anuncio.uid] = url;
            }
            setImageUrls(urls);
        } catch (error) {
            console.error('Error en la busqueda:', error);
        }
    }

    const viewAnuncio = async (idAnuncio) => {
        try {
            const response = await ezcodeApi.get(`anuncio/${idAnuncio}`);
            const solicitudes = await ezcodeApi.get(`solicitudC/${idAnuncio}`)
            const anuncio = response.data.anuncio;
            const imagen = await obtenerUrlImagenAnuncio(idAnuncio);

            const contenido = ReactDOMServer.renderToString(
                <div>
                    <Typography>Nombre: {anuncio.nombre}</Typography>
                    <br />
                    <Typography>Categoria: {anuncio.categoria}</Typography>
                    <br />
                    <Typography variant='body1'>Descripcion: <br />{anuncio.descripcion}</Typography>
                    <br />
                    <Typography>Precio: {anuncio.precio}MXN</Typography>
                    <hr />
                    <Typography>Profesor: {anuncio.profesor.nombre}</Typography>
                    <Typography>Correo: {anuncio.profesor.correo}</Typography>
                </div>
            );
            const result = await Swal.fire({
                title: 'Detalles del Anuncio',
                html: contenido,
                cancelButtonText: 'Cerrar',
                confirmButtonColor: '#666666',
                showCancelButton: true,
                iconHtml: `<img src=${imagen} style="width: 100px; height: 100px;" />`,
                confirmButtonText: 'Mandar Solicitud',
            });

            if (result.isConfirmed) {
                if (token == null) {
                    navigate('/auth/login', {
                        replace: true
                    });
                } else {
                    if (tipo === "Alumno" && solicitudes.data == null) {
                        await ezcodeApi.post('solicitudC/', { anuncio: idAnuncio });
                        Swal.fire({
                            title: 'Solicitud enviada',
                            icon: 'success',
                            confirmButtonColor: '#3085d6',
                            confirmButtonText: 'Ok',
                        });
                    } else {
                        if (tipo !== "Alumno") {
                            Swal.fire({
                                title: 'No tienes los permisos para enviar una solicitud',
                                icon: 'error',
                                confirmButtonColor: '#3085d6',
                                confirmButtonText: 'Ok',
                            });
                        } else {
                            Swal.fire({
                                title: 'Ya enviaste una solicitud previamente',
                                icon: 'error',
                                confirmButtonColor: '#3085d6',
                                confirmButtonText: 'Ok',
                            });
                        }
                    }
                }
            }
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className="backHome">
            <ChangeNav />
            <Grid container spacing={0} style={{ height: '100vh' }}>
                <Grid item xs={12} sm={3}>
                    <Paper style={{
                        height: '100%',
                        padding: 16,
                        display: 'flex',
                        flexDirection: 'column',
                        backgroundColor: 'rgba(0, 0, 0, 0.1)',
                        border: '2px solid white'
                    }}>
                        <FormControl>
                            <FormLabel style={{ color: 'white', fontSize: '30px' }}>Categorias</FormLabel>
                            <br />
                            <RadioGroup
                                aria-labelledby="demo-row-radio-buttons-group-label"
                                name="categoria"
                                style={{ color: 'white' }}
                                value={categoria || ''}
                                onChange={handleChangeCategoria}
                            >
                                <FormControlLabel value="JavaScript" control={<Radio style={{ color: 'white' }} />} label="JavaScript" />
                                <FormControlLabel value="Java" control={<Radio style={{ color: 'white' }} />} label="Java" />
                                <FormControlLabel value="CSharp" control={<Radio style={{ color: 'white' }} />} label="CSharp" />
                                <FormControlLabel value="Python" control={<Radio style={{ color: 'white' }} />} label="Python" />
                                <FormControlLabel value="SQL" control={<Radio style={{ color: 'white' }} />} label="SQL" />
                                <FormControlLabel value="Html" control={<Radio style={{ color: 'white' }} />} label="Html" />
                            </RadioGroup>
                        </FormControl>
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={9}>
                    <Paper style={{ padding: 16, height: '100%' }}>
                        <div style={{ display: 'flex' }}>
                            <Typography variant="h6" gutterBottom sx={{ flexGrow: 1 }}>
                                Busca los cursos que quieras
                            </Typography>
                            <TextField
                                sx={{ flexGrow: 1, backgroundColor: 'white', borderRadius: '20px' }}
                                placeholder="Buscar por nombre del curso o por correo del profesor"
                                value={termino}
                                autoComplete='off'
                                onChange={handleChangeBusqueda}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchOutlinedIcon />
                                        </InputAdornment>
                                    ),
                                }}
                                variant="standard"
                            />
                        </div>
                        <br />
                        {anuncios !== undefined && anuncios !== null && anuncios.length > 0 ? (
                            <React.Fragment>
                                <List>
                                    {displayedAnuncios.map((anuncio, index) => (
                                        <ListItem
                                            key={index}
                                            style={{
                                                border: "1px solid #ddd",
                                                borderRadius: "8px",
                                                margin: "8px",
                                            }}
                                            secondaryAction={
                                                <Grid>
                                                    <IconButton
                                                        disabled={alumno.baneado}
                                                        edge="end"
                                                        sx={{ marginRight: "8px", backgroundColor: "#000000", color: "white" }}
                                                        onClick={() => viewAnuncio(anuncio.uid)}
                                                    >
                                                        <VisibilitySharpIcon />
                                                    </IconButton>
                                                </Grid>
                                            }
                                        >
                                            <ListItemAvatar>
                                                <Avatar>
                                                    <img
                                                        src={imageUrls[anuncio.uid]}
                                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                    />
                                                </Avatar>
                                            </ListItemAvatar>
                                            <ListItemText
                                                primary={
                                                    <Grid style={{ display: "flex" }}>
                                                        <span style={{ flexGrow: 1 }}>
                                                            Anuncio: {anuncio.nombre}
                                                        </span>
                                                        <span style={{ flexGrow: 1 }}>
                                                            Categoría: {anuncio.categoria}
                                                        </span>
                                                        <span style={{ flexGrow: 1 }}>
                                                            Precio: {anuncio.precio}MXN
                                                        </span>
                                                    </Grid>
                                                }
                                                secondary={
                                                    <Grid style={{ display: "flex" }}>
                                                        <span style={{ marginRight: "20px" }}>
                                                            Profesor: {anuncio.profesor.nombre}
                                                        </span>
                                                        <span>
                                                            Correo: {anuncio.profesor.correo}
                                                        </span>
                                                    </Grid>
                                                }
                                            />
                                        </ListItem>
                                    ))}
                                </List>
                                <Pagination
                                    count={Math.ceil(anuncios.length / itemsPerPage)}
                                    page={currentPage}
                                    onChange={handlePageChange}
                                    style={{ marginTop: "16px" }}
                                />
                            </React.Fragment>
                        ) : (
                            <Typography sx={{ mt: 4, mb: 2 }}>
                                No hay resultados de búsqueda
                            </Typography>
                        )}
                        <br />
                        <Button variant="contained" onClick={() => handleOnClick()}>
                            Buscar
                        </Button>
                    </Paper>
                </Grid>
            </Grid>
            <ChangeFootNav />
        </div>
    )
}

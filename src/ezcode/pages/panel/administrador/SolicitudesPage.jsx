import { Avatar, Box, Grid, IconButton, List, ListItem, ListItemAvatar, ListItemText, Pagination, Paper, Typography } from '@mui/material';
import { AdminNav } from '../../../components/AdminNav';
import React, { useEffect, useState } from 'react';
import ezcodeApi from '../../../../api/ezcodeApi';
import ReactDOMServer from 'react-dom/server';
import CheckSharpIcon from '@mui/icons-material/CheckSharp';
import ClearSharpIcon from '@mui/icons-material/ClearSharp';
import VisibilitySharpIcon from '@mui/icons-material/VisibilitySharp';
import Swal from 'sweetalert2';
import '../../../../styles.css'

export const SolicitudesPage = () => {
    const [solicitudes, setsolicitudes] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [imageUrls, setImageUrls] = useState({});

    const itemsPerPage = 10;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const displayedSolicitudes = solicitudes.slice(startIndex, endIndex);

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
            try {
                const response = await ezcodeApi.get(`solicitudA/`);
                const solicitudes = response.data.solicitudes
                setsolicitudes(solicitudes);
                const urls = {};
                for (const solicitud of solicitudes) {
                    const url = await obtenerUrlImagenAnuncio(solicitud.anuncio._id);
                    urls[solicitud.anuncio._id] = url;
                }
                setImageUrls(urls);
            } catch (error) {
                console.log(error);
            }
        };
        fetchData();
    }, []);

    const denegarSolicitud = async (idSolicitud) => {
        const response = await ezcodeApi.put(`solicitudA/${idSolicitud}`);
        const profesorId = response.data.profesor;
        const resp = await ezcodeApi.get(`profesor/${profesorId}`);
        const profesorCorreo = resp.data.profesor.correo
        const subject = encodeURIComponent('Solicitud de anuncio denegada en EZCODE');
        const mailtoLink = `https://mail.google.com/mail/?view=cm&fs=1&to=${profesorCorreo}&su=${subject}`;

        const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: 'Estás a punto de denegar este anuncio. Esta acción no se puede deshacer.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Continuar',
            cancelButtonText: 'Cancelar',
        });
        if (result.isConfirmed) {
            try {
                await ezcodeApi.delete(`solicitudA/${idSolicitud}`);
                const result = await Swal.fire({
                    title: 'Solicitud Denegada',
                    icon: 'success',
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: 'Continuar',
                })
                if (result.isConfirmed) {
                    window.open(mailtoLink, '_blank');
                    window.location.reload(false);
                }
            } catch (error) {
                console.log(error)
            }
        }

    }

    const viewAnuncio = async (idAnuncio) => {
        try {
            const response = await ezcodeApi.get(`anuncio/${idAnuncio}`);
            const anuncio = response.data.anuncio;
            const imagen = await obtenerUrlImagenAnuncio(idAnuncio);

            const contenido = ReactDOMServer.renderToString(
                <div>
                    <Typography>Nombre: {anuncio.nombre}</Typography>
                    <br />
                    <Typography>Categoria: {anuncio.categoria}</Typography>
                    <br />
                    <Typography variant='body1'>Descripcion: {anuncio.descripcion}</Typography>
                    <br />
                    <Typography>Precio: {anuncio.precio}MXN</Typography>
                    <hr />
                    <Typography>Profesor: {anuncio.profesor.nombre}</Typography>
                    <br />
                    <Typography>Correo: {anuncio.profesor.correo}</Typography>
                </div>
            );
            Swal.fire({
                title: 'Detalles del Anuncio',
                html: contenido,
                iconHtml: `<img src=${imagen} style="width: 100px; height: 100px;" />`,
                confirmButtonText: 'Cerrar',
            });
        } catch (error) {
            console.log(error)
        }
    }

    const aceptarSolicitud = async (idSolicitud) => {

        const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: 'Estás a punto de aprobar este anuncio. Esta acción no se puede deshacer.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Continuar',
            cancelButtonText: 'Cancelar',
        });
        if (result.isConfirmed) {
            const response = await ezcodeApi.put(`solicitudA/${idSolicitud}`);
            const anuncioId = response.data.anuncio;
            if (response) {
                try {
                    const result = await Swal.fire({
                        title: 'Solicitud Aprobada',
                        icon: 'success',
                        confirmButtonColor: '#3085d6',
                        confirmButtonText: 'Continuar',
                    })
                    if (result.isConfirmed) {
                        await ezcodeApi.put(`anuncio/${anuncioId}`);
                        await ezcodeApi.delete(`solicitudA/${idSolicitud}`);
                        window.location.reload(false);
                    }
                } catch (error) {
                    console.log(error)
                }
            }
        }
    }

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };

    return (
        <Box>
            <AdminNav />
            <Grid
                style={{
                    display: "flex",
                    flexDirection: "column",
                    height: "100vh",
                    width: "100vw",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                <Paper
                    style={{
                        padding: "16px",
                        color: "black",
                        flex: 1,
                        width: "100%",
                    }}
                >
                    <Typography sx={{ mt: 4, mb: 2 }} variant="h6">
                        Solicitudes de anuncios
                    </Typography>
                    <Grid>
                        {solicitudes !== undefined && solicitudes !== null && solicitudes.length > 0 ? (
                            <React.Fragment>
                                <List>
                                    {displayedSolicitudes.map((solicitud, index) => (
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
                                                        edge="end"
                                                        sx={{ marginRight: "8px", backgroundColor: "#000000", color: "white" }}
                                                        onClick={() => viewAnuncio(solicitud.anuncio._id)}
                                                    >
                                                        <VisibilitySharpIcon />
                                                    </IconButton>
                                                    <IconButton
                                                        edge="end"
                                                        sx={{ marginRight: "8px", backgroundColor: "#000000", color: "white" }}
                                                        onClick={() => aceptarSolicitud(solicitud.uid)}
                                                    >
                                                        <CheckSharpIcon />
                                                    </IconButton>
                                                    <IconButton
                                                        edge="end"
                                                        sx={{ marginRight: "8px", backgroundColor: "#000000", color: "white" }}
                                                        onClick={() => denegarSolicitud(solicitud.uid)}
                                                    >
                                                        <ClearSharpIcon />
                                                    </IconButton>
                                                </Grid>
                                            }
                                        >
                                            <ListItemAvatar>
                                                <Avatar>
                                                    <img
                                                        src={imageUrls[solicitud.anuncio._id]}
                                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                    />
                                                </Avatar>
                                            </ListItemAvatar>
                                            <ListItemText
                                                primary={
                                                    <Grid style={{ display: "flex" }}>
                                                        <span style={{ flexGrow: 1 }}>
                                                            Anuncio: {solicitud.anuncio.nombre}
                                                        </span>
                                                        <span style={{ flexGrow: 1 }}>
                                                            Categoría: {solicitud.anuncio.categoria}
                                                        </span>
                                                        {!solicitud.anuncio.precio ? (
                                                            <span style={{ flexGrow: 1 }}>
                                                                Precio: Gratis
                                                            </span>
                                                        ) : (
                                                            <span style={{ flexGrow: 1 }}>
                                                                Precio: {solicitud.anuncio.precio}MXN
                                                            </span>
                                                        )}
                                                    </Grid>
                                                }
                                                secondary={
                                                    <Grid style={{ display: "flex" }}>
                                                        <span style={{ marginRight: "20px" }}>
                                                            Profesor: {solicitud.profesor.nombre}
                                                        </span>
                                                        <span style={{ marginRight: "20px" }}>
                                                            Correo: {solicitud.profesor.correo}
                                                        </span>
                                                        <span style={{ marginRight: "20px" }}>
                                                            Anuncios publicados: {solicitud.profesor.anuncios}
                                                        </span>
                                                        <span>
                                                            Puntos de reporte: {solicitud.profesor.puntosReportes}
                                                        </span>
                                                    </Grid>
                                                }
                                            />
                                        </ListItem>
                                    ))}
                                </List>
                                <Pagination
                                    count={Math.ceil(solicitudes.length / itemsPerPage)}
                                    page={currentPage}
                                    onChange={handlePageChange}
                                    style={{ marginTop: "16px" }}
                                />
                            </React.Fragment>
                        ) : (
                            <Typography sx={{ mt: 4, mb: 2 }}>
                                No hay solicitudes pendientes
                            </Typography>
                        )}
                    </Grid>
                </Paper>
            </Grid >
        </Box >
    )
}

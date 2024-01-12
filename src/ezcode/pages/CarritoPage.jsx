import React, { useEffect, useState } from "react";
import { Avatar, Grid, IconButton, List, ListItem, ListItemAvatar, ListItemText, Pagination, Paper, Typography } from '@mui/material';
import { ChangeNav } from "../components/ChangeNav"
import ReactDOMServer from 'react-dom/server';
import ezcodeApi from "../../api/ezcodeApi";
import VisibilitySharpIcon from '@mui/icons-material/VisibilitySharp';
import PaymentIcon from '@mui/icons-material/Payment';
import Swal from "sweetalert2";
import { jwtDecode } from "jwt-decode";

export const CarritoPage = () => {

    const token = localStorage.getItem('token');
    const decodedToken = jwtDecode(token);
    const userId = decodedToken.uid;

    const [solicitudes, setsolicitudes] = useState([]);
    const [solicitudesAceptadas, setsolicitudesAceptadas] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [imageUrls, setImageUrls] = useState({});

    const itemsPerPage = 5;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const displayedSolicitudes = solicitudes.slice(startIndex, endIndex);
    const displayedSolicitudesAceptadas = solicitudesAceptadas.slice(startIndex, endIndex);

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
                const response = await ezcodeApi.get(`solicitudC/`);
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

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await ezcodeApi.get('solicitudC/aceptada');
                const solicitudesA = response.data.solicitudes
                setsolicitudesAceptadas(solicitudesA);
                const urls = {};
                for (const solicitudeA of solicitudesA) {
                    const url = await obtenerUrlImagenAnuncio(solicitudeA.anuncio._id);
                    urls[solicitudeA.anuncio._id] = url;
                }
                setImageUrls(urls);
            } catch (error) {
                console.log(error);
            }
        };
        fetchData();
    }, []);

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

    const handlePago = async (idAnuncio) => {
        try {
            const response = await ezcodeApi.get(`anuncio/${idAnuncio}`);
            const anuncio = response.data.anuncio;
            const responsePago = await ezcodeApi.post(`pago/create-order/${anuncio.nombre}/${anuncio.precio}`, { idProducto: idAnuncio, idCliente: userId });
            window.open(responsePago.data.links[1].href, '_blank');

            if (responsePago.data.links[1].rel === "approve") {
                const result = await Swal.fire({
                    title: 'Evento Procesado',
                    text: 'Si el pago fue completado el curso se creará automaticamente, si fue cancelado, la solicitud queda en espera de pago',
                    icon: "info",
                    confirmButtonText: 'Ok',
                })
                if (result.isConfirmed) {
                    window.location.reload(false);
                }
            }
        } catch (error) {
            console.log(error)
        }
    }

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };

    return (
        <div className="backHome">
            <ChangeNav />
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
                        Solicitudes enviadas
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
                                                            Curso: {solicitud.anuncio.nombre}
                                                        </span>
                                                        <span style={{ flexGrow: 1 }}>
                                                            Categoría: {solicitud.anuncio.categoria}
                                                        </span>
                                                        <span style={{ flexGrow: 1 }}>
                                                            Precio: {solicitud.anuncio.precio}MXN
                                                        </span>
                                                    </Grid>
                                                }
                                                secondary={
                                                    <Grid style={{ display: "flex" }}>
                                                        <span style={{ marginRight: "20px" }}>
                                                            Profesor: {solicitud.profesor.nombre}
                                                        </span>
                                                        <span>
                                                            Correo: {solicitud.profesor.correo}
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
                                No tienes solicitudes de cursos enviadas
                            </Typography>
                        )}
                    </Grid>
                    <br />
                    <hr />
                    <Typography sx={{ mt: 4, mb: 2 }} variant="h6">
                        Solicitudes pendientes por pagar
                    </Typography>
                    <Grid>
                        {solicitudesAceptadas !== undefined && solicitudesAceptadas !== null && solicitudesAceptadas.length > 0 ? (
                            <React.Fragment>
                                <List>
                                    {displayedSolicitudesAceptadas.map((solicitudAceptada, index) => (
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
                                                        onClick={() => viewAnuncio(solicitudAceptada.anuncio._id)}
                                                    >
                                                        <VisibilitySharpIcon />
                                                    </IconButton>

                                                    <IconButton
                                                        disabled={solicitudAceptada.alumno.baneado}
                                                        edge="end"
                                                        sx={{ marginRight: "8px", backgroundColor: "#000000", color: "white" }}
                                                        onClick={() => handlePago(solicitudAceptada.anuncio._id)}
                                                    >
                                                        <PaymentIcon />
                                                    </IconButton>
                                                </Grid>
                                            }
                                        >
                                            <ListItemAvatar>
                                                <Avatar>
                                                    <img
                                                        src={imageUrls[solicitudAceptada.anuncio._id]}
                                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                    />
                                                </Avatar>
                                            </ListItemAvatar>
                                            <ListItemText
                                                primary={
                                                    <Grid style={{ display: "flex" }}>
                                                        <span style={{ flexGrow: 1 }}>
                                                            Curso: {solicitudAceptada.anuncio.nombre}
                                                        </span>
                                                        <span style={{ flexGrow: 1 }}>
                                                            Categoría: {solicitudAceptada.anuncio.categoria}
                                                        </span>
                                                        <span style={{ flexGrow: 1 }}>
                                                            Precio: {solicitudAceptada.anuncio.precio}MXN
                                                        </span>
                                                    </Grid>
                                                }
                                                secondary={
                                                    <Grid style={{ display: "flex" }}>
                                                        <span style={{ marginRight: "20px" }}>
                                                            Profesor: {solicitudAceptada.profesor.nombre}
                                                        </span>
                                                        <span>
                                                            Correo: {solicitudAceptada.profesor.correo}
                                                        </span>
                                                    </Grid>
                                                }
                                            />
                                        </ListItem>
                                    ))}
                                </List>
                                <Pagination
                                    count={Math.ceil(solicitudesAceptadas.length / itemsPerPage)}
                                    page={currentPage}
                                    onChange={handlePageChange}
                                    style={{ marginTop: "16px" }}
                                />
                            </React.Fragment>
                        ) : (
                            <Typography sx={{ mt: 4, mb: 2 }}>
                                No tienes solicitudes de cursos pendientes por pagar
                            </Typography>
                        )}
                    </Grid>
                </Paper>
            </Grid>
        </div>
    )
}

import React, { useEffect, useState } from 'react';
import { Avatar, Grid, IconButton, List, ListItem, ListItemAvatar, ListItemText, Pagination, Paper, Typography } from '@mui/material';
import { ProfeNav } from "../../../components/ProfeNav"
import ReactDOMServer from 'react-dom/server';
import CheckSharpIcon from '@mui/icons-material/CheckSharp';
import ClearSharpIcon from '@mui/icons-material/ClearSharp';
import VisibilitySharpIcon from '@mui/icons-material/VisibilitySharp';
import ezcodeApi from "../../../../api/ezcodeApi";
import Swal from "sweetalert2";
import { jwtDecode } from 'jwt-decode';

export const SolicitudesProfePage = () => {
    const [solicitudes, setsolicitudes] = useState([]);
    const [profesor, setProfesor] = useState({});
    const [limite, setLimite] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [imageUrls, setImageUrls] = useState({});

    const itemsPerPage = 10;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const displayedSolicitudes = solicitudes.slice(startIndex, endIndex);

    const token = localStorage.getItem('token');
    const decodedToken = jwtDecode(token);
    const userId = decodedToken.uid;

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
                const profeResp = await ezcodeApi.get(`profesor/${userId}`);
                setProfesor(profeResp.data.profesor);
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

    const denegarSolicitud = async (idSolicitud) => {
        const response = await ezcodeApi.put(`solicitudC/${idSolicitud}`);
        const alumnoId = response.data.alumno;
        const resp = await ezcodeApi.get(`user/${alumnoId}`);
        const alumnoCorreo = resp.data.alumno.correo
        const subject = encodeURIComponent('Solicitud de anuncio denegada en EZCODE');
        const mailtoLink = `https://mail.google.com/mail/?view=cm&fs=1&to=${alumnoCorreo}&su=${subject}`;

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
                await ezcodeApi.delete(`solicitudC/${idSolicitud}`);
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
        const profeResp = await ezcodeApi.get(`profesor/${userId}`);
        const limite = profeResp.data.profesor.limiteCurso
        setLimite(limite);

        const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: 'Estás a punto de aprobar esta solicitud. Esta acción no se puede deshacer.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Continuar',
            cancelButtonText: 'Cancelar',
        });
        if (result.isConfirmed) {
            const response = await ezcodeApi.put(`solicitudC/${idSolicitud}`);
            if (response) {
                try {
                    const result = await Swal.fire({
                        title: 'Solicitud Aprobada',
                        icon: 'success',
                        confirmButtonColor: '#3085d6',
                        confirmButtonText: 'Continuar',
                    })
                    if (result.isConfirmed) {
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
        <div>
            <ProfeNav />
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
                        Solo puedes aprobar solicitudes si no tienes mas de 5 cursos activos en tu cuenta
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
                                                        disabled={limite > 5 || profesor.baneado}
                                                        edge="end"
                                                        sx={{ marginRight: "8px", backgroundColor: "#000000", color: "white" }}
                                                        onClick={() => aceptarSolicitud(solicitud.uid)}
                                                    >
                                                        <CheckSharpIcon />
                                                    </IconButton>
                                                    <IconButton
                                                        disabled={profesor.baneado}
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
                                                            Solicitud: {solicitud.anuncio.nombre}
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
                                                            Alumno: {solicitud.alumno.nombre}
                                                        </span>
                                                        <span style={{ marginRight: "20px" }}>
                                                            Correo: {solicitud.alumno.correo}
                                                        </span>
                                                        <span style={{ marginRight: "20px" }}>
                                                            Cursos acreditados: {solicitud.alumno.acreditados}
                                                        </span>
                                                        <span style={{ marginRight: "20px" }}>
                                                            Desempeño academico: {solicitud.alumno.desempeno}
                                                        </span>
                                                        <span>
                                                            Puntos de reportes: {solicitud.alumno.puntosReportes}
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
            </Grid>
        </div>
    )
}
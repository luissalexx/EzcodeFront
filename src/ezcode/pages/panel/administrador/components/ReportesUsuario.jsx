import React, { useEffect, useState } from 'react'
import { AdminNav } from '../../../../components/AdminNav'
import { useNavigate, useParams } from 'react-router-dom'
import VisibilitySharpIcon from '@mui/icons-material/VisibilitySharp';
import ezcodeApi from '../../../../../api/ezcodeApi';
import { Button, Grid, IconButton, List, ListItem, ListItemText, Pagination, Paper, Typography } from '@mui/material';
import FolderIcon from '@mui/icons-material/Folder';
import Swal from 'sweetalert2';
import DeleteIcon from '@mui/icons-material/Delete';
import ReactDOMServer from 'react-dom/server';

export const ReportesUsuario = () => {
    const { id } = useParams();
    const [reportes, setReportes] = useState([]);
    const [usuario, setUsuario] = useState({});

    const [currentPage, setCurrentPage] = useState(1);
    const navigate = useNavigate();

    const itemsPerPage = 10;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const displayedReportes = reportes.slice(startIndex, endIndex);

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };

    const verCarpeta = async (curso) => {
        try {
            const response = await ezcodeApi.get(`curso/${curso}`);
            const idCarpeta = response.data.curso.carpeta;

            if (!idCarpeta) {
                Swal.fire({
                    title: 'Carpeta del curso sin crear',
                    icon: 'info',
                    confirmButtonText: 'Ok',
                })
            } else {
                const enlaceConId = `https://drive.google.com/drive/folders/${idCarpeta}?usp=drive_link`;
                window.open(enlaceConId, '_blank');
            }
        } catch (error) {
            Swal.fire({
                title: 'No se puede acceder a la carpeta',
                text: 'El curso que tenia la carpeta ya no existe',
                icon: 'error',
                confirmButtonText: 'Ok',
            })
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const responseProfe = await ezcodeApi.get(`profesor/reportesProfesor/${id}`);
                if (responseProfe.data.mensaje !== 'Profesor no encontrado.') {
                    setReportes(responseProfe.data);
                    const respProfe = await ezcodeApi.get(`profesor/${id}`);
                    setUsuario(respProfe.data.profesor);
                } else {
                    const responseAlumno = await ezcodeApi.get(`user/reportesUsuario/${id}`);
                    if (responseAlumno.data.mensaje !== 'Cliente no encontrado.') {
                        setReportes(responseAlumno.data);
                        const respAlumno = await ezcodeApi.get(`user/${id}`);
                        setUsuario(respAlumno.data.alumno);
                    }
                }
            } catch (error) {
                console.log(error);
            }
        };
        fetchData();
    }, []);

    const verMotivo = async (reporte) => {
        const contenido = ReactDOMServer.renderToString(
            <div>
                <Typography variant='body1'>
                    {reporte.motivo}
                </Typography>
            </div>
        );
        await Swal.fire({
            title: 'Motivo del reporte',
            html: contenido,
            confirmButtonColor: '#666666',
            confirmButtonText: 'Ok',
        });
    }

    const borrarReporte = async (reporte) => {
        try {
            const responseProfe = await ezcodeApi.delete(`profesor/reporte/${id}/${reporte._id}`);
            if (responseProfe.data.mensaje === 'Profesor no encontrado.') {
                const respAlumno = await ezcodeApi.delete(`user/reporte/${id}/${reporte._id}`);

                if (respAlumno) {
                    restarPuntosAlumno(reporte, id);
                    Swal.fire({
                        title: 'Reporte eliminado',
                        icon: 'success',
                        confirmButtonText: 'Ok',
                    }).then((result) => {
                        if (result.isConfirmed) {
                            window.location.reload(false);
                        }
                    });
                }
            }

            if (responseProfe) {
                restarPuntosProfe(reporte, id)
                Swal.fire({
                    title: 'Reporte eliminado',
                    icon: 'success',
                    confirmButtonText: 'Ok',
                }).then((result) => {
                    if (result.isConfirmed) {
                        window.location.reload(false);
                    }
                });
            }
        } catch (error) {
            console.log(error);
        }
    }

    const restarPuntosProfe = async (reporte, usuarioId) => {
        if (reporte.tipo === "Contenidos incompletos") {

            const puntosNuevos = 3;
            await ezcodeApi.put(`profesor/reportePuntosMenos/${usuarioId}`, { puntos: puntosNuevos });
        } else if (reporte.tipo === "Conducta inadecuada y ofensiva") {
            const puntosNuevos = 3;
            await ezcodeApi.put(`profesor/reportePuntosMenos/${usuarioId}`, { puntos: puntosNuevos });
        } else if (reporte.tipo === "Nulo conocimiento de los temas") {
            const puntosNuevos = 5;
            await ezcodeApi.put(`profesor/reportePuntosMenos/${usuarioId}`, { puntos: puntosNuevos });
        } else if (reporte.tipo === "Contenido inapropiado") {
            const puntosNuevos = 5;
            await ezcodeApi.put(`profesor/reportePuntosMenos/${usuarioId}`, { puntos: puntosNuevos });
        }
    }

    const restarPuntosAlumno = async (reporte, usuarioId) => {
        if (reporte.tipo === "Conducta inadecuada y ofensiva") {
            const puntosNuevos = 3;
            await ezcodeApi.put(`user/reportePuntosMenos/${usuarioId}`, { puntos: puntosNuevos });
        } else if (reporte.tipo === "Inasistencia en el curso") {
            const puntosNuevos = 1;
            await ezcodeApi.put(`user/reportePuntosMenos/${usuarioId}`, { puntos: puntosNuevos });
        } else if (reporte.tipo === "Incumplimiento o Desinterés en el curso") {
            const puntosNuevos = 1;
            await ezcodeApi.put(`user/reportePuntosMenos/${usuarioId}`, { puntos: puntosNuevos });
        }
    }

    return (
        <div>
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
                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                        <Typography sx={{ flexGrow: 1 }} variant="h5">
                            Nombre: {usuario.nombre} {usuario.apellido}
                        </Typography>
                        <Typography sx={{ flexGrow: 1 }} variant="h5">
                            Correo: {usuario.correo}
                        </Typography>
                        <Typography sx={{ flexGrow: 1 }} variant="h5">
                            Número: +{usuario.celular}
                        </Typography>
                    </div>
                    <br />
                    <hr />
                    <Grid>
                        {reportes !== undefined && reportes !== null && reportes.length > 0 ? (
                            <React.Fragment>
                                <List>
                                    {displayedReportes.map((reporte, index) => (
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
                                                        aria-label="delete"
                                                        style={{ marginRight: "8px" }}
                                                        onClick={() => verCarpeta(reporte.curso)}
                                                    >
                                                        <FolderIcon />
                                                    </IconButton>
                                                    <IconButton
                                                        edge="end"
                                                        sx={{ marginRight: "8px", backgroundColor: "#000000", color: "white" }}
                                                        onClick={() => borrarReporte(reporte)}
                                                    >
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </Grid>
                                            }
                                        >
                                            <ListItemText
                                                primary={
                                                    <Grid style={{ display: "flex" }}>
                                                        <span style={{ flexGrow: 1 }}>
                                                            Tipo: {reporte.tipo}
                                                        </span>
                                                        <div style={{ flexGrow: 1 }}>
                                                            <IconButton
                                                                edge="end"
                                                                sx={{ marginRight: "8px", backgroundColor: "#000000", color: "white" }}
                                                                onClick={() => verMotivo(reporte)}
                                                            >
                                                                <VisibilitySharpIcon />
                                                            </IconButton>
                                                        </div>
                                                    </Grid>
                                                }
                                            />
                                        </ListItem>
                                    ))}
                                </List>
                                <Pagination
                                    count={Math.ceil(reportes.length / itemsPerPage)}
                                    page={currentPage}
                                    onChange={handlePageChange}
                                    style={{ marginTop: "16px" }}
                                />
                                <br />
                            </React.Fragment>
                        ) : (
                            <Typography sx={{ mt: 4, mb: 2 }}>
                                El usuario no cuenta con reportes ;D
                            </Typography>
                        )}
                    </Grid>
                    <Button onClick={() => navigate(-1)} color="primary">
                        Volver
                    </Button>
                </Paper>
            </Grid>
        </div>
    )
}

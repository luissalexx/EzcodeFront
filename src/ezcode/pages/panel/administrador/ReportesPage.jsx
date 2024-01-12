import React, { useEffect, useState } from 'react'
import { AdminNav } from '../../../components/AdminNav'
import VisibilitySharpIcon from '@mui/icons-material/VisibilitySharp';
import { Grid, IconButton, List, ListItem, ListItemText, Pagination, Paper, Typography } from '@mui/material'
import ezcodeApi from '../../../../api/ezcodeApi';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';

export const ReportesPage = () => {
    const [profesores, setProfesores] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [alumnos, setAlumnos] = useState([]);
    const navigate = useNavigate();

    const itemsPerPage = 10;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const displayedProfesores = profesores.slice(startIndex, endIndex);
    const displayedAlumnos = alumnos.slice(startIndex, endIndex);

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const responseProfe = await ezcodeApi.get(`profesor/reportes`);
                setProfesores(responseProfe.data);
                const responseAlumno = await ezcodeApi.get(`user/reportes`);
                setAlumnos(responseAlumno.data);
            } catch (error) {
                console.log(error);
            }
        };
        fetchData();
    }, []);

    const banearProfe = async (profeId, correoProfe) => {
        try {
            const response = await ezcodeApi.put(`profesor/banear/${profeId}`);
            const subject = encodeURIComponent('Cuenta de usuario baneada en EZCODE');
            const mailtoLink = `https://mail.google.com/mail/?view=cm&fs=1&to=${correoProfe}&su=${subject}`;
            if (response) {
                Swal.fire({
                    title: 'Usuario Baneado',
                    icon: 'success',
                    confirmButtonText: 'Ok',
                }).then((result) => {
                    if (result.isConfirmed) {
                        window.open(mailtoLink, '_blank');
                        window.location.reload(false);
                    }
                });
            }
        } catch (error) {
            console.log(error);
        }
    }

    const desbanearProfe = async (profeId) => {
        try {
            const response = await ezcodeApi.put(`profesor/desbanear/${profeId}`);
            if (response) {
                Swal.fire({
                    title: 'Usuario Desbaneado',
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

    const banearAlumno = async (alumnoId, alumnoCorreo) => {
        try {
            const response = await ezcodeApi.put(`user/banear/${alumnoId}`);
            const subject = encodeURIComponent('Cuenta de usuario baneada en EZCODE');
            const mailtoLink = `https://mail.google.com/mail/?view=cm&fs=1&to=${alumnoCorreo}&su=${subject}`;
            if (response) {
                Swal.fire({
                    title: 'Usuario Baneado',
                    icon: 'success',
                    confirmButtonText: 'Ok',
                }).then((result) => {
                    if (result.isConfirmed) {
                        window.open(mailtoLink, '_blank');
                        window.location.reload(false);
                    }
                });
            }
        } catch (error) {
            console.log(error);
        }
    }

    const desbanearAlumno = async (alumnoId) => {
        try {
            const response = await ezcodeApi.put(`user/desbanear/${alumnoId}`);
            if (response) {
                Swal.fire({
                    title: 'Usuario Desbaneado',
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
                    <Typography sx={{ mt: 4, mb: 2 }} variant="h5">
                        Usuarios reportados
                    </Typography>
                    <hr />
                    <Typography sx={{ mt: 4, mb: 2 }} variant="h6">
                        Profesores
                    </Typography>
                    <Grid>
                        {profesores !== undefined && profesores !== null && profesores.length > 0 ? (
                            <React.Fragment>
                                <List>
                                    {displayedProfesores.map((profesor, index) => (
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
                                                        onClick={() => navigate(`/admin/reportes/usuario/${profesor.uid}`)}
                                                    >
                                                        <VisibilitySharpIcon />
                                                    </IconButton>

                                                    <IconButton
                                                        disabled={profesor.puntosReportes < 5 || profesor.baneado}
                                                        edge="end"
                                                        sx={{ marginRight: "8px", backgroundColor: "#000000", color: "white" }}
                                                        onClick={() => banearProfe(profesor.uid, profesor.correo)}
                                                    >
                                                        <LockIcon />
                                                    </IconButton>
                                                    <IconButton
                                                        disabled={!(profesor.baneado)}
                                                        edge="end"
                                                        sx={{ marginRight: "8px", backgroundColor: "#000000", color: "white" }}
                                                        onClick={() => desbanearProfe(profesor.uid)}
                                                    >
                                                        <LockOpenIcon />
                                                    </IconButton>
                                                </Grid>
                                            }
                                        >
                                            <ListItemText
                                                primary={
                                                    <Grid style={{ display: "flex" }}>
                                                        <span style={{ flexGrow: 1 }}>
                                                            Usuario: {profesor.nombre} {profesor.apellido}
                                                        </span>
                                                        <span style={{ flexGrow: 1 }}>
                                                            {profesor.correo}
                                                        </span>
                                                        <span style={{ flexGrow: 1 }}>
                                                            Puntos de reporte: {profesor.puntosReportes}
                                                        </span>
                                                    </Grid>
                                                }
                                            />
                                        </ListItem>
                                    ))}
                                </List>
                                <Pagination
                                    count={Math.ceil(profesores.length / itemsPerPage)}
                                    page={currentPage}
                                    onChange={handlePageChange}
                                    style={{ marginTop: "16px" }}
                                />
                            </React.Fragment>
                        ) : (
                            <Typography sx={{ mt: 4, mb: 2 }}>
                                No hay profesores con reportes
                            </Typography>
                        )}
                    </Grid>
                    <hr />
                    <Typography sx={{ mt: 4, mb: 2 }} variant="h6">
                        Alumnos
                    </Typography>
                    <Grid>
                        {alumnos !== undefined && alumnos !== null && alumnos.length > 0 ? (
                            <React.Fragment>
                                <List>
                                    {displayedAlumnos.map((alumno, index) => (
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
                                                        onClick={() => navigate(`/admin/reportes/usuario/${alumno.uid}`)}
                                                    >
                                                        <VisibilitySharpIcon />
                                                    </IconButton>

                                                    <IconButton
                                                        disabled={alumno.puntosReportes < 5 || alumno.baneado}
                                                        edge="end"
                                                        sx={{ marginRight: "8px", backgroundColor: "#000000", color: "white" }}
                                                        onClick={() => banearAlumno(alumno.uid, alumno.correo)}
                                                    >
                                                        <LockIcon />
                                                    </IconButton>
                                                    <IconButton
                                                        disabled={!(alumno.baneado)}
                                                        edge="end"
                                                        sx={{ marginRight: "8px", backgroundColor: "#000000", color: "white" }}
                                                        onClick={() => desbanearAlumno(alumno.uid)}
                                                    >
                                                        <LockOpenIcon />
                                                    </IconButton>
                                                </Grid>
                                            }
                                        >
                                            <ListItemText
                                                primary={
                                                    <Grid style={{ display: "flex" }}>
                                                        <span style={{ flexGrow: 1 }}>
                                                            Usuario: {alumno.nombre} {alumno.apellido}
                                                        </span>
                                                        <span style={{ flexGrow: 1 }}>
                                                            {alumno.correo}
                                                        </span>
                                                        <span style={{ flexGrow: 1 }}>
                                                            Puntos de reporte: {alumno.puntosReportes}
                                                        </span>
                                                    </Grid>
                                                }
                                            />
                                        </ListItem>
                                    ))}
                                </List>
                                <Pagination
                                    count={Math.ceil(alumnos.length / itemsPerPage)}
                                    page={currentPage}
                                    onChange={handlePageChange}
                                    style={{ marginTop: "16px" }}
                                />
                            </React.Fragment>
                        ) : (
                            <Typography sx={{ mt: 4, mb: 2 }}>
                                No hay alumnos con reportes
                            </Typography>
                        )}
                    </Grid>
                </Paper>
            </Grid>
        </div>
    )
}

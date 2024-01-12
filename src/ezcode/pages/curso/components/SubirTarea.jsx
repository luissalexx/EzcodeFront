import { Button, Grid, IconButton, List, ListItem, ListItemText, Pagination, Typography, TextField, Input } from '@mui/material';
import React, { useEffect, useState } from "react"
import ReactDOMServer from 'react-dom/server';
import ezcodeApi from "../../../../api/ezcodeApi";
import VisibilitySharpIcon from '@mui/icons-material/VisibilitySharp';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

export const SubirTarea = ({ id }) => {
    const tipo = localStorage.getItem('tipo');
    const navigate = useNavigate();

    const [curso, setCurso] = useState({});
    const [alumno, setAlumno] = useState({});
    const [profesor, setProfesor] = useState({});
    const [tareas, setTareas] = useState([]);
    const [tareasEntregadas, setTareasEntregadas] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [file, setFile] = useState(null);
    const [calificacion, setCalificacion] = useState(0);
    const [calificacionTarea, setCalificacionTarea] = useState(0);

    const itemsPerPage = 5;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const displayedTareas = tareas.slice(startIndex, endIndex);
    const displayedTareasEntregadas = tareasEntregadas.slice(startIndex, endIndex);

    const handleCalificacionCurso = (event) => {
        let inputValue = event.target.value;
        if (isNaN(inputValue)) {
            return;
        }
        inputValue = parseInt(inputValue, 10);
        inputValue = Math.min(Math.max(0, inputValue), 100);
        setCalificacion(inputValue);
    };

    const handleCalificacionTarea = (event) => {
        let inputValue = event.target.value;
        if (isNaN(inputValue)) {
            return;
        }

        inputValue = parseInt(inputValue, 10);
        inputValue = Math.min(Math.max(0, inputValue), 100);
        setCalificacionTarea(inputValue);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await ezcodeApi.get(`curso/${id}`);
                const courseDataFromServer = response.data.curso;
                setCurso(courseDataFromServer);

                const alumnoId = courseDataFromServer.alumno;
                const respAlumno = await ezcodeApi.get(`user/${alumnoId}`);
                setAlumno(respAlumno.data.alumno);

                const profeId = courseDataFromServer.profesor;
                const respProfe = await ezcodeApi.get(`profesor/${profeId}`);
                setProfesor(respProfe.data.profesor);

                const responsePendientes = await ezcodeApi.get(`curso/pendientes/${id}`);
                setTareas(responsePendientes.data);

                const responseEntregadas = await ezcodeApi.get(`curso/entregadas/${id}`);
                setTareasEntregadas(responseEntregadas.data);
            } catch (error) {
                console.log(error);
            }
        };
        fetchData();
    }, []);

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };

    const viewAsignacion = async (tarea) => {
        const contenido = ReactDOMServer.renderToString(
            <div>
                <Typography variant='body1'>{tarea.asignacion}</Typography>
            </div>
        );
        await Swal.fire({
            title: 'Asignacion',
            html: contenido,
            confirmButtonColor: '#666666',
            confirmButtonText: 'Ok',
        });
    }

    const viewUrl = async (tarea) => {
        const contenido = ReactDOMServer.renderToString(
            <div>
                <Typography variant='body1'>
                    Asignacion: {tarea.asignacion}
                </Typography>
                <br />
                <Typography>
                    <a href={tarea.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>
                        <Typography>
                            Archivo entregado: {tarea.url}
                        </Typography>
                    </a>
                </Typography>
            </div>
        );
        await Swal.fire({
            title: 'Detalles de la tarea',
            html: contenido,
            confirmButtonColor: '#666666',
            confirmButtonText: 'Ok',
        });
    }

    const borrarTarea = async (tareaId) => {
        try {
            const result = await Swal.fire({
                title: '¿Estás seguro?',
                text: 'Estás a punto de borrar esta tarea. Esta acción no se puede deshacer.',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Continuar',
                cancelButtonText: 'Cancelar',
            });

            if (result.isConfirmed) {
                await ezcodeApi.delete(`curso/tarea/${id}/${tareaId}`);
                window.location.reload(false);
            }
        } catch (error) {
            Swal.fire('Error', 'Hubo un error al borrar el anuncio', 'error');
        }
    };

    const borrarArchivo = async (tarea) => {
        try {
            const result = await Swal.fire({
                title: '¿Estás seguro?',
                text: 'Estás a punto de borrar el archivo de esta tarea. Esta acción no se puede deshacer.',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Continuar',
                cancelButtonText: 'Cancelar',
            });

            if (result.isConfirmed) {
                await ezcodeApi.delete(`drive/delete/${tarea.archivoId}/${id}/${tarea._id}`);
                const resultResponse = await Swal.fire({
                    title: 'Archivo borrado',
                    text: 'La tarea paso a ser pendiente de entrega',
                    icon: 'success',
                    confirmButtonText: 'Continuar',
                });
                if (resultResponse.isConfirmed) {
                    window.location.reload(false);
                }
            }
        } catch (error) {
            Swal.fire('Error', 'Hubo un error al borrar el anuncio', 'error');
        }
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async (folderId, tareaId) => {
        if (!file) {
            return;
        }

        try {
            const formData = new FormData();
            formData.append('archivo', file);

            const response = await ezcodeApi.post(`drive/upload/${folderId}`, formData);
            const fileUrl = response.data.fileUrl;
            const fileId = response.data.fileId;
            const result = await Swal.fire({
                title: 'Archivo subido a la carpeta',
                icon: "success",
                confirmButtonText: 'Ok',
            })
            if (result.isConfirmed) {
                await ezcodeApi.put(`curso/tarea/${id}/${tareaId}`, { url: fileUrl, archivoId: fileId });
                window.location.reload(false);
            }
        } catch (err) {
            console.error('Error uploading file:', err);
        }
    };

    const calificarCurso = async (event) => {
        event.preventDefault();
        try {
            const result = await Swal.fire({
                title: '¿Estás seguro?',
                text: 'Estás a punto de acreditar el curso al dar la calificacion. Esta acción no se puede deshacer.',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Continuar',
                cancelButtonText: 'Cancelar',
            });

            if (result.isConfirmed) {
                const response = await ezcodeApi.put(`curso/${id}`, {
                    calificacion: calificacion,
                });
                if (response) {
                    const calificado = await Swal.fire({
                        title: 'Curso calificado',
                        icon: "success",
                        confirmButtonText: 'Ok',
                    });

                    if (calificado.isConfirmed) {
                        navigate(-1);
                    }
                }
            }
        } catch (error) {
            console.error('Error al enviar la calificación:', error);
        }
    };

    const calificarTarea = async (event, tareaId) => {
        event.preventDefault();
        try {
            const response = await ezcodeApi.put(`curso/tareaCalificar/${id}/${tareaId}`, {
                calificacion: calificacionTarea,
            });
            if (response) {
                const result = await Swal.fire({
                    title: 'Tarea calificada',
                    icon: "success",
                    confirmButtonText: 'Ok',
                });

                if (result.isConfirmed) {
                    window.location.reload(false);
                }
            }
        } catch (error) {
            console.error('Error al enviar la calificación:', error);
        }
    };

    function formatDate(timestamp) {
        const date = new Date(timestamp);
        const options = { day: '2-digit', month: '2-digit', year: 'numeric', hour: 'numeric', minute: '2-digit' };
        return date.toLocaleString('es-ES', options);
    }

    return (
        <div>
            <Grid
                style={{
                    height: "70vh",
                    width: "100%",
                }}
            >
                <Typography variant="h6">
                    Tareas pendientes
                </Typography>
                <Grid>
                    {tareas !== undefined && tareas !== null && tareas.length > 0 ? (
                        <React.Fragment>
                            <List>
                                {displayedTareas.map((tarea, index) => (
                                    <ListItem
                                        key={index}
                                        style={{
                                            border: "1px solid #ddd",
                                            borderRadius: "8px",
                                            backgroundColor: "white",
                                            color: 'black'
                                        }}
                                        secondaryAction={
                                            <Grid>
                                                {tipo === "Profesor" ? (
                                                    <div>
                                                        <IconButton
                                                            disabled={curso.acreditado || profesor.baneado}
                                                            edge="end"
                                                            aria-label="update"
                                                            style={{ marginRight: "8px" }}
                                                            onClick={() => navigate(`/profesor/curso/tarea/editar/${id}/${tarea._id}`)}
                                                        >
                                                            <EditIcon />
                                                        </IconButton>
                                                        <IconButton
                                                            disabled={curso.acreditado || profesor.baneado}
                                                            edge="end"
                                                            aria-label="delete"
                                                            style={{ marginRight: "8px" }}
                                                            onClick={() => borrarTarea(tarea._id)}
                                                        >
                                                            <DeleteIcon />
                                                        </IconButton>
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <Input
                                                            disabled={curso.acreditado || alumno.baneado}
                                                            type="file"
                                                            onChange={handleFileChange}
                                                        />
                                                        <IconButton disabled={!file} onClick={() => handleUpload(curso.carpeta, tarea._id)}>
                                                            <CloudUploadIcon />
                                                        </IconButton>
                                                    </div>
                                                )}
                                            </Grid>
                                        }
                                    >
                                        <ListItemText
                                            primary={
                                                <Grid style={{ display: "flex" }}>
                                                    <span style={{ flexGrow: 1 }}>
                                                        Nombre: {tarea.nombre}
                                                    </span>
                                                    <div style={{ flexGrow: 1 }}>
                                                        <IconButton
                                                            disabled={curso.acreditado}
                                                            edge="end"
                                                            sx={{ marginRight: "8px", backgroundColor: "#000000", color: "white", }}
                                                            onClick={() => viewAsignacion(tarea)}
                                                        >
                                                            <VisibilitySharpIcon />
                                                        </IconButton>
                                                    </div>
                                                </Grid>
                                            }
                                            secondary={
                                                <Grid>
                                                    <span>{formatDate(tarea.timestamp)}</span>
                                                </Grid>
                                            }
                                        />
                                    </ListItem>
                                ))}
                            </List>
                            <Pagination
                                count={Math.ceil(tareas.length / itemsPerPage)}
                                page={currentPage}
                                onChange={handlePageChange}
                                style={{
                                    marginTop: "16px", backgroundColor: 'white', width: "10%", border: "1px solid #ddd",
                                    borderRadius: "8px",
                                }}
                            />
                        </React.Fragment>
                    ) : (
                        <Typography sx={{ mt: 4, mb: 2 }}>
                            No hay tareas pendientes en el curso
                        </Typography>
                    )}
                    <br />
                    {tipo === "Profesor" ? (
                        <Button disabled={curso.acreditado || profesor.baneado} variant='contained' onClick={() => navigate(`/profesor/curso/tarea/crear/${id}`)}>
                            Crear asignacion
                        </Button>
                    ) : null}
                </Grid>
                <br />
                <hr />
                <br />
                <Typography variant="h6">
                    Tareas entregadas
                </Typography>
                <Grid>
                    {tareasEntregadas !== undefined && tareasEntregadas !== null && tareasEntregadas.length > 0 ? (
                        <React.Fragment>
                            <List>
                                {displayedTareasEntregadas.map((tareaEntregada, index) => (
                                    <ListItem
                                        key={index}
                                        style={{
                                            border: "1px solid #ddd",
                                            borderRadius: "8px",
                                            backgroundColor: "white",
                                            color: 'black'
                                        }}
                                        secondaryAction={
                                            <Grid>
                                                {tipo === "Profesor" && !curso.acreditado ? (
                                                    <div>
                                                        <div style={{ display: 'flex', flexDirection: 'row', marginRight: "8px" }}>
                                                            <form onSubmit={(event) => calificarTarea(event, tareaEntregada._id)}>
                                                                <TextField
                                                                    style={{ width: '50%' }}
                                                                    label="Calificar"
                                                                    name="calificacion"
                                                                    type='number'
                                                                    value={calificacionTarea}
                                                                    autoComplete='off'
                                                                    fullWidth
                                                                    margin="normal"
                                                                    onChange={handleCalificacionTarea}
                                                                    required
                                                                />
                                                                <IconButton disabled={curso.acreditado || profesor.baneado} type="submit" variant="contained" color="primary">
                                                                    <CheckCircleIcon />
                                                                </IconButton>
                                                            </form>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <IconButton
                                                            disabled={tareaEntregada.calificacion > 0 || alumno.baneado}
                                                            edge="end"
                                                            aria-label="delete"
                                                            style={{ marginRight: "8px" }}
                                                            onClick={() => borrarArchivo(tareaEntregada)}
                                                        >
                                                            <DeleteIcon />
                                                        </IconButton>
                                                    </div>
                                                )}
                                            </Grid>
                                        }
                                    >
                                        <ListItemText
                                            primary={
                                                <Grid style={{ display: "flex" }}>
                                                    <span style={{ flexGrow: 1 }}>
                                                        Nombre: {tareaEntregada.nombre}
                                                    </span>
                                                    <div style={{ flexGrow: 1 }}>
                                                        <IconButton
                                                            edge="end"
                                                            sx={{ marginRight: "8px", backgroundColor: "#000000", color: "white", }}
                                                            onClick={() => viewUrl(tareaEntregada)}
                                                        >
                                                            <VisibilitySharpIcon />
                                                        </IconButton>
                                                    </div>
                                                </Grid>
                                            }
                                            secondary={
                                                <Grid>
                                                    <span style={{ flexGrow: 1 }}>
                                                        Calificacion: {tareaEntregada.calificacion}
                                                    </span>
                                                </Grid>
                                            }
                                        />
                                    </ListItem>
                                ))}
                            </List>
                            <Pagination
                                count={Math.ceil(tareasEntregadas.length / itemsPerPage)}
                                page={currentPage}
                                onChange={handlePageChange}
                                style={{
                                    marginTop: "16px", backgroundColor: 'white', width: "10%", border: "1px solid #ddd",
                                    borderRadius: "8px",
                                }}
                            />
                        </React.Fragment>
                    ) : (
                        <Typography sx={{ mt: 4, mb: 2 }}>
                            No hay tareas entregadas en el curso
                        </Typography>
                    )}
                    <br />
                    <hr />
                    <br />
                    {tipo === "Profesor" && !curso.calificacion ? (
                        <div>
                            <form onSubmit={calificarCurso}>
                                <Typography variant='h6'>
                                    Calificar alumno
                                </Typography>
                                <TextField
                                    style={{
                                        color: 'black', backgroundColor: 'white', border: "1px solid #ddd",
                                        borderRadius: "8px", width: '10%'
                                    }}
                                    name="calificacion"
                                    type='number'
                                    value={calificacion}
                                    autoComplete='off'
                                    fullWidth
                                    margin="normal"
                                    onChange={handleCalificacionCurso}
                                    required
                                />
                                <br />
                                <Button disabled={profesor.baneado} type="submit" variant="contained" color="secondary">
                                    Subir calificación
                                </Button>
                            </form>
                        </div>
                    ) : (

                        <Typography variant='h3'>
                            Calificacion Final: {curso.calificacion}
                        </Typography>
                    )}
                </Grid>
            </Grid>
        </div>
    )
}

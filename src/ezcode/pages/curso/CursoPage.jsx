import { useNavigate, useParams } from "react-router-dom";
import { ChangeCursoNav } from "../../components/ChangeCursoNav";
import { Tab, Grid, IconButton, List, ListItem, ListItemText, Paper, Typography, Button, Input } from '@mui/material';
import React, { useEffect, useState } from "react";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Descripcion } from "./components/Descripcion";
import { AgendarSesion } from "./components/AgendarSesion";
import { ChatSocket } from "./components/ChatSocket";
import { SubirTarea } from "./components/SubirTarea";
import { Reseña } from "./components/Reseña";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import PaymentIcon from '@mui/icons-material/Payment';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import ezcodeApi from "../../../api/ezcodeApi";
import Swal from "sweetalert2";

export const CursoPage = () => {
    const tipo = localStorage.getItem('tipo');
    const { id } = useParams();
    const navigate = useNavigate();
    const [value, setValue] = useState(1);
    const [curso, setCurso] = useState({});
    const [alumno, setAlumno] = useState({});
    const [profesor, setProfesor] = useState({});
    const [temas, setTemas] = useState([]);
    const [temaSeleccionado, setTemaSeleccionado] = useState(null);
    const [file, setFile] = useState(null);

    useEffect(() => {
        const fetchTemas = async () => {
            try {
                const responseCurso = await ezcodeApi.get(`curso/${id}`);
                const courseDataFromServer = responseCurso.data.curso;
                setCurso(courseDataFromServer);

                const responseAlumno = await ezcodeApi.get(`user/${courseDataFromServer.alumno}`);
                const alumnoDataFromServer = responseAlumno.data.alumno;
                setAlumno(alumnoDataFromServer);

                const responseProfesor = await ezcodeApi.get(`profesor/${courseDataFromServer.profesor}`);
                const profesorDataFromServer = responseProfesor.data.profesor;
                setProfesor(profesorDataFromServer);

                const response = await ezcodeApi.get(`/curso/temas/${id}`);
                setTemas(response.data.temas);
            } catch (error) {
                console.error('Error al obtener temas:', error);
            }
        };

        fetchTemas();
    }, []);

    const crearCarpeta = async () => {
        try {
            const response = await ezcodeApi.post(`drive/${alumno.correo}/${profesor.correo}/${curso.nombre}/${id}`);
            const result = await Swal.fire({
                title: `Carpeta ${curso.nombre} creada en Drive`,
                text: `Carpeta compartida con ${alumno.correo}`,
                icon: "success",
                confirmButtonText: 'Ok',
            })
            if (result.isConfirmed) {
                window.location.reload(false);
            }
        } catch (error) {
            console.log(error);
        }
    }

    const handlePago = async (tema) => {
        const responsePago = await ezcodeApi.post(`pago/create-order-tema/${tema.nombre}/${tema.precio}/${tema._id}`);
        window.open(responsePago.data.links[1].href, '_blank');

        if (responsePago.data.links[1].rel === "approve") {
            const result = await Swal.fire({
                title: 'Evento Procesado',
                text: 'Se desbloqueará el tema si el pago de Paypal fue exitoso',
                icon: "success",
                confirmButtonText: 'Ok',
            })
            if (result.isConfirmed) {
                window.location.reload(false);
            }
        }
    };

    const borrarTema = async (tema) => {
        try {
            const result = await Swal.fire({
                title: '¿Estás seguro?',
                text: 'Estás a punto de borrar este tema. Esta acción no se puede deshacer.',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Continuar',
                cancelButtonText: 'Cancelar',
            });

            if (result.isConfirmed) {
                await ezcodeApi.delete(`curso/tema/${id}/${tema._id}`);
                window.location.reload(false);
            }
        } catch (error) {
            Swal.fire('Error', 'Hubo un error al borrar el tema', 'error');
        }
    };

    const handleTabChange = (event, newValue) => {
        setValue(newValue);
    };

    const handleTemaClick = (tema) => {
        setTemaSeleccionado(tema);
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async (folderId) => {
        if (!file) {
            return;
        }

        try {
            const formData = new FormData();
            formData.append('archivo', file);

            const response = await ezcodeApi.post(`drive/upload/${folderId}`, formData);
            const url = response.data.fileUrlEmbedded

            const result = await Swal.fire({
                title: 'Archivo subido a la carpeta',
                icon: 'success',
                confirmButtonText: 'Crear tema con el archivo',
                showCancelButton: true,
                cancelButtonText: 'Continuar'
            });

            if (result.isConfirmed) {
                navigate(`/profesor/curso/tema/crear/${id}/${encodeURIComponent(url)}`)
            }

        } catch (err) {
            Swal.fire({
                title: `${err.response.data.msg}`,
                text: 'Extensiones compatibles: jpg, jpeg, png, pdf, mp4, docx, pptx, xlsx',
                icon: 'error',
                confirmButtonText: 'Ok',
            });
        }
    };

    return (
        <div>
            <ChangeCursoNav />
            <Grid container style={{ height: '50vh' }}>
                <Grid item xs={8} style={{ height: '100%' }}>
                    <Paper style={{ height: '100%', overflowY: 'scroll' }}>
                        {temaSeleccionado && (
                            <div >
                                {temaSeleccionado.url && (
                                    <iframe
                                        allowFullScreen
                                        width="100%"
                                        height="504px"
                                        src={temaSeleccionado.url}
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                    />
                                )}
                                {temaSeleccionado.contenido && !temaSeleccionado.url && (
                                    <Grid style={{ alignContent: 'justify', alignItems: 'center', display: 'flex', flexDirection: 'column' }}>
                                        <Typography variant="h4" gutterBottom>
                                            {temaSeleccionado.nombre}
                                        </Typography>
                                        <br />
                                        <Typography variant="body1" paragraph>
                                            {temaSeleccionado.contenido}
                                        </Typography>
                                    </Grid>
                                )}
                            </div>
                        )}
                    </Paper>
                </Grid>

                <Grid item xs={4} style={{ height: '100%' }}>
                    <Paper style={{ height: '100%', padding: 10, overflowY: 'scroll' }}>
                        <React.Fragment>
                            {temas.map((tema, index) => (
                                <List key={index}>
                                    {tema.pagado == true ? (
                                        <ListItem
                                            style={{
                                                border: "1px solid #ddd",
                                                borderRadius: "8px",
                                                margin: "8px",
                                                cursor: 'pointer',
                                                backgroundColor: temaSeleccionado === tema ? '#eee' : 'inherit',
                                            }}
                                            onClick={() => handleTemaClick(tema)}
                                        >
                                            <ListItemText
                                                primary={
                                                    <Grid style={{ display: "flex" }}>
                                                        <span style={{ flexGrow: 1 }}>
                                                            Tema: {tema.nombre}
                                                        </span>
                                                    </Grid>
                                                }
                                            />
                                        </ListItem>
                                    ) : (
                                        <ListItem
                                            style={{
                                                border: "1px solid #ddd",
                                                borderRadius: "8px",
                                                margin: "8px",
                                            }}
                                            secondaryAction={
                                                tipo === "Alumno" ? (
                                                    <Grid>
                                                        <IconButton
                                                            edge="end"
                                                            sx={{ marginRight: "8px", backgroundColor: "#000000", color: "white" }}
                                                            onClick={() => handlePago(tema)}
                                                        >
                                                            <PaymentIcon />
                                                        </IconButton>
                                                    </Grid>
                                                ) : (
                                                    <Grid>
                                                        <IconButton
                                                            edge="end"
                                                            aria-label="update"
                                                            style={{ marginRight: "8px" }}
                                                            onClick={() => navigate(`/profesor/curso/tema/editar/${id}/${tema._id}`)}
                                                        >
                                                            <EditIcon />
                                                        </IconButton>
                                                        <IconButton
                                                            edge="end"
                                                            aria-label="delete"
                                                            style={{ marginRight: "8px" }}
                                                            onClick={() => borrarTema(tema)}
                                                        >
                                                            <DeleteIcon />
                                                        </IconButton>
                                                    </Grid>
                                                )
                                            }
                                        >
                                            <ListItemText
                                                primary={
                                                    <Grid style={{ display: "flex" }}>
                                                        <span style={{ flexGrow: 1 }}>
                                                            Tema no pagado: {tema.nombre}
                                                        </span>
                                                        <span style={{ flexGrow: 1 }}>
                                                            Precio: {tema.precio}MXN
                                                        </span>
                                                    </Grid>
                                                }
                                            />
                                        </ListItem>
                                    )}
                                </List>
                            ))}
                        </React.Fragment>
                        {tipo === "Profesor" && curso.carpeta == '' ? (
                            <div>
                                <Button variant="contained"
                                    disabled={curso.carpeta != ''}
                                    onClick={() => crearCarpeta()}
                                >
                                    Crear Carpeta de Drive
                                </Button>
                            </div>
                        ) : null
                        }
                        <br />
                        {tipo === "Profesor" && curso.carpeta != '' ? (
                            <div style={{ alignItems: 'center', justifyContent: 'center' }}>
                                <Button disabled={curso.acreditado} variant="contained" style={{ marginRight: '20px' }} onClick={() => navigate(`/profesor/curso/crearTema/${id}`)}>
                                    Agregar tema
                                </Button>
                                <br />
                                <br />
                                <div>
                                    <Input
                                        disabled={curso.acreditado}
                                        type="file"
                                        onChange={handleFileChange}
                                    />
                                    <IconButton disabled={!file} onClick={() => handleUpload(curso.carpeta)}>
                                        <CloudUploadIcon />
                                    </IconButton>
                                </div>
                            </div>
                        ) : null
                        }
                    </Paper>
                </Grid>
            </Grid>
            <TabContext value={value}>
                <TabList onChange={handleTabChange} centered sx={{
                    background: 'rgba(0, 0, 0, 0.7)',
                }}>
                    <Tab label="Descripción" value={1} sx={{ flexGrow: 1, color: 'white' }} />
                    <Tab label="Agendar Sesión" value={2} sx={{ flexGrow: 1, color: 'white' }} />
                    <Tab label="Chat" value={3} sx={{ flexGrow: 1, color: 'white' }} />
                    <Tab label="Actividades" value={4} sx={{ flexGrow: 1, color: 'white' }} />
                    <Tab label="Reseñas" value={5} sx={{ flexGrow: 1, color: 'white' }} />
                </TabList>
                <div className="backHome">
                    <TabPanel value={1}>
                        <Descripcion id={id} />
                    </TabPanel>
                    <TabPanel value={2}>
                        <AgendarSesion id={id} />
                    </TabPanel>
                    <TabPanel value={3}>
                        <ChatSocket id={id} />
                    </TabPanel>
                    <TabPanel value={4}>
                        <SubirTarea id={id} />
                    </TabPanel>
                    <TabPanel value={5}>
                        <Reseña id={id} />
                    </TabPanel>
                </div>
            </TabContext>
        </div >
    )
}

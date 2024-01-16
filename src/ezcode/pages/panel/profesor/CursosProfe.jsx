import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { Avatar, Grid, IconButton, List, ListItem, ListItemAvatar, ListItemText, Paper, Typography } from "@mui/material"
import Pagination from "@mui/material/Pagination";
import { ProfeNav } from "../../../components/ProfeNav"
import LoginIcon from '@mui/icons-material/Login';
import ezcodeApi from "../../../../api/ezcodeApi";

export const CursosProfe = () => {
    const token = localStorage.getItem('token');
    const decodedToken = jwtDecode(token);
    const userId = decodedToken.uid;

    const [cursos, setCursos] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [imageUrls, setImageUrls] = useState({});
    const navigate = useNavigate();

    const itemsPerPage = 5;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const displayedCursos = cursos.slice(startIndex, endIndex);

    const obtenerUrlImagenCurso = async (idCurso) => {
        try {
            const response = await ezcodeApi.get(`uploads/cursos/${idCurso}`, { responseType: 'arraybuffer' });
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
                const response = await ezcodeApi.get(`profesor/${userId}`);
                const userDataFromServer = response.data.profesor;
                if (userDataFromServer) {
                    try {
                        const cursosResponse = await ezcodeApi.get(`busqueda/cursos/${userDataFromServer.correo}`);
                        setCursos(cursosResponse.data.results);
                        const urls = {};
                        for (const curso of cursosResponse.data.results) {
                            const url = await obtenerUrlImagenCurso(curso.uid);
                            urls[curso.uid] = url;
                        }
                        setImageUrls(urls);
                    } catch (error) {
                        console.log(error);
                    }
                }
            } catch (error) {
                console.log(error);
            }
        };

        fetchData();
    }, []);

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
                        Mis cursos
                    </Typography>
                    <Grid>
                        {cursos !== undefined && cursos !== null && cursos.length > 0 ? (
                            <React.Fragment>
                                <List>
                                    {displayedCursos.map((curso, index) => (
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
                                                        disabled={curso.profesor.baneado}
                                                        edge="end"
                                                        aria-label="delete"
                                                        style={{ marginRight: "8px" }}
                                                        onClick={() => navigate(`/profesor/cursoView/${curso.uid}`)}
                                                    >
                                                        <LoginIcon />
                                                    </IconButton>
                                                </Grid>
                                            }
                                        >
                                            <ListItemAvatar>
                                                <Avatar>
                                                    <img
                                                        src={imageUrls[curso.uid]}
                                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                    />
                                                </Avatar>
                                            </ListItemAvatar>
                                            <ListItemText
                                                primary={
                                                    <Grid style={{ display: "flex" }}>
                                                        <span style={{ flexGrow: 1 }}>
                                                            Curso: {curso.nombre}
                                                        </span>
                                                        <span style={{ flexGrow: 1 }}>
                                                            Categoría: {curso.categoria}
                                                        </span>
                                                        <span style={{ flexGrow: 1 }}>
                                                            Estatus: {curso.acreditado ? "Terminado" : "Activo"}
                                                            <span style={{ color: curso.acreditado ? "green" : "red", marginLeft: 5 }}>{'\u25CF'}</span>
                                                        </span>
                                                    </Grid>
                                                }
                                                secondary={
                                                    <Grid style={{ display: "flex" }}>
                                                        <span style={{ marginRight: "20px" }}>
                                                            Alumno: {curso.alumno.nombre} {curso.alumno.apellido}
                                                        </span>
                                                        <span>{curso.alumno.correo}</span>
                                                    </Grid>
                                                }
                                            />
                                        </ListItem>
                                    ))}
                                </List>
                                <Pagination
                                    count={Math.ceil(cursos.length / itemsPerPage)}
                                    page={currentPage}
                                    onChange={handlePageChange}
                                    style={{ marginTop: "16px" }}
                                />
                            </React.Fragment>
                        ) : (
                            <Typography sx={{ mt: 4, mb: 2 }}>
                                No hay cursos activos en tu cuenta
                            </Typography>
                        )}
                    </Grid>
                </Paper>
            </Grid>
        </div>
    )
}

import React, { useEffect, useState } from "react";
import { Avatar, Grid, List, ListItem, ListItemAvatar, ListItemText, Pagination, Typography, Rating, Button, Box } from '@mui/material';
import ezcodeApi from "../../../../api/ezcodeApi";
import Swal from "sweetalert2";

export const Reseña = ({ id }) => {
    const [value, setValue] = useState(0);
    const [resenas, setResenas] = useState([]);
    const [anuncio, setAnuncio] = useState({});
    const [alumno, setAlumno] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const [imageUrls, setImageUrls] = useState({});

    const itemsPerPage = 5;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const displayedResenas = resenas.slice(startIndex, endIndex);

    const obtenerUrlImagenUser = async (idUser) => {
        try {
            const response = await ezcodeApi.get(`uploads/clientes/${idUser}`, { responseType: 'arraybuffer' });
            const byteArray = new Uint8Array(response.data);
            const imageDataFromServer = `data:image/png;base64,${btoa(String.fromCharCode.apply(null, byteArray))}`;
            return imageDataFromServer;
        } catch (error) {
            console.error('Error al obtener datos de usuario:', error);
            return null;
        }
    };

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await ezcodeApi.get(`curso/${id}`);
                const courseDataFromServer = response.data.curso;

                const anuncioId = courseDataFromServer.anuncio;

                const respAnuncio = await ezcodeApi.get(`anuncio/${anuncioId}`);
                setAnuncio(respAnuncio.data.anuncio);

                const respResena = await ezcodeApi.get(`anuncio/resenas/${anuncioId}`);
                const resenasResp = respResena.data
                setResenas(respResena.data);

                const idAlumno = courseDataFromServer.alumno
                const respUser = await ezcodeApi.get(`user/${idAlumno}`);
                setAlumno(respUser.data.alumno);

                const urls = {};
                for (const resena of resenasResp) {
                    const url = await obtenerUrlImagenUser(resena.alumno.uid);
                    urls[resena.alumno.uid] = url;
                }
                setImageUrls(urls);

            } catch (error) {
                console.error('Error al obtener datos de usuario:', error);
            }
        };

        fetchUserData();
    }, []);

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };

    const hanldeSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await ezcodeApi.post(`anuncio/resenas/${anuncio.uid}/${alumno.uid}`, { estrellas: value });
            if (response) {
                const result = await Swal.fire({
                    title: 'Reseña enviada',
                    icon: "success",
                    confirmButtonText: 'Ok',
                });

                if (result.isConfirmed) {
                    window.location.reload(false)
                }
            }
        } catch (error) {
            Swal.fire({
                title: 'Algo salió mal',
                icon: "error",
                text: `${error.response ? error.response.data.error : 'Error desconocido'}`,
                confirmButtonText: 'Ok',
            })
        }
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
                    Reseñas del curso
                </Typography>
                <Grid>
                    {resenas !== undefined && resenas !== null && resenas.length > 0 ? (
                        <React.Fragment>
                            <List>
                                {displayedResenas.map((resena, index) => (
                                    <ListItem
                                        key={index}
                                        style={{
                                            border: "1px solid #ddd",
                                            borderRadius: "8px",
                                            margin: "8px",
                                        }}
                                    >
                                        <ListItemAvatar>
                                            <Avatar>
                                                <img
                                                    src={imageUrls[resena.alumno.uid]}
                                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                />
                                            </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={
                                                <Grid style={{ display: "flex" }}>
                                                    <span style={{ flexGrow: 1 }}>
                                                        Alumno: {resena.alumno.nombre} {resena.alumno.apellido}
                                                    </span>
                                                    <div style={{ flexGrow: 1 }}>
                                                        <Rating name="read-only" value={resena.estrellas} readOnly style={{ color: 'white', fontSize: '40px', backgroundColor: 'rgba(255, 255, 255, 0.2)', width: '23%', borderRadius: '8px' }} />
                                                    </div>
                                                </Grid>
                                            }
                                            secondary={
                                                <Grid style={{ display: "flex", color: 'white' }}>
                                                    <span>
                                                        Correo: {resena.alumno.correo}
                                                    </span>
                                                </Grid>
                                            }
                                        />
                                    </ListItem>
                                ))}
                            </List>
                            <Pagination
                                count={Math.ceil(resenas.length / itemsPerPage)}
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
                            No hay reseñas del anuncio de este curso
                        </Typography>
                    )}
                </Grid>
                <br />
                <hr />
                <br />
                <Typography variant="h4">Calificar Curso</Typography>
                <br />
                <p>El valor que subas formara parte de la calificacion total del anuncio ligado a este curso publicado en la pagina, solo se puede publicar la reseña una vez </p>
                <p>Las reseñas publicadas por usuarios se mostraran en la parte superior de esta seccion del curso</p>
                <br />
                <form onSubmit={hanldeSubmit}>
                    <Grid style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', width: '14%', borderRadius: '8px' }}>
                        <Rating
                            style={{
                                fontSize: '50px',
                                color: 'white'
                            }}
                            name="estrellas"
                            value={value}
                            onChange={(event, newValue) => {
                                setValue(newValue);
                            }}
                        />
                    </Grid>
                    <br />
                    <br />
                    <Button type="submit" variant="contained" color="secondary">
                        Subir Reseña
                    </Button>
                </form>
            </Grid>
        </div>
    )
}

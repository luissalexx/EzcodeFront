import { useNavigate, useParams } from "react-router-dom"
import { ChangeCursoNav } from "../../../components/ChangeCursoNav";
import { Button, FormControl, FormControlLabel, Grid, Radio, RadioGroup, TextField, TextareaAutosize, Typography } from "@mui/material";
import ezcodeApi from "../../../../api/ezcodeApi";
import Swal from "sweetalert2";
import { useEffect, useState } from "react";

export const TemaEdit = () => {
    const { id, idTema } = useParams();
    const navigate = useNavigate();
    const [categoria, setCategoria] = useState('');

    const [formData, setFormData] = useState({
        nombre: '',
        contenido: '',
        url: '',
        precio: 0,
    });

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await ezcodeApi.get(`curso/tema/${id}/${idTema}`);
                const temaDataFromServer = response.data.temaEncontrado;

                if (temaDataFromServer) {

                    if (temaDataFromServer.url) {
                        setCategoria('Url')
                    } else if (temaDataFromServer.contenido) {
                        setCategoria('Contenido')
                    }

                    setFormData({
                        nombre: temaDataFromServer.nombre || '',
                        precio: temaDataFromServer.precio || '',
                        contenido: temaDataFromServer.contenido || '',
                        url: temaDataFromServer.url || '',
                    });
                } else {
                    console.error('No se encontraron temas en la respuesta del servidor');
                }
            } catch (error) {
                console.error('Error al obtener datos de tema:', error);
            }
        };

        fetchUserData();
    }, []);

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        try {
            if (categoria === 'Url') {
                if (formData.url.includes('https://drive.google.com/file/d/')) {
                    await ezcodeApi.put(`curso/tema/${id}/${idTema}`, formData);
                    Swal.fire({
                        icon: 'success',
                        title: 'Success',
                        text: 'Tema editado exitosamente!',
                        confirmButtonText: 'Ok'
                    });
                    navigate(-1);
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'Solo se permiten url embebidos de drive',
                        confirmButtonText: 'Ok'
                    });
                }
            }

            if (categoria === 'Contenido') {
                await ezcodeApi.put(`curso/tema/${id}/${idTema}`, formData);
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: 'Tema editado exitosamente!',
                    confirmButtonText: 'Ok'
                });
                navigate(-1);
            }
        } catch (error) {
            console.log(error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Hubo un problema al editar el tema. Inténtelo de nuevo.',
                confirmButtonText: 'Ok'
            });
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: name === 'precio' ? parseFloat(value) : value,
        }));
    };

    return (
        <div className="back">
            <ChangeCursoNav />
            <Grid
                container
                spacing={0}
                direction="column"
                alignItems="center"
                justifyContent="center"
                sx={{ minHeight: '100vh', padding: 4 }}
            >

                <Grid item
                    className='box-shadow'
                    xs={3}
                    sx={{
                        width: { sm: 450 },
                        backgroundColor: 'white',
                        padding: 3,
                        borderRadius: 2
                    }}>

                    <Typography variant='h5' sx={{ mb: 1 }}>Editar Tema</Typography>
                    <p>Los temas que no tengan precio pasaran a ser como temas pagados, los temas pagados no se pueden borrar ni editar, los temas no pueden cambiar de categoria en su contenido</p>
                    <form onSubmit={handleFormSubmit}>
                        <TextField
                            label="Nombre"
                            name="nombre"
                            value={formData.nombre}
                            fullWidth
                            margin="normal"
                            autoComplete='off'
                            onChange={handleChange}
                            required
                        />
                        {categoria === 'Contenido' ? (
                            <FormControl fullWidth>
                                <label>Texto</label>
                                <TextareaAutosize
                                    onChange={handleChange}
                                    name="contenido"
                                    color="neutral"
                                    value={formData.contenido}
                                    minRows={10}
                                    maxRows={10}
                                    style={{
                                        fontFamily: 'Arial',
                                        fontSize: '16px',
                                        resize: 'none',
                                        width: '100%',
                                    }}
                                    required
                                />
                            </FormControl>
                        ) : null}
                        {categoria === 'Url' ? (
                            <TextField
                                label="Url"
                                name="url"
                                type="url"
                                value={formData.url}
                                fullWidth
                                autoComplete='off'
                                onChange={handleChange}
                                required
                                helperText="Por favor introduce un url valido"
                            />
                        ) : null}
                        <TextField
                            label="Precio"
                            name="precio"
                            type='number'
                            value={formData.precio}
                            fullWidth
                            margin="normal"
                            autoComplete='off'
                            onChange={handleChange}
                            required
                        />
                        <br />
                        <hr />
                        <Button type="submit" variant="contained" color="primary">
                            Actualizar Tema
                        </Button>
                        <Button onClick={() => navigate(-1)} color="primary">
                            Volver
                        </Button>
                    </form>
                </Grid>
            </Grid>
        </div>
    )
}


import { FormControlLabel, Grid, Radio, RadioGroup, TextField, Typography, FormControl, TextareaAutosize, Button } from "@mui/material"
import { ChangeCursoNav } from "../../../components/ChangeCursoNav"
import { useState } from "react";
import Swal from "sweetalert2";
import ezcodeApi from "../../../../api/ezcodeApi";
import { useParams } from "react-router-dom";
import { useNavigate } from 'react-router-dom';

export const TemaCreate = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        nombre: '',
        contenido: '',
        url: '',
        precio: 0,
        categoria: 'Contenido'
    });

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: name === 'precio' ? parseFloat(value) : value,
        }));
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        try {
            if (formData.categoria === 'Url' && formData.url.includes('https://drive.google.com/file/d/')) {
                await ezcodeApi.post(`curso/tema/${id}`, formData);
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: 'Tema creado exitosamente!',
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

            if (formData.categoria === 'Contenido') {
                await ezcodeApi.post(`curso/tema/${id}`, formData);
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: 'Tema creado exitosamente!',
                    confirmButtonText: 'Ok'
                });
                navigate(-1);
            }
        } catch (error) {
            console.error('Error:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Hubo un problema al crear el tema. Inténtelo de nuevo.',
                confirmButtonText: 'Ok'
            });
        }
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

                    <Typography variant='h5' sx={{ mb: 1 }}>Crear Tema</Typography>
                    <p>Los temas que no tengan precio pasaran a ser como temas pagados, los temas pagados no se pueden borrar ni editar</p>
                    <form onSubmit={handleFormSubmit}>
                        <TextField
                            label="Nombre"
                            name="nombre"
                            value={formData.nombre}
                            fullWidth
                            autoComplete='off'
                            margin="normal"
                            onChange={handleChange}
                            required
                        />
                        <FormControl>
                            <RadioGroup
                                row
                                aria-labelledby="demo-row-radio-buttons-group-label"
                                name="categoria"
                                value={formData.categoria}
                                onChange={handleChange}
                            >
                                <FormControlLabel value="Contenido" control={<Radio />} label="Texto" />
                                <FormControlLabel value="Url" control={<Radio />} label="Url" />
                            </RadioGroup>
                        </FormControl>
                        {formData.categoria === 'Contenido' && (
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
                        )}
                        {formData.categoria === 'Url' && (
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
                        )}
                        <TextField
                            label="Precio"
                            name="precio"
                            type='number'
                            value={formData.precio}
                            fullWidth
                            autoComplete='off'
                            margin="normal"
                            onChange={handleChange}
                            required
                        />
                        <br />
                        <hr />
                        <Button type="submit" variant="contained" color="primary">
                            Crear Tema
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

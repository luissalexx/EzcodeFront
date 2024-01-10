import React, { useState } from 'react'
import { Grid, TextField, Typography, Button, TextareaAutosize } from "@mui/material"
import { ChangeCursoNav } from '../../../components/ChangeCursoNav'
import { useNavigate, useParams } from 'react-router-dom';
import ezcodeApi from '../../../../api/ezcodeApi';
import Swal from 'sweetalert2';

export const TareaCreate = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        nombre: '',
        asignacion: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value
        }));
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        try {
            await ezcodeApi.post(`curso/tarea/${id}`, formData);
            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'Tarea creada exitosamente!',
                confirmButtonText: 'Ok'
            });

            navigate(-1);
        } catch (error) {
            console.error('Error:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Hubo un problema al crear la tarea. Inténtelo de nuevo.',
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

                    <Typography variant='h5' sx={{ mb: 1 }}>Crear Tarea</Typography>
                    <p>Las tareas creadas se mostraran el el curso para que el alumno las vea y suba una url con la tarea asignada</p>
                    <form onSubmit={handleFormSubmit}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    autoComplete='off'
                                    label="Nombre"
                                    variant="outlined"
                                    fullWidth
                                    id="nombre"
                                    name="nombre"
                                    required
                                    value={formData.nombre}
                                    onChange={handleInputChange}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextareaAutosize
                                    id="asignacion"
                                    name="asignacion"
                                    color="neutral"
                                    minRows={10}
                                    maxRows={10}
                                    value={formData.asignacion}
                                    onChange={handleInputChange}
                                    style={{ fontFamily: 'Arial', fontSize: '16px', resize: 'none', width: '100%' }}
                                    placeholder='Escribe aqui la asignacion'
                                    required />
                            </Grid>
                        </Grid>
                        <br />
                        <Button type="submit" variant="contained" color="primary">
                            Crear Tarea
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

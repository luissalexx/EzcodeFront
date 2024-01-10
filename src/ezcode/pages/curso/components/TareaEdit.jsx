import React, { useEffect, useState } from 'react'
import { Grid, TextField, Typography, Button, TextareaAutosize } from "@mui/material"
import { ChangeCursoNav } from '../../../components/ChangeCursoNav'
import { useNavigate, useParams } from 'react-router-dom';
import ezcodeApi from '../../../../api/ezcodeApi';
import Swal from 'sweetalert2';

export const TareaEdit = () => {
    const { id, tareaId } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        nombre: '',
        asignacion: ''
    });

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await ezcodeApi.get(`curso/tarea/${id}/${tareaId}`);
                const tareaDataFromServer = response.data;

                if (tareaDataFromServer) {

                    setFormData({
                        nombre: tareaDataFromServer.nombre || '',
                        asignacion: tareaDataFromServer.asignacion || '',
                    });
                } else {
                    console.error('No se encontraron tareas en la respuesta del servidor');
                }
            } catch (error) {
                console.error('Error al obtener datos de tarea:', error);
            }
        };

        fetchUserData();
    }, []);

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        try {
            await ezcodeApi.put(`curso/asignacion/${id}/${tareaId}`, formData);
            Swal.fire({
                title: 'Datos actualizados con éxito',
                icon: 'success',
                confirmButtonText: 'Ok',
            }).then((result) => {
                if (result.isConfirmed) {
                    navigate(-1);
                }
            });
        } catch (error) {
            console.log(error)
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value
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

                    <Typography variant='h5' sx={{ mb: 1 }}>Editar Tarea</Typography>
                    <br />
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
                            Editar Tarea
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
